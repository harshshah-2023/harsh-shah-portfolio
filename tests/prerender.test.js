import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadAllPosts } from "../tools/blog/content.js";
import { writeStaticOutput } from "../tools/blog/static-output.js";
import { PUBLIC_DIR, ROOT, count, tempDir, unsafeParts } from "./helpers.js";

const SITE = "https://example.test";

/** Writes posts to a temp content dir, runs the real loader + prerender, returns the outDir. */
async function prerender(files) {
  const dir = tempDir("prerender");
  const contentDir = path.join(dir, "content");
  const outDir = path.join(dir, "out");
  fs.mkdirSync(contentDir);
  fs.mkdirSync(outDir);
  // The real template, as Vite would emit it (module script in <head>).
  const template = fs
    .readFileSync(path.join(ROOT, "index.html"), "utf8")
    .replace('<script type="module" src="/src/main.jsx"></script>', "")
    .replace("</head>", '<script type="module" crossorigin src="/assets/index-test.js"></script>\n</head>');
  fs.writeFileSync(path.join(outDir, "index.html"), template);
  for (const [name, source] of Object.entries(files)) fs.writeFileSync(path.join(contentDir, name), source);

  const posts = await loadAllPosts({ contentDir, publicDir: PUBLIC_DIR, includeDrafts: false });
  writeStaticOutput({ outDir, siteUrl: SITE, posts });
  return { outDir, read: (rel) => fs.readFileSync(path.join(outDir, rel), "utf8") };
}

const post = (fm, body = "Body text.") => `---\n${fm}\n---\n${body}\n`;

function assertWellFormedPage(html) {
  assert.equal(count(html, "<head>"), 1, "one <head>");
  assert.equal(count(html, "</head>"), 1, "one </head>");
  assert.equal(count(html, "<body>"), 1, "one <body>");
  assert.equal(count(html, "</body>"), 1, "one </body>");
  assert.equal(count(html, "</html>"), 1, "one </html>");
  assert.equal(count(html, '<script type="module"'), 1, "one module script");
  assert.equal(count(html, '<div id="root">'), 1, "one root");
  assert.equal(count(html, "<title>"), 1, "one <title>");
}

// Every special replacement pattern String.prototype.replace understands.
const PATTERNS = ["$'", "$`", "$&", "$$", "$1", "$<name>", "$0"];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

test("replacement patterns in frontmatter and body are inserted literally", async () => {
  const text = `Shell ${PATTERNS.join(" ")} end`;
  const { read } = await prerender({
    "dollar.md": post(
      [
        `title: ${JSON.stringify(text)}`,
        `description: ${JSON.stringify(text)}`,
        "date: 2026-01-01",
        `author: ${JSON.stringify(text)}`,
        `tags: [${JSON.stringify("t " + PATTERNS.join(""))}]`,
      ].join("\n"),
      `Use \`echo $'a\\tb'\` and \`x=$\`\` and \`s/a/$&/\` and \`$1\`.`
    ),
  });

  for (const file of ["blog/dollar.html", "blog/dollar/index.html", "blog.html"]) {
    const html = read(file);
    assertWellFormedPage(html);
  }
  assert.ok(read("blog/dollar.html").includes(`<title>${esc(text)} — Harsh Shah</title>`), "literal article title");
  assert.ok(read("blog.html").includes("<title>Blog — Harsh Shah</title>"), "index title untouched");

  const article = read("blog/dollar.html");
  assert.ok(article.includes(`<meta name="description" content="${esc(text)}" />`), "literal description meta");
  assert.ok(article.includes("echo $'a\\tb'"), "literal code in body");
  assert.match(article, /s\/a\/\$(?:&|&amp;|&#x26;)\//, "literal $& in body");
  assert.ok(read("rss.xml").includes(`<title>${esc(text)}</title>`), "literal in RSS");
});

test("published pages for content without special sequences are well formed", async () => {
  const { read } = await prerender({ "plain.md": post('title: "Plain"\ndate: 2026-01-01') });
  assertWellFormedPage(read("blog/plain.html"));
  assertWellFormedPage(read("blog.html"));
});

test("frontmatter is escaped in every prerendered sink", async () => {
  const evil = '"></script><script>alert(1)</script><img src=x onerror=alert(1)>';
  const { read } = await prerender({
    "evil.md": post(
      [
        `title: ${JSON.stringify("T " + evil)}`,
        `description: ${JSON.stringify("D " + evil + " ]]>")}`,
        "date: 2026-01-01",
        `author: ${JSON.stringify(evil)}`,
        `tags: [${JSON.stringify("x" + evil.slice(0, 30))}]`,
        `coverAlt: ${JSON.stringify(evil)}`,
        'coverImage: "/blog/images/understanding-rag.svg"',
      ].join("\n"),
      "Body ]]> <script>alert(1)</script>"
    ),
  });

  for (const file of ["blog/evil.html", "blog.html"]) {
    const html = read(file);
    assertWellFormedPage(html);
    // Template scripts only: theme script, JSON-LD, "js" class script, module.
    assert.equal(count(html, "<script"), 4, `${file}: no injected scripts`);
    assert.deepEqual(unsafeParts(html.split("<body>")[1]), [], `${file}: body is inert`);
  }
  const jsonLd = read("blog/evil.html").match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1];
  assert.ok(!jsonLd.includes("<"), "JSON-LD cannot close its script tag");
  assert.equal(JSON.parse(jsonLd).headline, "T " + evil, "JSON-LD round-trips");

  const rss = read("rss.xml");
  assert.ok(rss.includes("]]]]><![CDATA[>"), "CDATA terminator split");
  assert.ok(!rss.includes("<script>"), "no raw script in RSS");
});

test("drafts are excluded from pages, RSS and sitemap", async () => {
  const { outDir, read } = await prerender({
    "live-post.md": post('title: "Live"\ndate: 2026-01-02'),
    "secret-draft.md": post('title: "Secret Draft Title"\ndate: 2026-01-03\ndraft: true', "Unpublished words"),
  });
  assert.ok(!fs.existsSync(path.join(outDir, "blog/secret-draft.html")));
  for (const file of ["blog.html", "rss.xml", "sitemap.xml", "blog/live-post.html"]) {
    const text = read(file);
    assert.ok(!text.includes("secret-draft") && !text.includes("Secret Draft Title"), file);
  }
});
