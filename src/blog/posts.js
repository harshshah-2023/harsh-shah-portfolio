import { posts, loadPost, siteUrl } from "virtual:blog";

/**
 * Client-side access to the blog. `posts` is generated at build time from
 * content/blog/*.md by tools/blog/vite-plugin-blog.js (newest first, drafts
 * removed in production builds).
 */
export { posts, loadPost, siteUrl };

export const AUTHOR = {
  name: "Harsh Shah",
  role: "Software Product Engineer",
  bio: "I build products end to end — from PRD and system architecture through design, implementation and release. I write about AI engineering, system design and the craft of shipping software.",
};

export const getPost = (slug) => posts.find((p) => p.slug === slug);

export const postUrl = (slug) => `/blog/${slug}`;

/** The topic a post is filed under: its first tag. */
export const primaryTag = (post) => post.tags[0];

export const tagSlug = (tag) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Every tag with its post count, most used first. */
export function allTags() {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Dates are stored as YYYY-MM-DD; format in UTC so they never shift a day. */
export function formatDate(iso, style = "long") {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: style === "short" ? "short" : "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Up to `limit` posts sharing the most tags with `post`, newest first on ties,
 * topped up with the latest posts when there are not enough tag matches.
 */
export function relatedPosts(post, limit = 3) {
  const tags = new Set(post.tags);
  const others = posts.filter((p) => p.slug !== post.slug);

  const scored = others
    .map((p) => ({ p, score: p.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .map((x) => x.p);

  const picked = scored.slice(0, limit);
  for (const p of others) {
    if (picked.length >= limit) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
}

/** Older and newer neighbours in publication order. */
export function adjacentPosts(slug) {
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/** Case-insensitive match against title, description and tags. */
export function matchesQuery(post, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [post.title, post.description, ...post.tags].join(" ").toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
