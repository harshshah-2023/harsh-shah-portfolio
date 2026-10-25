import path from "node:path";
import { loadAllPosts } from "./content.js";
import { writeStaticOutput } from "./static-output.js";

const INDEX_ID = "virtual:blog";
const POST_PREFIX = "virtual:blog/post/";
const RESOLVED = "\0";

/**
 * Markdown blog for a Vite SPA.
 *
 *   import { posts, loadPost, siteUrl } from "virtual:blog";
 *
 * - `posts` is the metadata list (newest first) - small, no article bodies.
 * - `loadPost(slug)` lazily imports one article's rendered HTML + outline,
 *   so each post is its own chunk and the blog index never downloads them.
 *
 * On `vite build` it also writes prerendered HTML for /blog and every
 * /blog/<slug>, plus sitemap.xml, rss.xml and robots.txt (static-output.js).
 */
export default function blogPlugin({ contentDir = "content/blog", siteUrl }) {
  let config;
  let isBuild = false;
  let cache = null;

  const absContent = () => path.resolve(config.root, contentDir);

  const getPosts = () => {
    cache ??= loadAllPosts({
      contentDir: absContent(),
      publicDir: config.publicDir,
      includeDrafts: !isBuild,
    });
    return cache;
  };

  return {
    name: "portfolio-markdown-blog",

    configResolved(resolved) {
      config = resolved;
      isBuild = resolved.command === "build";
    },

    resolveId(id) {
      if (id === INDEX_ID || id.startsWith(POST_PREFIX)) return RESOLVED + id;
    },

    async load(id) {
      if (!id.startsWith(RESOLVED + "virtual:blog")) return;
      // Content changes are picked up by configureServer's watcher below.
      // (addWatchFile here registered the folder as an import in dev and
      // broke the module.)
      const posts = await getPosts();

      if (id === RESOLVED + INDEX_ID) {
        const loaders = posts
          .map((p) => `  ${JSON.stringify(p.meta.slug)}: () => import(${JSON.stringify(POST_PREFIX + p.meta.slug)}),`)
          .join("\n");

        return [
          `export const siteUrl = ${JSON.stringify(siteUrl)};`,
          `export const posts = ${JSON.stringify(posts.map((p) => p.meta))};`,
          `const loaders = {\n${loaders}\n};`,
          `export const loadPost = (slug) => loaders[slug] ? loaders[slug]().then((m) => m.default) : Promise.resolve(null);`,
        ].join("\n");
      }

      const slug = id.slice((RESOLVED + POST_PREFIX).length);
      const post = posts.find((p) => p.meta.slug === slug);
      return `export default ${JSON.stringify(post ? { html: post.html, toc: post.toc } : null)};`;
    },

    // Adding, editing or deleting a post reloads the page with fresh content.
    configureServer(server) {
      server.watcher.add(absContent());
      const onChange = (file) => {
        if (!file.toLowerCase().endsWith(".md") || !path.resolve(file).startsWith(absContent())) return;
        cache = null;
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (mod.id?.startsWith(RESOLVED + "virtual:blog")) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },

    async closeBundle() {
      if (!isBuild) return;
      const posts = await getPosts();
      writeStaticOutput({
        outDir: path.resolve(config.root, config.build.outDir),
        siteUrl,
        posts,
      });
      config.logger.info(`[blog] prerendered ${posts.length} article(s), sitemap.xml, rss.xml and robots.txt`);
    },
  };
}
