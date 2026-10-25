import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import useDocumentMeta from "../blog/useDocumentMeta";
import { siteUrl } from "../blog/posts";
import NotFound from "../Components/common/NotFound";
import StorySection from "../Components/BehindTheBuild/StorySection";
import DecisionTimeline from "../Components/BehindTheBuild/DecisionTimeline";
import { SectionRail, SectionStrip } from "../Components/BehindTheBuild/SectionRail";
import useActiveSection from "../behind-the-build/useActiveSection";
import { SECTIONS, getStory, hasContent, stories, storyUrl, visibleSections } from "../behind-the-build/stories";

/** The single template every engineering story renders through. */
export default function BuildStory() {
  const { slug } = useParams();
  const story = getStory(slug);

  useDocumentMeta(
    story
      ? {
          title: `${story.title} — Behind the Build`,
          description: story.dek,
          canonical: `${siteUrl}${storyUrl(story.slug)}`,
          type: "article",
          robots: story.status === "draft" ? "noindex" : undefined,
        }
      : { title: "Story not found — Harsh Shah", robots: "noindex" }
  );

  if (!story) return <NotFound />;
  // Keyed so the scroll-spy and disclosure state reset between stories.
  return <Story key={story.slug} story={story} />;
}

function Story({ story }) {
  const sections = visibleSections(story).map((s) => ({
    ...s,
    number: String(SECTIONS.indexOf(s) + 1).padStart(2, "0"),
    gapOnly: !hasContent(story[s.key]),
  }));
  const active = useActiveSection(sections.map((s) => s.key));

  const index = stories.indexOf(story);
  const next = stories[(index + 1) % stories.length];
  const firstTradeoff = story.tradeoffs?.tradeoffs?.[0];

  return (
    <article className="bg-ink-900 pb-28 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* ============ HEADER ============ */}
        <header className="max-w-4xl">
          <Link
            to="/behind-the-build"
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-mist-400 hover:text-mist-50"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Behind the Build
          </Link>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-accent-400">
            {story.domain}
            <span aria-hidden="true" className="mx-2 text-mist-600">/</span>
            <span className="tabular">{story.year}</span>
            {story.status === "draft" && (
              <span className="ml-3 rounded-full border border-mist-500/50 px-2 py-0.5 normal-case tracking-normal text-mist-300">
                Draft · dev only
              </span>
            )}
          </p>

          <h1 className="mt-4 font-reading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.25rem]">
            {story.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-mist-400 sm:text-[1.3125rem]">{story.dek}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-edge/[0.08] py-4 text-sm">
            <div>
              <dt className="text-mist-500">Role</dt>
              <dd className="mt-0.5 text-mist-100">{story.role}</dd>
            </div>
            {story.stack.length > 0 && (
              <div className="min-w-0 flex-1">
                <dt className="text-mist-500">Built with</dt>
                <dd className="mt-0.5 text-mist-100">{story.stack.join(" · ")}</dd>
              </div>
            )}
          </dl>
        </header>

        {/* ============ AT A GLANCE ============ */}
        {(story.call || firstTradeoff || story.headline) && (
          <section
            aria-label="At a glance"
            className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-edge/[0.08] bg-edge/[0.08] md:grid-cols-3"
          >
            {story.call && <Glance label="The call" text={story.call} serif />}
            {firstTradeoff && (
              <Glance
                label="Main trade-off"
                text={
                  <>
                    {firstTradeoff.chose} <span className="text-mist-500">over</span> {firstTradeoff.over.toLowerCase()}
                  </>
                }
              />
            )}
            {story.headline && (
              <Glance
                label="Outcome"
                text={
                  <>
                    <span className="block text-2xl font-semibold tracking-[-0.02em] text-mist-50 tabular">
                      {story.headline.value}
                    </span>
                    <span className="mt-1 block text-sm text-mist-400">{story.headline.label}</span>
                  </>
                }
              />
            )}
          </section>
        )}

        {/* ============ BODY ============ */}
        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
          <aside>
            <SectionRail sections={sections} active={active} />
          </aside>
          <SectionStrip sections={sections} active={active} />

          <div className="mt-10 max-w-[46rem] space-y-20 lg:mt-0">
            {sections.map((s) => (
              <div key={s.key} className="space-y-12">
                <StorySection section={s.key} number={s.number} label={s.label} hint={s.hint} data={story[s.key]} />
                {/* The history sits after the decision it led to. */}
                {s.key === "decision" && story.timeline && <DecisionTimeline items={story.timeline} />}
              </div>
            ))}

            {/* ============ EVIDENCE & LINKS ============ */}
            <footer className="grid gap-10 border-t border-edge/[0.1] pt-8 sm:grid-cols-2">
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">Evidence</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mist-400">
                  {story.sources.map((src) => (
                    <li key={src.label}>
                      {src.href ? (
                        <a href={src.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300">
                          {src.label} <ArrowUpRight size={13} aria-hidden="true" className="inline" />
                        </a>
                      ) : (
                        src.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {story.links.length > 0 && (
                <div>
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">Related</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {story.links.map((l) => (
                      <li key={l.label}>
                        {l.to ? (
                          <Link to={l.to} className="text-mist-200 hover:text-accent-300">
                            {l.label} <span aria-hidden="true">→</span>
                          </Link>
                        ) : (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-mist-200 hover:text-accent-300">
                            {l.label} <ArrowUpRight size={13} aria-hidden="true" className="inline" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </footer>

            {next && next !== story && (
              <Link
                to={storyUrl(next.slug)}
                className="group block rounded-2xl border border-edge/[0.08] p-6 transition duration-200 ease-soft hover:border-accent-500/40 hover:bg-edge/[0.03] sm:p-8"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">Next story</p>
                <p className="mt-3 flex items-start justify-between gap-6 font-reading text-2xl font-semibold leading-snug text-mist-50 sm:text-[1.75rem]">
                  <span className="title-underline">{next.title}</span>
                  <ArrowRight
                    size={22}
                    aria-hidden="true"
                    className="mt-1.5 shrink-0 text-accent-400 transition-transform duration-200 ease-soft group-hover:translate-x-1"
                  />
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Glance({ label, text, serif = false }) {
  return (
    <div className="bg-ink-900 p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">{label}</p>
      <div className={`mt-3 leading-relaxed text-mist-200 ${serif ? "font-reading text-[1.0625rem] italic" : "text-[0.9375rem]"}`}>
        {text}
      </div>
    </div>
  );
}
