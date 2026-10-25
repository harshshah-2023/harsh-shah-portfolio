import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CoverImage from "../Components/Blog/CoverImage";
import PostCard, { PostMeta } from "../Components/Blog/PostCard";
import TableOfContents from "../Components/Blog/TableOfContents";
import ReadingProgress from "../Components/Blog/ReadingProgress";
import ShareActions from "../Components/Blog/ShareActions";
import AuthorBio from "../Components/Blog/AuthorBio";
import useDocumentMeta from "../blog/useDocumentMeta";
import ProfilePic from "../assets/ProfilePic-840.webp";
import {
  adjacentPosts,
  getPost,
  loadPost,
  postUrl,
  primaryTag,
  relatedPosts,
  siteUrl,
  tagSlug,
} from "../blog/posts";

/** Absolute share image; social platforms don't render SVG previews. */
const shareImage = (post) =>
  post.coverImage && !/\.svg$/i.test(post.coverImage)
    ? new URL(post.coverImage, siteUrl).href
    : `${siteUrl}/ProfilePic.webp`;

/**
 * The single template every Markdown article renders through. Metadata is
 * available synchronously (so the header paints immediately); the body is a
 * separate lazily loaded chunk per article.
 */
export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  const [content, setContent] = useState({ slug: null, data: null, error: false });
  const loaded = content.slug === slug && content.data;
  const articleRef = useRef(null);

  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    loadPost(post.slug)
      .then((data) => !cancelled && setContent({ slug: post.slug, data, error: !data }))
      .catch(() => !cancelled && setContent({ slug: post.slug, data: null, error: true }));
    return () => {
      cancelled = true;
    };
  }, [post]);

  useDocumentMeta(
    post
      ? {
          title: `${post.title} — Harsh Shah`,
          description: post.description,
          canonical: `${siteUrl}${postUrl(post.slug)}`,
          image: shareImage(post),
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated || post.date,
            author: { "@type": "Person", name: post.author, url: `${siteUrl}/about` },
            mainEntityOfPage: `${siteUrl}${postUrl(post.slug)}`,
            image: shareImage(post),
            keywords: post.tags.join(", "),
          },
        }
      : { title: "Article not found — Harsh Shah", robots: "noindex" }
  );

  if (!post) return <ArticleNotFound />;

  const url = `${siteUrl}${postUrl(post.slug)}`;
  const toc = loaded ? content.data.toc : [];
  const showToc = toc.length >= 3;

  return (
    <>
      <ReadingProgress targetRef={articleRef} contentKey={loaded ? slug : null} />

      <article ref={articleRef} className="bg-ink-900 pt-28 sm:pt-32">
        {/* ============ HEADER ============ */}
        <header className="mx-auto max-w-[768px] px-6">
          <Link
            to="/blog"
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-mist-400 hover:text-mist-50"
          >
            <ArrowLeft size={16} aria-hidden="true" /> All articles
          </Link>

          {/* One topic up top; the full tag list sits at the end of the article. */}
          {primaryTag(post) && (
            <Link
              to={`/blog?tag=${tagSlug(primaryTag(post))}`}
              className="mt-10 block w-fit text-xs font-medium uppercase tracking-[0.16em] text-accent-400 hover:text-accent-300"
            >
              {primaryTag(post)}
            </Link>
          )}

          <h1 className="mt-4 font-reading text-[2.375rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 text-lg leading-relaxed text-mist-400 sm:text-[1.3125rem]">{post.description}</p>
          )}

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-y border-edge/[0.08] py-4">
            <div className="flex items-center gap-3">
              <img
                src={ProfilePic}
                alt=""
                width={40}
                height={40}
                decoding="async"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-edge/[0.12]"
              />
              <div>
                <p className="text-sm font-medium text-mist-100">{post.author}</p>
                <PostMeta post={post} className="!text-xs sm:!text-sm" />
              </div>
            </div>
            <ShareActions url={url} title={post.title} label={false} />
          </div>
        </header>

        {/* ============ COVER ============ */}
        {post.coverImage && (
          <figure className="mx-auto mt-10 max-w-5xl px-0 sm:mt-12 sm:px-6">
            <div className="aspect-[2/1] overflow-hidden bg-ink-850 ring-1 ring-edge/[0.08] sm:rounded-xl">
              <CoverImage key={post.slug} post={post} eager decorative={false} />
            </div>
          </figure>
        )}

        {/* ============ BODY + TOC ============ */}
        <div className="mx-auto mt-10 max-w-[1280px] sm:mt-14 px-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,720px)_minmax(0,1fr)] xl:gap-12">
          <div aria-hidden="true" className="hidden xl:block" />

          <div className="mx-auto min-w-0 max-w-[720px]">
            {showToc && <TableOfContents toc={toc} variant="inline" className="mb-10 xl:hidden" />}

            {loaded ? (
              <ArticleBody key={slug} html={content.data.html} />
            ) : content.slug === slug && content.error ? (
              <div className="surface p-8 text-center">
                <p className="text-mist-200">This article couldn&apos;t be loaded.</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm text-accent-400 hover:text-accent-300"
                >
                  Try again
                </button>
              </div>
            ) : (
              <BodySkeleton />
            )}

            {/* Article footer */}
            <div className="mt-16 flex flex-col gap-6 border-t border-edge/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
              {post.tags.length > 0 ? (
                <ul className="flex list-none flex-wrap gap-2 p-0" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <TagLink tag={tag} />
                    </li>
                  ))}
                </ul>
              ) : (
                <span />
              )}
              <ShareActions url={url} title={post.title} />
            </div>
          </div>

          <aside className="hidden xl:block">
            {showToc && <TableOfContents toc={toc} className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8" />}
          </aside>
        </div>
      </article>

      {/* ============ AUTHOR + PREV/NEXT ============ */}
      <div className="mx-auto mt-20 max-w-[768px] px-6">
        <AuthorBio name={post.author} />
        <AdjacentNav slug={post.slug} />
      </div>

      <RelatedArticles post={post} />
    </>
  );
}

/**
 * Renders the build-time HTML (already sanitised in tools/blog/markdown.js)
 * and wires up its interactive bits with one delegated click handler.
 */
function ArticleBody({ html }) {
  const navigate = useNavigate();
  const { hash } = useLocation();

  // Deep links like /blog/post#section: the heading only exists once the
  // body has rendered, so the browser's own jump on load misses it.
  useEffect(() => {
    if (!hash) return;
    const jump = () =>
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
    jump();
    // Web fonts swapping in can reflow the page; land on the heading again.
    document.fonts?.ready.then(jump);
  }, [hash]);

  const onClick = useCallback(
    async (event) => {
      const copyButton = event.target.closest("[data-copy-code]");
      if (copyButton) {
        const code = copyButton.closest(".code-block")?.querySelector("pre")?.innerText ?? "";
        try {
          await navigator.clipboard.writeText(code);
          copyButton.textContent = "Copied";
        } catch {
          copyButton.textContent = "Press Ctrl+C";
        }
        setTimeout(() => (copyButton.textContent = "Copy"), 2000);
        return;
      }

      // Same-site links inside an article navigate client-side instead of
      // reloading the whole app.
      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const href = link.getAttribute("href");
      // "//host" and "/\host" are other origins, not same-site paths.
      if (/^\/(?![/\\])/.test(href)) {
        event.preventDefault();
        navigate(href);
      }
    },
    [navigate]
  );

  return (
    // Safe: raw HTML is dropped and the output sanitised at build time.
    <div className="article-body" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function BodySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading article" className="space-y-4">
      {[100, 96, 92, 98, 60, 0, 100, 94, 97, 72].map((w, i) =>
        w ? (
          <div key={i} className="h-4 animate-pulse rounded bg-edge/[0.05]" style={{ width: `${w}%` }} />
        ) : (
          <div key={i} className="h-4" />
        )
      )}
    </div>
  );
}

function TagLink({ tag }) {
  return (
    <Link
      to={`/blog?tag=${tagSlug(tag)}`}
      className="inline-flex h-7 items-center rounded-full border border-edge/[0.08] bg-edge/[0.03] px-3 text-xs text-mist-300
                 hover:border-accent-500/40 hover:text-accent-200"
    >
      {tag}
    </Link>
  );
}

function AdjacentNav({ slug }) {
  const { newer, older } = adjacentPosts(slug);
  if (!newer && !older) return null;

  const item = (post, label, align) => (
    <Link
      to={postUrl(post.slug)}
      className={`group flex flex-col py-6 ${align === "right" ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-mist-500">{label}</span>
      <span className="mt-2 font-reading text-lg font-semibold leading-snug text-mist-50">
        <span className="title-underline">{post.title}</span>
      </span>
    </Link>
  );

  return (
    <nav
      aria-label="More articles"
      className="mt-12 grid divide-y divide-edge/[0.08] border-y border-edge/[0.08] sm:grid-cols-2 sm:gap-8 sm:divide-y-0"
    >
      {older ? item(older, "← Previous", "left") : <span className="hidden sm:block" />}
      {newer && item(newer, "Next →", "right")}
    </nav>
  );
}

function RelatedArticles({ post }) {
  const related = relatedPosts(post);
  if (!related.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mx-auto mt-24 max-w-6xl px-6 pb-28">
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b-2 border-mist-50 pb-4">
        <h2 id="related-heading" className="font-reading text-2xl font-semibold sm:text-3xl">
          Keep reading
        </h2>
        <Link to="/blog" className="text-sm text-accent-400 hover:text-accent-300">
          All articles →
        </Link>
      </div>
      <ul className="grid list-none gap-x-10 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-reading text-4xl font-semibold sm:text-5xl">This article doesn&apos;t exist.</h1>
      <p className="mt-6 max-w-measure-sm text-mist-400">
        It may have been renamed or unpublished. Every published article is listed on the blog.
      </p>
      <Link
        to="/blog"
        className="mt-12 rounded-lg bg-accent-500 px-8 py-3 font-semibold text-ink-950 shadow-glow
                   transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-glow-lg"
      >
        Browse the blog
      </Link>
    </div>
  );
}
