import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PUBLIC_DIR = path.join(ROOT, "public");

export function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `portfolio-${prefix}-`));
}

/**
 * Start tags in HTML written by rehype-stringify or the prerender templates.
 * Both always double-quote attribute values and entity-encode `<` and `"`
 * inside text and values, so a tag can only start at a literal `<` and every
 * attribute is `name` or `name="..."`. Anything else fails loudly.
 */
export function startTags(html) {
  const tags = [];
  const re = /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:="[^"]*")?)*)\s*\/?>/g;
  for (const m of html.matchAll(re)) {
    const attrs = {};
    for (const a of m[2].matchAll(/([^\s"'>/=]+)(?:="([^"]*)")?/g)) attrs[a[1].toLowerCase()] = a[2] ?? "";
    tags.push({ name: m[1].toLowerCase(), attrs });
  }
  return tags;
}

const DANGEROUS_TAGS = new Set(["script", "iframe", "object", "embed", "svg", "math", "style", "link", "meta", "base", "form", "frame", "frameset"]);
const URL_ATTRS = ["href", "src", "action", "formaction", "xlink:href", "srcset", "poster"];

const decode = (v) =>
  v
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&colon;/gi, ":")
    .replace(/&tab;|&newline;/gi, "")
    .replace(/&amp;/g, "&");

/** Problems a browser would execute: dangerous elements, handlers, script URLs. */
export function unsafeParts(html) {
  const problems = [];
  for (const { name, attrs } of startTags(html)) {
    if (DANGEROUS_TAGS.has(name)) problems.push(`<${name}>`);
    for (const [attr, value] of Object.entries(attrs)) {
      if (attr.startsWith("on")) problems.push(`${name}[${attr}]`);
      if (attr === "style") problems.push(`${name}[style]`);
      if (URL_ATTRS.includes(attr)) {
        // Browsers drop ASCII whitespace/control characters before the scheme.
        const url = [...decode(value)].filter((c) => c.codePointAt(0) > 0x20).join("").toLowerCase();
        if (/^(javascript|vbscript|data):/.test(url)) problems.push(`${name}[${attr}=${value}]`);
      }
    }
  }
  return problems;
}

export const count = (haystack, needle) => haystack.split(needle).length - 1;
