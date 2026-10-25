# Blog guide

Every article is a Markdown file in `content/blog/`. Adding a file is all it
takes to publish: the build turns it into a page at `/blog/<file-name>`, adds
it to the blog index, the sitemap and the RSS feed. No code changes.

## 1. Add a new article

Create `content/blog/my-new-post.md`. The **file name is the URL**, so use
lowercase letters, numbers and hyphens only (`my-new-post` → `/blog/my-new-post`).

```markdown
---
title: "Understanding Context Engineering"
description: "How to design reliable context for AI applications."
date: "2026-10-24"
tags:
  - AI Engineering
  - LLM
coverImage: "/blog/images/context-engineering.webp"
coverAlt: "Layers of a model context window"
draft: false
---

Your opening paragraph goes here.

## First section

Write in normal Markdown. Use `##` for sections and `###` for subsections —
they build the table of contents. The article title is already the page's
`#` heading, so don't repeat it in the body.
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | **Yes** | Shown on the article and in search results. |
| `date` | **Yes** | `YYYY-MM-DD`. Posts are sorted newest first by this. |
| `description` | No | One or two sentences for cards, search engines and link previews. If omitted, the first paragraph is used. |
| `tags` | No | A list (or comma-separated text). Powers the topic filters and "Keep reading". |
| `coverImage` | No | Path to an image in `public/`, e.g. `/blog/images/x.webp`. Without one, a styled placeholder is shown. |
| `coverAlt` | No | Describes the cover for screen readers. |
| `updated` | No | `YYYY-MM-DD` of a significant revision. |
| `author` | No | Defaults to Harsh Shah. |
| `featured` | No | `true` pins the post to the top of `/blog`. Otherwise the newest post is featured. |
| `draft` | No | `true` hides the post from production (see §5). |

If a required field is missing or a date is malformed, the build stops with a
message naming the file and the field, so a broken post can't be published.

### What you can use in the body

Headings, paragraphs, **bold**, *italic*, links, lists, task lists
(`- [x] done`), blockquotes, tables, horizontal rules (`---`), footnotes
(`text[^1]` … `[^1]: note`), images, inline `code` and fenced code blocks
with a language for syntax highlighting:

````markdown
```python
print("highlighted")
```
````

Every code block gets a copy button automatically. Raw HTML is ignored on
purpose (it's stripped for safety), so stick to Markdown.

## 2. Images

Save images in **`public/blog/images/`** and reference them with a path that
starts at `/blog/images/`:

```markdown
![What the diagram shows](/blog/images/my-diagram.webp)
```

- Prefer `.webp` (or `.svg` for diagrams). Keep covers around 1600×800.
- Always write meaningful alt text inside the `[ ]`.
- Social networks don't show SVG previews; if a post's cover is an SVG, link
  previews fall back to the profile photo. Use a `.webp`/`.png` cover if the
  preview image matters.

## 3. Preview locally

```bash
npm install      # first time only
npm run dev      # http://localhost:3000/blog
```

The page reloads as you save the Markdown file. Drafts are visible here with a
"Draft" badge. To check exactly what will ship (drafts removed, prerendered
pages, sitemap, RSS):

```bash
npm run build && npm run preview   # http://localhost:4173/blog
```

## 4. Publish

```bash
git checkout -b post/my-new-post        # optional, if you review via PRs
git add content/blog/my-new-post.md public/blog/images/
git commit -m "Post: My new post"
git push
```

Render rebuilds the site when the branch it deploys from changes (merge the
branch, or push to it directly). The build runs `npm run build` as before;
the article is live once that deploy finishes.

## 5. Edit or unpublish

- **Edit:** change the Markdown file and push. Add `updated: "YYYY-MM-DD"` for
  a meaningful revision.
- **Unpublish:** set `draft: true` (keeps the file) or delete the file. Either
  way it disappears from the blog, the sitemap and the RSS feed on the next
  deploy, and its URL shows a "This article doesn't exist" page.
- **Renaming a file changes its URL.** Old links will 404, so avoid renaming
  published posts.

## The example posts

`understanding-rag.md` and `context-engineering.md` are labelled sample
articles that show every formatting feature, and `building-ai-agents.md` is a
sample draft. **Delete them, or set `draft: true`, before deploying** if you
don't want them on the live site. The six other posts were migrated from the
old hard-coded blog page.

## Light and dark mode

The blog opens in **light mode** by default. Readers can switch to dark with
the sun/moon switch in the navbar, which only appears on `/blog` pages; the
choice is remembered in their browser. The rest of the portfolio keeps its dark
look. Nothing to do per article — check new posts in both modes when you
preview, especially images with transparent backgrounds.

## How it works (for reference)

- `tools/blog/` is a small Vite plugin. At build time it reads
  `content/blog/*.md`, validates the frontmatter, and renders Markdown to
  sanitised HTML with syntax highlighting. Nothing Markdown-related ships to
  the browser.
- Each article is its own small JavaScript chunk, loaded only when opened.
- After the build it writes a real HTML file for `/blog` and every article,
  with its own title, description, canonical URL, Open Graph tags and
  structured data, plus `sitemap.xml`, `rss.xml` and `robots.txt`.
- Canonical and share URLs use `https://harshshah.onrender.com`. If the domain
  changes, set `SITE_URL` in Render's environment settings (see `.env.example`).
