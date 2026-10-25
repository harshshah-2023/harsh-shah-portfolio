import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { renderMarkdown } from "./markdown.js";

export const DEFAULT_AUTHOR = "Harsh Shah";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
// A root-relative path (no "//", "/\" or ".." segments) or an https URL.
const COVER_IMAGE_RE = /^(?:\/(?![/\\])(?!(?:.*[/\\])?\.\.(?:[/\\]|$))[^\s\\]*|https:\/\/[^\s/\\]+(?:\/\S*)?)$/i;

class ContentError extends Error {
  constructor(file, message) {
    super(`[blog] ${file}: ${message}`);
  }
}

/** YAML may hand back a Date for unquoted dates; normalise to YYYY-MM-DD. */
function normaliseDate(value, file, field) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const str = String(value ?? "").trim();
  if (!DATE_RE.test(str) || Number.isNaN(Date.parse(`${str}T00:00:00Z`))) {
    throw new ContentError(file, `"${field}" must be a date written as YYYY-MM-DD (got "${str}").`);
  }
  return str;
}

function normaliseTags(value, file) {
  if (value == null || value === "") return [];
  const list = Array.isArray(value) ? value : String(value).split(",");
  const tags = list.map((t) => String(t).trim()).filter(Boolean);
  if (tags.some((t) => t.length > 40)) throw new ContentError(file, "tags must be 40 characters or fewer.");
  return [...new Set(tags)];
}

function optionalString(value, file, field) {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string") throw new ContentError(file, `"${field}" must be text.`);
  return value.trim();
}

/**
 * Reads one Markdown file into { meta, body }. Throws a ContentError naming
 * the file and field for anything that would otherwise publish a broken page.
 */
async function loadPost(filePath, publicDir) {
  const file = path.basename(filePath);
  const slug = file.replace(/\.md$/i, "");
  if (!SLUG_RE.test(slug)) {
    throw new ContentError(file, "file names become URLs, so use lowercase letters, numbers and hyphens only (e.g. my-first-post.md).");
  }

  // Strip a UTF-8 byte-order mark, which some Windows editors add.
  const source = fs.readFileSync(filePath, "utf8").replace(new RegExp("^\\u{FEFF}", "u"), "");
  const match = source.match(FRONTMATTER_RE);
  if (!match) throw new ContentError(file, "missing frontmatter. Start the file with a --- block (see BLOG_GUIDE.md).");

  let data;
  try {
    data = parseYaml(match[1]) || {};
  } catch (err) {
    throw new ContentError(file, `frontmatter is not valid YAML: ${err.message}`);
  }

  const title = optionalString(data.title, file, "title");
  if (!title) throw new ContentError(file, '"title" is required.');

  const coverImage = optionalString(data.coverImage, file, "coverImage");
  if (coverImage && !COVER_IMAGE_RE.test(coverImage)) {
    throw new ContentError(file, `"coverImage" must be a path in public/ (e.g. /blog/images/cover.svg) or an https:// URL (got "${coverImage}").`);
  }
  if (coverImage?.startsWith("/") && !fs.existsSync(path.join(publicDir, coverImage))) {
    console.warn(`[blog] ${file}: coverImage "${coverImage}" was not found in public/ - a placeholder will be shown.`);
  }

  const body = source.slice(match[0].length);
  const rendered = await renderMarkdown(body, { publicDir });

  const meta = {
    slug,
    title,
    description: optionalString(data.description, file, "description") || rendered.excerpt,
    date: normaliseDate(data.date, file, "date"),
    updated: data.updated ? normaliseDate(data.updated, file, "updated") : undefined,
    tags: normaliseTags(data.tags, file),
    author: optionalString(data.author, file, "author") || DEFAULT_AUTHOR,
    coverImage,
    coverAlt: optionalString(data.coverAlt, file, "coverAlt"),
    featured: data.featured === true,
    draft: data.draft === true,
    readingTime: rendered.readingTime,
  };

  return { meta, html: rendered.html, toc: rendered.toc };
}

/**
 * Every post in `contentDir`, newest first. Drafts are kept only when
 * `includeDrafts` is set (the dev server), so they never reach a build.
 */
export async function loadAllPosts({ contentDir, publicDir, includeDrafts }) {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .map((f) => path.join(contentDir, f));

  const posts = await Promise.all(files.map((f) => loadPost(f, publicDir)));

  return posts
    .filter((p) => includeDrafts || !p.meta.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.title.localeCompare(b.meta.title));
}
