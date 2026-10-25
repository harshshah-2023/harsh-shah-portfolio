import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { imageSize } from "image-size";
import fs from "node:fs";
import path from "node:path";

/**
 * Markdown -> safe HTML, run at build time only (nothing here ships to the
 * browser).
 *
 * Safety: remark-rehype is used without `allowDangerousHtml`, so raw HTML in
 * a post is dropped rather than passed through, and rehype-sanitize then
 * applies GitHub's allow-list (which also strips `javascript:` URLs). Every
 * element added after sanitising is generated here, never taken from input.
 */

const WORDS_PER_MINUTE = 230;

const h = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const text = (value) => ({ type: "text", value });

/** Collects the h2/h3 outline and appends a hover anchor to h2-h4. */
function rehypeHeadings(toc) {
  return () => (tree) => {
    visit(tree, "element", (node) => {
      if (!/^h[2-4]$/.test(node.tagName) || !node.properties?.id) return;
      // GFM's visually hidden "Footnotes" heading is not part of the outline.
      if ((node.properties.className || []).includes("sr-only")) return;
      const id = node.properties.id;
      const depth = Number(node.tagName[1]);
      if (depth <= 3) toc.push({ id, text: toString(node).trim(), depth });

      node.children.push(
        h(
          "a",
          { href: `#${id}`, className: ["heading-anchor"], ariaLabel: `Link to section: ${toString(node).trim()}` },
          [text("#")]
        )
      );
    });
  };
}

/**
 * Intrinsic size of an image served from public/, so the <img> can carry
 * width/height and the browser reserves its box before it loads (no layout
 * shift, and #section deep links land in the right place).
 */
function localImageSize(src, publicDir) {
  if (!publicDir || !src.startsWith("/") || src.startsWith("//")) return null;
  try {
    const file = path.resolve(publicDir, `.${decodeURI(src.split(/[?#]/)[0])}`);
    // Never read outside public/ (e.g. "/../src/secret.png").
    const rel = path.relative(publicDir, file);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) throw new Error("outside public/");
    const { width, height } = imageSize(fs.readFileSync(file));
    return width && height ? { width, height } : null;
  } catch {
    console.warn(`[blog] image "${src}" was not found in public/ or could not be read.`);
    return null;
  }
}

/** Links, images, tables and code blocks get their presentational wrappers. */
function rehypeEnhance(publicDir) {
  return () => (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "a") {
        const href = String(node.properties?.href || "");
        if (/^https?:\/\//i.test(href)) {
          node.properties.target = "_blank";
          node.properties.rel = ["noopener", "noreferrer"];
        }
        return;
      }

      if (node.tagName === "img") {
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
        const size = localImageSize(String(node.properties.src || ""), publicDir);
        if (size) Object.assign(node.properties, size);
        return;
      }

      if (!parent || index === undefined) return;

      // Wide tables scroll inside their own box instead of the page.
      if (node.tagName === "table") {
        parent.children[index] = h("div", { className: ["table-wrap"] }, [node]);
        return "skip";
      }

      if (node.tagName === "pre") {
        const code = node.children.find((c) => c.tagName === "code");
        const langClass = (code?.properties?.className || []).find((c) =>
          String(c).startsWith("language-")
        );
        const lang = langClass ? String(langClass).slice("language-".length) : "";

        parent.children[index] = h("figure", { className: ["code-block"] }, [
          h("div", { className: ["code-block__bar"] }, [
            h("span", { className: ["code-block__lang"] }, [text(lang || "text")]),
            h(
              "button",
              { type: "button", className: ["code-block__copy"], dataCopyCode: "" },
              [text("Copy")]
            ),
          ]),
          node,
        ]);
        return "skip";
      }
    });
  };
}

/**
 * @param {string} markdown body without frontmatter
 * @param {{publicDir?: string}} [options] used to read local image sizes
 * @returns {Promise<{html: string, toc: Array<{id,text,depth}>, readingTime: number, excerpt: string}>}
 */
export async function renderMarkdown(markdown, { publicDir } = {}) {
  const toc = [];
  let plain = "";

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // remark-rehype already prefixes footnote ids with "user-content-"; letting
    // the sanitiser prefix them again broke every footnote link. Ids can only
    // come from footnotes and rehype-slug here, since raw HTML is dropped.
    .use(rehypeSanitize, { ...defaultSchema, clobberPrefix: "" })
    .use(() => (tree) => {
      plain = toString(tree);
    })
    .use(rehypeSlug)
    .use(rehypeHeadings(toc))
    .use(rehypeHighlight, { detect: false })
    .use(rehypeEnhance(publicDir))
    .use(rehypeStringify);

  const html = String(await processor.process(markdown));

  const words = plain.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  return { html, toc, readingTime, excerpt: firstParagraph(markdown) };
}

/** First prose paragraph as plain text, used when `description` is omitted. */
function firstParagraph(markdown) {
  const block = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|>|```|[-*+] |\d+\. |\||!\[|<)/.test(b));
  if (!block) return "";

  const plain = block
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 180 ? `${plain.slice(0, 177).replace(/\s+\S*$/, "")}…` : plain;
}
