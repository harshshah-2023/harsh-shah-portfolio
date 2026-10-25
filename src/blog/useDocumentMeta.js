import { useEffect } from "react";

/**
 * Per-page <head> metadata for client-side navigation.
 *
 * The prerendered blog HTML already ships correct tags on first load; this
 * keeps them right as the visitor moves between routes. On unmount it resets
 * to the site defaults from index.html (rather than "whatever was there
 * before", which after a prerendered landing would be another article's tags).
 */

const DEFAULTS = {
  title: "Harsh Shah — Software Product Engineer",
  description:
    "Harsh Shah — Software Product Engineer building products end to end, from PRD and system architecture through design, implementation and release.",
  ogTitle: "Harsh Shah — Software Product Engineer",
  ogDescription: "Building products end to end: PRD, system architecture, design and implementation.",
  ogImage: "/ProfilePic.webp",
  ogType: "website",
};

function upsert(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (value == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key, keyAttr) => () => {
  const el = document.createElement("meta");
  el.setAttribute(keyAttr, key);
  return el;
};

function apply(m) {
  document.title = m.title;
  upsert('meta[name="description"]', meta("description", "name"), "content", m.description);
  upsert('meta[name="robots"]', meta("robots", "name"), "content", m.robots);
  upsert(
    'link[rel="canonical"]',
    () => Object.assign(document.createElement("link"), { rel: "canonical" }),
    "href",
    m.canonical
  );

  upsert('meta[property="og:title"]', meta("og:title", "property"), "content", m.ogTitle);
  upsert('meta[property="og:description"]', meta("og:description", "property"), "content", m.ogDescription);
  upsert('meta[property="og:image"]', meta("og:image", "property"), "content", m.ogImage);
  upsert('meta[property="og:type"]', meta("og:type", "property"), "content", m.ogType);
  upsert('meta[property="og:url"]', meta("og:url", "property"), "content", m.canonical);
  upsert('meta[name="twitter:title"]', meta("twitter:title", "name"), "content", m.twitterTitle);
  upsert('meta[name="twitter:description"]', meta("twitter:description", "name"), "content", m.twitterDescription);
  upsert('meta[name="twitter:image"]', meta("twitter:image", "name"), "content", m.twitterImage);

  // Article-only tags from a prerendered landing must not outlive the article.
  document.head
    .querySelectorAll('meta[property^="article:"]')
    .forEach((el) => m.ogType !== "article" && el.remove());

  upsert(
    "script#structured-data",
    () => Object.assign(document.createElement("script"), { id: "structured-data", type: "application/ld+json" }),
    "data-json",
    m.jsonLd ? "1" : null
  );
  const ld = document.head.querySelector("script#structured-data");
  if (ld) ld.textContent = JSON.stringify(m.jsonLd);
}

/**
 * @param {{title: string, description?: string, canonical?: string,
 *          image?: string, type?: "website"|"article", robots?: string,
 *          jsonLd?: object} | null} page  null leaves the head untouched
 */
export default function useDocumentMeta(page) {
  const key = page ? JSON.stringify(page) : null;

  useEffect(() => {
    if (!key) return;
    const p = JSON.parse(key);
    const description = p.description || DEFAULTS.description;
    apply({
      title: p.title,
      description,
      robots: p.robots,
      canonical: p.canonical,
      ogTitle: p.title,
      ogDescription: description,
      ogImage: p.image || DEFAULTS.ogImage,
      ogType: p.type || "website",
      twitterTitle: p.title,
      twitterDescription: description,
      twitterImage: p.image || DEFAULTS.ogImage,
      jsonLd: p.jsonLd,
    });

    return () =>
      apply({
        title: DEFAULTS.title,
        description: DEFAULTS.description,
        ogTitle: DEFAULTS.ogTitle,
        ogDescription: DEFAULTS.ogDescription,
        ogImage: DEFAULTS.ogImage,
        ogType: DEFAULTS.ogType,
      });
  }, [key]);
}
