import fs from "node:fs";
import path from "node:path";

/**
 * Build-time static output for the blog.
 *
 * The site is a client-rendered SPA, so without this every URL serves the same
 * empty index.html: link previews show the generic site card and non-JS
 * crawlers see no article text. For /blog and each /blog/<slug> we write a
 * real HTML file with its own head (title, description, canonical, Open
 * Graph, Twitter, JSON-LD) and the article markup inside #root.
 *
 * Visitors with JavaScript never see that markup - a class set before first
 * paint hides it and React replaces #root on mount - so there is no flash or
 * layout shift. Static hosts serve existing files ahead of the SPA rewrite,
 * so this needs no hosting changes.
 */

const SITE_NAME = "Harsh Shah";
const BLOG_TITLE = "Blog — Harsh Shah";
const BLOG_DESCRIPTION =
  "Long-form notes on AI engineering, system design and building software products end to end.";
const DEFAULT_IMAGE = "/ProfilePic.webp";
const STATIC_ROUTES = ["/", "/projects", "/about", "/behind-the-build", "/contact", "/blog"];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeXml = escapeHtml;

/** JSON inside <script> must not be able to close the tag. */
const safeJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

const absolute = (siteUrl, url) => (/^https?:\/\//i.test(url) ? url : `${siteUrl}${url}`);

/** Social platforms don't render SVG previews, so fall back to the site image. */
const shareImage = (siteUrl, coverImage) =>
  absolute(siteUrl, coverImage && !/\.svg$/i.test(coverImage) ? coverImage : DEFAULT_IMAGE);

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

function headTags({ title, description, canonical, image, type, extra = "", jsonLd }) {
  return [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    extra,
    `<script type="application/ld+json" id="structured-data">${safeJson(jsonLd)}</script>`,
    // Hide the static markup for JS visitors before first paint; React
    // replaces it on mount.
    `<script>document.documentElement.classList.add("js")</script>`,
    `<style>.js [data-prerendered]{display:none}</style>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

// Replacements are functions: a replacement *string* expands $&, $', $` and
// $1 etc., which splices template fragments into any post containing them.
function renderPage(template, { title, head, body }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/\s*<meta\b[^>]*?(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>/g, "")
    .replace("</head>", () => `    ${head}\n  </head>`)
    .replace(/<div id="root"><\/div>/, () => `<div id="root"><div data-prerendered>${body}</div></div>`);
}

function writeFile(outDir, relPath, content) {
  const file = path.join(outDir, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function articlePage(template, siteUrl, { meta, html }) {
  const canonical = `${siteUrl}/blog/${meta.slug}`;
  const image = shareImage(siteUrl, meta.coverImage);
  const title = `${meta.title} — ${SITE_NAME}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated || meta.date,
    author: { "@type": "Person", name: meta.author, url: `${siteUrl}/about` },
    publisher: { "@type": "Person", name: SITE_NAME, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    image,
    keywords: meta.tags.join(", "),
  };

  const extra = [
    `<meta property="article:published_time" content="${meta.date}" />`,
    meta.updated && `<meta property="article:modified_time" content="${meta.updated}" />`,
    `<meta property="article:author" content="${escapeHtml(meta.author)}" />`,
    ...meta.tags.map((t) => `<meta property="article:tag" content="${escapeHtml(t)}" />`),
  ]
    .filter(Boolean)
    .join("\n    ");

  const body = `
<main>
  <article>
    <p><a href="/blog">← All articles</a></p>
    <h1>${escapeHtml(meta.title)}</h1>
    <p>${escapeHtml(meta.description)}</p>
    <p>By ${escapeHtml(meta.author)} · <time datetime="${meta.date}">${formatDate(meta.date)}</time> · ${meta.readingTime} min read</p>
    ${meta.coverImage ? `<img src="${escapeHtml(meta.coverImage)}" alt="${escapeHtml(meta.coverAlt || "")}" />` : ""}
    ${html}
  </article>
</main>`;

  return renderPage(template, {
    title,
    head: headTags({ title, description: meta.description, canonical, image, type: "article", extra, jsonLd }),
    body,
  });
}

function indexPage(template, siteUrl, posts) {
  const canonical = `${siteUrl}/blog`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: canonical,
    author: { "@type": "Person", name: SITE_NAME, url: `${siteUrl}/about` },
    blogPost: posts.map(({ meta }) => ({
      "@type": "BlogPosting",
      headline: meta.title,
      url: `${siteUrl}/blog/${meta.slug}`,
      datePublished: meta.date,
    })),
  };

  const items = posts
    .map(
      ({ meta }) => `
    <li>
      <article>
        <h2><a href="/blog/${meta.slug}">${escapeHtml(meta.title)}</a></h2>
        <p>${escapeHtml(meta.description)}</p>
        <p><time datetime="${meta.date}">${formatDate(meta.date)}</time> · ${meta.readingTime} min read</p>
      </article>
    </li>`
    )
    .join("");

  const body = `
<main>
  <h1>Blog</h1>
  <p>${escapeHtml(BLOG_DESCRIPTION)}</p>
  <ul>${items}
  </ul>
</main>`;

  return renderPage(template, {
    title: BLOG_TITLE,
    head: headTags({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      canonical,
      image: absolute(siteUrl, DEFAULT_IMAGE),
      type: "website",
      jsonLd,
    }),
    body,
  });
}

function sitemap(siteUrl, posts) {
  const latest = posts[0]?.meta.date;
  const urls = [
    ...STATIC_ROUTES.map((route) => ({
      loc: `${siteUrl}${route === "/" ? "" : route}`,
      lastmod: route === "/blog" ? latest : undefined,
    })),
    ...posts.map(({ meta }) => ({ loc: `${siteUrl}/blog/${meta.slug}`, lastmod: meta.updated || meta.date })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
  .join("\n")}
</urlset>
`;
}

function rss(siteUrl, posts) {
  // Feed readers resolve nothing relative, so root-relative links are made absolute.
  const absolutise = (html) => html.replace(/(src|href)="\//g, `$1="${siteUrl}/`);
  const cdata = (html) => `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

  const items = posts
    .map(
      ({ meta, html }) => `    <item>
      <title>${escapeXml(meta.title)}</title>
      <link>${siteUrl}/blog/${meta.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${meta.slug}</guid>
      <pubDate>${new Date(`${meta.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(meta.description)}</description>
${meta.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
      <content:encoded>${cdata(absolutise(html))}</content:encoded>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(BLOG_TITLE)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(`${posts[0].meta.date}T00:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
}

export function writeStaticOutput({ outDir, siteUrl, posts }) {
  const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");

  // Hosts differ in how they map "/blog/x" to a file: some try "x.html",
  // others "x/index.html". Writing both lets the extensionless URL resolve
  // to the prerendered page either way (otherwise it still works, but via
  // the SPA fallback, without per-article metadata).
  const page = (route, html) => {
    writeFile(outDir, `${route}.html`, html);
    writeFile(outDir, `${route}/index.html`, html);
  };

  page("blog", indexPage(template, siteUrl, posts));
  for (const post of posts) {
    page(`blog/${post.meta.slug}`, articlePage(template, siteUrl, post));
  }

  writeFile(outDir, "sitemap.xml", sitemap(siteUrl, posts));
  writeFile(outDir, "rss.xml", rss(siteUrl, posts));
  writeFile(outDir, "robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
