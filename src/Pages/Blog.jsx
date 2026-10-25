import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Rss, Search, X } from "lucide-react";
import { ArchiveRow, FeaturedPost, PostRow } from "../Components/Blog/PostCard";
import useDocumentMeta from "../blog/useDocumentMeta";
import ProfilePic from "../assets/ProfilePic-840.webp";
import { AUTHOR, allTags, formatDate, matchesQuery, posts, siteUrl } from "../blog/posts";

// Topics shown as tabs before "+N more"; the rest open in a panel below.
const VISIBLE_TAGS = 6;

// Newest posts get the full row treatment; older ones go to the archive.
const LATEST_COUNT = 4;

const DESCRIPTION =
  "Long-form notes on AI engineering, system design and building software products end to end.";

const STANDFIRST =
  "Essays on AI engineering, system design and software architecture — the decisions, trade-offs and failures behind shipping real systems.";

export default function Blog() {
  // Filters live in the URL so a filtered view can be shared or bookmarked,
  // and tag links on articles can point straight at /blog?tag=...
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const activeTag = params.get("tag") || "";

  const tags = useMemo(() => allTags(), []);
  const [showAllTags, setShowAllTags] = useState(false);
  const activeTagName = tags.find((t) => t.slug === activeTag)?.name;
  const isFiltering = Boolean(query.trim() || activeTagName);

  const results = useMemo(
    () =>
      posts.filter(
        (p) => matchesQuery(p, query) && (!activeTagName || p.tags.includes(activeTagName))
      ),
    [query, activeTagName]
  );

  const featured = posts.find((p) => p.featured) || posts[0];
  const feed = isFiltering ? results : posts.filter((p) => p !== featured);
  const latest = feed.slice(0, LATEST_COUNT);
  const archive = feed.slice(LATEST_COUNT);

  useDocumentMeta({
    title: "Blog — Harsh Shah",
    description: DESCRIPTION,
    canonical: `${siteUrl}/blog`,
    image: `${siteUrl}/ProfilePic.webp`,
  });

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearFilters = () => setParams({}, { replace: true });
  const selectTag = (slug) => updateParam("tag", slug === activeTag ? "" : slug);

  // Always keep the selected tag visible, even when it is outside the top N.
  const tabTags = tags.filter((t, i) => i < VISIBLE_TAGS || t.slug === activeTag);
  const hiddenCount = tags.length - tabTags.length;

  return (
    <div className="min-h-screen bg-ink-900 pb-28 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* ============ MASTHEAD ============ */}
        <header className="border-b-2 border-mist-50 pb-8 sm:pb-10">
          <div className="flex items-center justify-between gap-6">
            <p className="eyebrow">Harsh Shah · Writing</p>
            <a
              href="/rss.xml"
              className="-mr-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-mist-500 hover:text-accent-300"
            >
              <Rss size={15} aria-hidden="true" /> RSS
            </a>
          </div>
          <h1 className="mt-6 max-w-4xl font-reading text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:mt-8 sm:text-6xl lg:text-[5.25rem]">
            Notes on building software
          </h1>
          <div className="mt-6 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <p className="max-w-[54ch] text-lg leading-relaxed text-mist-400 sm:text-xl">{STANDFIRST}</p>
            {posts.length > 0 && (
              <p className="shrink-0 text-sm text-mist-500 tabular">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
                <span aria-hidden="true" className="mx-2 text-mist-600">·</span>
                Updated <time dateTime={posts[0].date}>{formatDate(posts[0].date, "short")}</time>
              </p>
            )}
          </div>
        </header>

        {/* ============ DISCOVERY: TOPICS + SEARCH ============ */}
        <div className="flex flex-col-reverse border-b border-edge/[0.08] md:flex-row md:items-center md:justify-between md:gap-8">
          {/* Tabs scroll sideways when space runs out; "+N more" stays pinned. */}
          <div className="-ml-5 flex min-w-0 items-stretch sm:-ml-6 md:ml-0">
            <div
              role="group"
              aria-label="Filter by topic"
              className="fade-x no-scrollbar flex min-w-0 items-stretch gap-6 overflow-x-auto pl-5 pr-6 sm:pl-6 md:pl-0"
            >
              <TopicTab active={!activeTagName} onClick={() => updateParam("tag", "")}>
                All
              </TopicTab>
              {tabTags.map((tag) => (
                <TopicTab key={tag.slug} active={tag.slug === activeTag} onClick={() => selectTag(tag.slug)}>
                  {tag.name}
                  <span className="ml-1.5 text-xs tabular text-mist-500">{tag.count}</span>
                </TopicTab>
              ))}
            </div>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTags((v) => !v)}
                aria-expanded={showAllTags}
                aria-controls="all-topics"
                className="shrink-0 whitespace-nowrap py-4 text-sm font-medium text-accent-400 hover:text-accent-300"
              >
                {showAllTags ? "Fewer" : `+${hiddenCount} more`}
              </button>
            )}
          </div>

          <div className="relative pt-5 md:w-64 md:shrink-0 md:py-2.5">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-[calc(50%+0.625rem)] -translate-y-1/2 text-mist-500 md:top-1/2"
            />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Search articles"
              autoComplete="off"
              className="h-10 w-full rounded-full border border-edge/[0.08] bg-edge/[0.03] pl-10 pr-10 text-sm text-mist-100
                         outline-none transition placeholder:text-mist-500
                         hover:border-edge/[0.16] focus:border-accent-500/60 focus:bg-ink-950 focus:ring-4 focus:ring-accent-500/15
                         [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateParam("q", "")}
                aria-label="Clear search"
                className="absolute right-1.5 top-[calc(50%+0.625rem)] -translate-y-1/2 rounded-full p-1.5 text-mist-500 hover:bg-edge/[0.06] hover:text-mist-50 md:top-1/2"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Every topic, for when there are more than fit in the tab row. */}
        {showAllTags && hiddenCount > 0 && (
          <div id="all-topics" className="animate-fadeIn border-b border-edge/[0.08] py-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-mist-500">All topics</p>
            <ul className="flex list-none flex-wrap gap-2 p-0">
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <button
                    type="button"
                    onClick={() => selectTag(tag.slug)}
                    aria-pressed={tag.slug === activeTag}
                    className={`h-8 rounded-full border px-3 text-sm ${
                      tag.slug === activeTag
                        ? "border-accent-500/60 bg-accent-500/[0.12] text-accent-200"
                        : "border-edge/[0.08] text-mist-400 hover:border-edge/[0.2] hover:text-mist-100"
                    }`}
                  >
                    {tag.name}
                    <span className="ml-1.5 text-xs tabular text-mist-500">{tag.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {posts.length === 0 ? (
          <EmptyState title="No articles yet" body="The first post is on its way. Check back soon." />
        ) : isFiltering ? (
          /* ============ FILTERED RESULTS ============ */
          <section aria-labelledby="results-heading" className="mx-auto max-w-4xl pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-edge/[0.08] pb-5">
              <h2 id="results-heading" className="text-lg font-semibold" aria-live="polite">
                {results.length} {results.length === 1 ? "article" : "articles"}
                {activeTagName && <span className="font-normal text-mist-400"> in {activeTagName}</span>}
                {query.trim() && <span className="font-normal text-mist-400"> matching “{query.trim()}”</span>}
              </h2>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300"
              >
                <X size={14} aria-hidden="true" /> Clear filters
              </button>
            </div>
            {results.length ? (
              <PostList posts={results} />
            ) : (
              <EmptyState
                title="Nothing matches that search"
                body="Try a broader word, or start from one of the main topics."
                action={
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-9 rounded-full bg-mist-50 px-4 text-sm font-medium text-ink-900 hover:bg-accent-400"
                    >
                      Show all articles
                    </button>
                    {tags.slice(0, 3).map((tag) => (
                      <button
                        key={tag.slug}
                        type="button"
                        onClick={() => setParams({ tag: tag.slug }, { replace: true })}
                        className="h-9 rounded-full border border-edge/[0.12] px-4 text-sm text-mist-300 hover:border-accent-500/50 hover:text-mist-50"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                }
              />
            )}
          </section>
        ) : (
          <>
            {/* ============ FEATURED ============ */}
            <section aria-label="Featured article" className="border-b border-edge/[0.08] py-10 sm:py-14">
              <FeaturedPost post={featured} />
            </section>

            <div className="grid gap-16 pt-12 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
              <div className="min-w-0">
                {/* ============ LATEST ============ */}
                {latest.length > 0 && (
                  <section aria-labelledby="latest-heading">
                    <SectionLabel id="latest-heading">Latest</SectionLabel>
                    <PostList posts={latest} />
                  </section>
                )}

                {/* ============ ARCHIVE ============ */}
                {archive.length > 0 && (
                  <section aria-labelledby="archive-heading" className="mt-16">
                    <SectionLabel id="archive-heading">From the archive</SectionLabel>
                    <Archive posts={archive} />
                  </section>
                )}
              </div>

              <AboutRail />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ id, children }) {
  return (
    <h2 id={id} className="border-b border-edge/[0.12] pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-mist-400">
      {children}
    </h2>
  );
}

function PostList({ posts: list }) {
  return (
    <ul className="list-none divide-y divide-edge/[0.08] p-0">
      {list.map((post) => (
        <li key={post.slug}>
          <PostRow post={post} />
        </li>
      ))}
    </ul>
  );
}

/** Older posts grouped under their year. */
function Archive({ posts: list }) {
  const years = [];
  for (const post of list) {
    const year = post.date.slice(0, 4);
    if (years.at(-1)?.year !== year) years.push({ year, posts: [] });
    years.at(-1).posts.push(post);
  }

  return (
    <div>
      {years.map(({ year, posts: group }) => (
        <div key={year} className="grid border-b border-edge/[0.08] pt-2 last:border-b-0 sm:grid-cols-[5rem_minmax(0,1fr)]">
          <h3 className="pt-4 font-reading text-lg font-semibold text-mist-500 tabular sm:pt-[1.1rem]">{year}</h3>
          <ul className="list-none divide-y divide-edge/[0.06] p-0">
            {group.map((post) => (
              <li key={post.slug}>
                <ArchiveRow post={post} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Side rail: who writes this and how to follow along. */
function AboutRail() {
  return (
    <aside aria-label="About this blog" className="lg:sticky lg:top-28 lg:self-start">
      <div className="border-t-2 border-mist-50 pt-6">
        <div className="flex items-center gap-3">
          <img
            src={ProfilePic}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 rounded-full object-cover ring-1 ring-edge/[0.12]"
          />
          <div>
            <p className="font-semibold text-mist-50">{AUTHOR.name}</p>
            <p className="text-sm text-mist-500">{AUTHOR.role}</p>
          </div>
        </div>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-mist-400">
          Notes from building products end to end — what worked, what broke, and why.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/about" className="font-medium text-accent-400 hover:text-accent-300">
            About me →
          </Link>
          <a href="/rss.xml" className="inline-flex items-center gap-1.5 font-medium text-mist-400 hover:text-accent-300">
            <Rss size={14} aria-hidden="true" /> Subscribe via RSS
          </a>
        </div>
      </div>
    </aside>
  );
}

function TopicTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 whitespace-nowrap py-4 text-sm transition-colors
                  after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${
                    active
                      ? "font-medium text-mist-50 after:bg-accent-500"
                      : "text-mist-400 after:bg-transparent hover:text-mist-50 hover:after:bg-edge/20"
                  }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center sm:py-24">
      <span aria-hidden="true" className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-edge/[0.1] text-mist-500">
        <Search size={18} />
      </span>
      <p className="font-reading text-2xl font-semibold text-mist-50">{title}</p>
      <p className="mt-3 max-w-measure-sm text-mist-400">{body}</p>
      {action}
    </div>
  );
}
