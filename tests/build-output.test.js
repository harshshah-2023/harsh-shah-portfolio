import { before, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { build } from "vite";
import { loadAllPosts } from "../tools/blog/content.js";
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from "../tools/security-headers.js";
import { PUBLIC_DIR, ROOT, count, startTags, tempDir } from "./helpers.js";

// One real production build (the project's own vite.config.js) into a temp dir.
const outDir = tempDir("build");
let files = [];
let published = [];
let drafts = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
const read = (rel) => fs.readFileSync(path.join(outDir, rel), "utf8");
const textFiles = () => files.filter((f) => /\.(js|css|html|xml|txt)$/.test(f));

before(async () => {
  await build({ root: ROOT, logLevel: "silent", build: { outDir, emptyOutDir: true } });
  files = walk(outDir);
  const all = await loadAllPosts({ contentDir: path.join(ROOT, "content/blog"), publicDir: PUBLIC_DIR, includeDrafts: true });
  published = all.filter((p) => !p.meta.draft);
  drafts = all.filter((p) => p.meta.draft);
});

test("every published post is prerendered as a well-formed page", () => {
  assert.ok(published.length > 0);
  for (const { meta } of published) {
    for (const rel of [`blog/${meta.slug}.html`, `blog/${meta.slug}/index.html`]) {
      const html = read(rel);
      assert.equal(count(html, "<head>"), 1, rel);
      assert.equal(count(html, "</body>"), 1, rel);
      assert.equal(count(html, '<script type="module"'), 1, rel);
      assert.ok(html.includes(`<link rel="canonical" href="https://`), rel);
    }
  }
  const sitemap = read("sitemap.xml");
  for (const { meta } of published) assert.ok(sitemap.includes(`/blog/${meta.slug}</loc>`), meta.slug);
});

test("drafts appear nowhere in the build output", () => {
  for (const { meta } of drafts) {
    assert.ok(!fs.existsSync(path.join(outDir, `blog/${meta.slug}.html`)), meta.slug);
    for (const file of textFiles()) {
      const text = fs.readFileSync(file, "utf8");
      assert.ok(!text.includes(meta.title), `draft title in ${path.relative(outDir, file)}`);
      assert.ok(!text.includes(`blog/${meta.slug}`) || text.includes(`/blog/images/${meta.slug}`), `draft slug in ${path.relative(outDir, file)}`);
    }
  }
});

test("no source maps, local paths or dev-server code ship", () => {
  assert.deepEqual(files.filter((f) => f.endsWith(".map")), []);
  for (const file of textFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(outDir, file);
    assert.ok(!text.includes("sourceMappingURL"), rel);
    assert.ok(!text.includes(ROOT) && !text.includes(ROOT.replace(/\\/g, "/")), `absolute repo path in ${rel}`);
    assert.ok(!text.includes("/@vite/client") && !text.includes("__open-in-editor"), rel);
  }
});

test("local article images keep intrinsic width/height", () => {
  const imgs = startTags(read("blog/understanding-rag.html")).filter((t) => t.name === "img" && t.attrs.loading === "lazy");
  assert.ok(imgs.length > 0);
  for (const img of imgs) assert.ok(Number(img.attrs.width) > 0 && Number(img.attrs.height) > 0, img.attrs.src);
});

test("CSP allows exactly the inline scripts the build emits", () => {
  const scriptSrc = CONTENT_SECURITY_POLICY.split("; ").find((d) => d.startsWith("script-src "));
  assert.ok(!/'unsafe-inline'|'unsafe-eval'/.test(scriptSrc), "no unsafe script sources");
  const emitted = new Set();
  for (const file of files.filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(file, "utf8");
    // JSON-LD is data, not executed, so CSP does not apply to it.
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
      // Browsers hash the script after the HTML parser turns CRLF into LF.
      const text = m[1].replace(/\r\n?/g, "\n");
      const hash = `'sha256-${crypto.createHash("sha256").update(text, "utf8").digest("base64")}'`;
      emitted.add(hash);
      assert.ok(scriptSrc.includes(hash), `inline script in ${path.relative(outDir, file)} is not in the CSP (${hash}); update tools/security-headers.js`);
    }
  }
  const allowed = scriptSrc.match(/'sha256-[^']+'/g);
  assert.deepEqual([...emitted].sort(), allowed.sort(), "CSP lists no stale hashes");
  assert.ok("Content-Security-Policy-Report-Only" in SECURITY_HEADERS, "CSP stays Report-Only until validated");
});

test("every target=_blank link in article HTML has rel=noopener", () => {
  for (const { meta } of published) {
    for (const a of startTags(read(`blog/${meta.slug}.html`)).filter((t) => t.attrs.target === "_blank")) {
      assert.ok((a.attrs.rel || "").split(" ").includes("noopener"), `${meta.slug}: ${a.attrs.href}`);
    }
  }
});
