import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useDocumentMeta from "../blog/useDocumentMeta";
import { siteUrl } from "../blog/posts";
import {
  SECTIONS,
  SHOW_DRAFTS,
  draftStories,
  gapCount,
  publishedStories,
  storyUrl,
} from "../behind-the-build/stories";

const SUBTITLE = "Real problems. Engineering decisions. Trade-offs, failures, and lessons from building software.";

export default function BehindTheBuild() {
  useDocumentMeta({
    title: "Behind the Build — Harsh Shah",
    description: SUBTITLE,
    canonical: `${siteUrl}/behind-the-build`,
  });

  return (
    <div className="min-h-screen bg-ink-900 pb-28 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* ============ MASTHEAD ============ */}
        <header>
          <p className="eyebrow">Harsh Shah · Engineering case studies</p>

          <h1 className="mt-8 font-reading text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:mt-10 sm:text-7xl lg:text-[6.5rem]">
            Behind the Build
          </h1>

          <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <p className="max-w-[30ch] text-[1.375rem] leading-snug text-mist-100 sm:text-[1.75rem]">{SUBTITLE}</p>
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-mist-400">
              <Link to="/projects" className="text-mist-200 underline decoration-edge/30 underline-offset-4 hover:text-accent-300">
                Projects
              </Link>{" "}
              show what I built. These stories show how I decided: what I chose, what I gave up, and what I&apos;d do
              differently. Each one lists the evidence it&apos;s drawn from.
            </p>
          </div>
        </header>

        {/* ============ ANATOMY ============ */}
        <section aria-labelledby="anatomy-title" className="mt-14 border-y border-edge/[0.08] py-7 sm:mt-20">
          <h2 id="anatomy-title" className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">
            Every story, the same seven questions
          </h2>
          <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
            {SECTIONS.map((s, i) => (
              <li key={s.key}>
                <span className="font-mono text-xs text-accent-400">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 text-sm font-medium text-mist-100">{s.label.replace(/^The /, "")}</p>
                <p className="mt-1 text-xs leading-snug text-mist-500">{s.hint}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ STORIES ============ */}
        <section aria-labelledby="stories-title" className="mt-6">
          <h2 id="stories-title" className="sr-only">
            Stories
          </h2>
          <ol>
            {publishedStories.map((story, i) => (
              <StoryEntry key={story.slug} story={story} index={i} featured={i === 0} />
            ))}
          </ol>
        </section>

        {SHOW_DRAFTS && draftStories.length > 0 && <Drafts />}

        {/* ============ CLOSING ============ */}
        <footer className="mt-20 grid gap-8 border-t-2 border-mist-50 pt-8 sm:grid-cols-3">
          <ClosingLink to="/projects" kicker="What I built" title="Projects" />
          <ClosingLink to="/blog" kicker="What I write" title="Blog" />
        </footer>
      </div>
    </div>
  );
}

function StoryEntry({ story, index, featured }) {
  return (
    <li className="group relative border-b border-edge/[0.08] py-10 sm:py-14">
      <article className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="flex items-baseline gap-4 lg:col-span-2 lg:flex-col lg:gap-3">
          <span
            aria-hidden="true"
            className="font-reading text-5xl font-semibold leading-none tracking-[-0.04em] text-mist-600 transition-colors group-hover:text-accent-400 lg:text-6xl"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-mist-500">
            {story.domain}
            <span className="block normal-case tracking-normal text-mist-600 tabular">{story.year}</span>
          </p>
        </div>

        <div className="lg:col-span-6">
          <h3
            className={`font-reading font-semibold leading-[1.1] tracking-[-0.02em] ${
              featured ? "text-[2rem] sm:text-[2.75rem]" : "text-[1.75rem] sm:text-[2.125rem]"
            }`}
          >
            {/* The whole row is the link; the pseudo-element stretches it. */}
            <Link to={storyUrl(story.slug)} className="rounded-sm after:absolute after:inset-0 after:content-['']">
              <span className="title-underline">{story.title}</span>
            </Link>
          </h3>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mist-400 sm:text-[1.0625rem]">{story.dek}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-400 group-hover:text-accent-300">
            Read the story
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 ease-soft group-hover:translate-x-1" />
          </p>
        </div>

        <aside className="space-y-6 lg:col-span-4 lg:border-l lg:border-edge/[0.08] lg:pl-8">
          {story.call && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">The call</p>
              <p className="mt-2 font-reading text-[1.0625rem] italic leading-relaxed text-mist-200">{story.call}</p>
            </div>
          )}
          {story.headline && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">Outcome</p>
              <p className={`mt-2 font-semibold tracking-[-0.02em] text-mist-50 tabular ${featured ? "text-3xl" : "text-2xl"}`}>
                {story.headline.value}
              </p>
              <p className="mt-1 text-sm text-mist-500">{story.headline.label}</p>
            </div>
          )}
        </aside>
      </article>
    </li>
  );
}

function Drafts() {
  return (
    <section aria-labelledby="drafts-title" className="mt-14 rounded-2xl border border-dashed border-mist-500/50 p-6 sm:p-8">
      <h2 id="drafts-title" className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
        Drafts · visible on the dev server only
      </h2>
      <ul className="mt-5 divide-y divide-edge/[0.06]">
        {draftStories.map((s) => (
          <li key={s.slug}>
            <Link to={storyUrl(s.slug)} className="flex flex-wrap items-baseline justify-between gap-2 py-3 hover:text-accent-300">
              <span className="text-mist-100">{s.title}</span>
              <span className="text-xs text-mist-500 tabular">{gapCount(s)} sections with content gaps</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ClosingLink({ to, kicker, title }) {
  return (
    <Link to={to} className="group block rounded-lg">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">{kicker}</p>
      <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-mist-50 group-hover:text-accent-300">
        {title}
        <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-200 ease-soft group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
