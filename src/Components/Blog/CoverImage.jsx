import { useState } from "react";
import { primaryTag } from "../../blog/posts";

/** Small deterministic PRNG so a post always gets the same generated cover. */
function seeded(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Generated cover for posts without artwork: a "code silhouette" - rows of
 * indented line-bars, seeded by the slug, with one accent line. It reads as
 * an intentional part of the visual system rather than an empty frame.
 */
function GeneratedCover({ post, showLabel, className }) {
  const rand = seeded(post.slug);
  const rows = 9;
  let indent = 0;
  const lines = Array.from({ length: rows }, (_, i) => {
    const r = rand();
    if (r < 0.28 && indent < 3) indent += 1;
    else if (r > 0.78 && indent > 0) indent -= 1;
    const gap = rand() < 0.12 && i > 0 && i < rows - 1;
    return { x: 24 + indent * 22, w: 60 + rand() * 170, gap };
  });
  const accentRow = 2 + Math.floor(rand() * (rows - 3));
  const tag = primaryTag(post);

  return (
    <div aria-hidden="true" className={`relative h-full w-full overflow-hidden bg-ink-850 ${className}`}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {lines.map((l, i) =>
          l.gap ? null : (
            <rect
              key={i}
              x={l.x}
              y={44 + i * 20}
              width={l.w}
              height="7"
              rx="3.5"
              className={i === accentRow ? "fill-accent-500/70" : "fill-edge/[0.09]"}
            />
          )
        )}
        <rect x="0" y="0" width="3" height="250" className="fill-accent-500/40" />
      </svg>
      {showLabel && tag && (
        <span className="absolute bottom-4 left-6 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-mist-500">
          {tag}
        </span>
      )}
    </div>
  );
}

/**
 * Article cover, falling back to a generated cover when a post has no
 * artwork (or a broken path). Always fills its parent - the parent sets the
 * aspect ratio, which also reserves the space and avoids layout shift.
 */
export default function CoverImage({ post, eager = false, decorative = true, showLabel = false, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!post.coverImage || failed) {
    return <GeneratedCover post={post} showLabel={showLabel} className={className} />;
  }

  return (
    <img
      src={post.coverImage}
      alt={decorative ? "" : post.coverAlt || ""}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
