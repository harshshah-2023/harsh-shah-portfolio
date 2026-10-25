import { Link } from "react-router-dom";
import CoverImage from "./CoverImage";
import { formatDate, postUrl, primaryTag } from "../../blog/posts";

export function PostMeta({ post, className = "" }) {
  return (
    <p className={`text-sm text-mist-500 ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
      <span aria-hidden="true" className="mx-2 text-mist-600">·</span>
      {post.readingTime} min read
      {post.draft && <DraftBadge />}
    </p>
  );
}

// Drafts only exist on the dev server; the badge makes that obvious there.
function DraftBadge() {
  return (
    <span className="ml-3 rounded-full border border-amber-500/40 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-600">
      Draft
    </span>
  );
}

function Kicker({ post, prefix }) {
  const tag = primaryTag(post);
  if (!prefix && !tag) return null;
  return (
    <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent-400">
      {prefix}
      {prefix && tag && <span aria-hidden="true" className="mx-2 text-mist-600">/</span>}
      {tag}
    </p>
  );
}

/*
 * Every preview below is one link (no nested interactive elements), so tags
 * are shown as text here and become links on the article itself.
 */

/** Lead story at the top of the blog: cover and headline side by side. */
export function FeaturedPost({ post, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <Link
      to={postUrl(post.slug)}
      className="group grid gap-8 rounded-2xl md:grid-cols-[1.25fr_1fr] md:items-center lg:gap-14"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-ink-850 ring-1 ring-edge/[0.08]">
        <CoverImage
          post={post}
          eager
          showLabel
          className="transition duration-700 ease-soft group-hover:scale-[1.015]"
        />
      </div>
      <div>
        <Kicker post={post} prefix={post.featured ? "Featured" : "Latest"} />
        <Heading className="mt-4 font-reading text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-mist-50 sm:text-4xl lg:text-[2.75rem]">
          <span className="title-underline">{post.title}</span>
        </Heading>
        <p className="mt-5 max-w-measure-sm text-base leading-relaxed text-mist-400 sm:text-lg">{post.description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-edge/[0.08] pt-5">
          <PostMeta post={post} />
          <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-accent-400 group-hover:text-accent-300">
            Read the article
            <span aria-hidden="true" className="transition-transform duration-200 ease-soft group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Feed entry: text first, a small cover on the right from tablet up. */
export function PostRow({ post, headingLevel = "h3" }) {
  const Heading = headingLevel;
  return (
    <Link
      to={postUrl(post.slug)}
      className="group grid gap-6 py-8 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10"
    >
      <div className="min-w-0">
        <Kicker post={post} />
        <Heading className="mt-2.5 font-reading text-[1.375rem] font-semibold leading-[1.22] tracking-[-0.012em] text-mist-50 sm:text-[1.625rem]">
          <span className="title-underline">{post.title}</span>
        </Heading>
        <p className="mt-3 line-clamp-2 max-w-measure-sm text-[0.9375rem] leading-relaxed text-mist-400">
          {post.description}
        </p>
        <PostMeta post={post} className="mt-4" />
      </div>
      <div className="hidden aspect-[16/10] overflow-hidden rounded-lg bg-ink-850 ring-1 ring-edge/[0.07] sm:block">
        <CoverImage post={post} className="transition duration-700 ease-soft group-hover:scale-[1.03]" />
      </div>
    </Link>
  );
}

/** Compact archive line: date, title, topic. */
export function ArchiveRow({ post }) {
  return (
    <Link
      to={postUrl(post.slug)}
      className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]"
    >
      <time dateTime={post.date} className="text-sm text-mist-500">
        {formatDate(post.date, "short").replace(/,.*$/, "")}
      </time>
      <span className="font-reading text-lg font-semibold leading-snug text-mist-100 group-hover:text-accent-300">
        {post.title}
        {post.draft && <DraftBadge />}
      </span>
      <span className="col-start-2 text-xs uppercase tracking-[0.14em] text-mist-500 sm:col-start-auto">
        {primaryTag(post)}
      </span>
    </Link>
  );
}

/** Text-only card for "Keep reading" columns; aligns regardless of artwork. */
export default function PostCard({ post, headingLevel = "h3" }) {
  const Heading = headingLevel;
  return (
    <Link
      to={postUrl(post.slug)}
      className="group flex h-full flex-col"
    >
      <Kicker post={post} />
      <Heading className="mt-3 font-reading text-xl font-semibold leading-snug text-mist-50">
        <span className="title-underline">{post.title}</span>
      </Heading>
      <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-mist-400">{post.description}</p>
      <PostMeta post={post} className="mt-auto pt-5" />
    </Link>
  );
}
