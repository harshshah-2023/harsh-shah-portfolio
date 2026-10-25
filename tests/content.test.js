import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadAllPosts } from "../tools/blog/content.js";
import { PUBLIC_DIR, tempDir } from "./helpers.js";

async function load(files, includeDrafts = false) {
  const contentDir = tempDir("content");
  for (const [name, source] of Object.entries(files)) fs.writeFileSync(path.join(contentDir, name), source);
  return loadAllPosts({ contentDir, publicDir: PUBLIC_DIR, includeDrafts });
}

const withCover = (coverImage) => ({
  "p.md": `---\ntitle: "P"\ndate: 2026-01-01\ncoverImage: ${JSON.stringify(coverImage)}\n---\nx\n`,
});

for (const ok of ["/blog/images/understanding-rag.svg", "https://images.example.com/a.png"]) {
  test(`coverImage accepted: ${ok}`, async () => {
    const [post] = await load(withCover(ok));
    assert.equal(post.meta.coverImage, ok);
  });
}

for (const bad of [
  "javascript:alert(1)",
  "JAVASCRIPT:alert(1)",
  "data:image/svg+xml;base64,PHN2Zz4=",
  "vbscript:x",
  "http://insecure.example.com/a.png",
  "//evil.example.com/a.png",
  "/\\evil.example.com/a.png",
  "blog/images/relative.png",
  "/../../etc/passwd",
]) {
  test(`coverImage rejected: ${bad}`, async () => {
    await assert.rejects(load(withCover(bad)), /coverImage/);
  });
}

test("file names must be URL-safe slugs", async () => {
  await assert.rejects(load({ "..%2fx.md": '---\ntitle: "x"\ndate: 2026-01-01\n---\nx' }), /file names become URLs/);
  await assert.rejects(load({ "Bad Name.md": '---\ntitle: "x"\ndate: 2026-01-01\n---\nx' }), /file names become URLs/);
});

test("YAML alias bombs are rejected quickly", async () => {
  const lines = ["a: &a [x,x,x,x,x,x,x,x,x]"];
  for (let i = 1; i < 12; i++) {
    const prev = String.fromCharCode(96 + i);
    lines.push(`${String.fromCharCode(97 + i)}: &${String.fromCharCode(97 + i)} [${Array(9).fill("*" + prev).join(",")}]`);
  }
  const start = Date.now();
  await assert.rejects(load({ "bomb.md": `---\ntitle: bomb\ndate: 2026-01-01\n${lines.join("\n")}\n---\nx\n` }), /not valid YAML/);
  assert.ok(Date.now() - start < 2000);
});

test("drafts load only when requested (dev server)", async () => {
  const files = {
    "live.md": '---\ntitle: "Live"\ndate: 2026-01-01\n---\nx\n',
    "wip.md": '---\ntitle: "WIP"\ndate: 2026-01-02\ndraft: true\n---\nx\n',
  };
  assert.deepEqual((await load(files)).map((p) => p.meta.slug), ["live"]);
  assert.deepEqual((await load(files, true)).map((p) => p.meta.slug).sort(), ["live", "wip"]);
});
