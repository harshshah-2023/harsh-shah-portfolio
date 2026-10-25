import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import blog from "../tools/blog/vite-plugin-blog.js";
import { ROOT, tempDir } from "./helpers.js";

// The real blog plugin on a real dev server, pointed at a temp content dir
// so the repository's posts are never touched.
test("dev server: serves drafts, and reloads when a post is added", async (t) => {
  const contentDir = tempDir("dev");
  fs.writeFileSync(path.join(contentDir, "live.md"), '---\ntitle: "Live"\ndate: 2026-01-01\n---\nHello\n');
  fs.writeFileSync(path.join(contentDir, "wip.md"), '---\ntitle: "WIP"\ndate: 2026-01-02\ndraft: true\n---\nSoon\n');

  const server = await createServer({
    configFile: false,
    root: ROOT,
    logLevel: "silent",
    plugins: [react(), blog({ contentDir, siteUrl: "https://example.test" })],
    server: { port: 0, host: "127.0.0.1" },
  });
  await server.listen();
  t.after(() => server.close());
  const origin = server.resolvedUrls.local[0].replace(/\/$/, "");

  const index = await (await fetch(`${origin}/@id/__x00__virtual:blog`)).text();
  assert.match(index, /"slug":"live"/);
  assert.match(index, /"slug":"wip"/, "drafts are visible in dev");

  const article = await (await fetch(`${origin}/@id/__x00__virtual:blog/post/live`)).text();
  assert.match(article, /<p>Hello<\/p>/);

  // Hot reload: adding a post sends a full-reload over the HMR socket.
  const ws = new WebSocket(origin.replace(/^http/, "ws"), "vite-hmr");
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  t.after(() => ws.close());
  const reloaded = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("no full-reload within 10s")), 10000);
    ws.addEventListener("message", (e) => {
      if (JSON.parse(e.data).type === "full-reload") {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  // Give the watcher a moment to attach before writing.
  await new Promise((r) => setTimeout(r, 500));
  fs.writeFileSync(path.join(contentDir, "new-post.md"), '---\ntitle: "New"\ndate: 2026-01-03\n---\nFresh\n');
  await reloaded;

  const after = await (await fetch(`${origin}/@id/__x00__virtual:blog`)).text();
  assert.match(after, /"slug":"new-post"/, "new post served after reload");
});
