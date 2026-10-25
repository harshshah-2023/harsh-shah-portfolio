import ContentGap from "./ContentGap";
import TradeoffList from "./TradeoffList";
import SystemDiagram from "./SystemDiagram";
import MetricComparison from "./MetricComparison";
import CodeExcerpt from "./CodeExcerpt";
import { SHOW_DRAFTS } from "../../behind-the-build/stories";

const Prose = ({ paragraphs, lead = false }) => (
  <div className="space-y-5">
    {paragraphs.map((p) => (
      <p
        key={p}
        className={`max-w-measure font-reading leading-[1.75] text-mist-200 [text-wrap:pretty] ${
          lead ? "text-[1.1875rem] sm:text-xl" : "text-[1.0625rem] sm:text-lg"
        }`}
      >
        {p}
      </p>
    ))}
  </div>
);

/**
 * One of the seven sections, rendered from whatever the content provides.
 * The order inside a section is fixed: prose, then evidence (constraints,
 * trade-offs, diagram, code, metrics), then any content gap.
 */
export default function StorySection({ section, number, label, hint, data }) {
  const isLesson = section === "lesson";

  return (
    <section id={section} aria-labelledby={`${section}-title`} className="scroll-mt-36 lg:scroll-mt-28">
      <header className="mb-7 flex items-baseline gap-4 border-t border-edge/[0.1] pt-6">
        <span className="font-mono text-xs text-accent-400">{number}</span>
        <div>
          <h2 id={`${section}-title`} className="text-2xl font-semibold sm:text-[1.75rem]">
            {label}
          </h2>
          <p className="mt-1 text-sm text-mist-500">{hint}</p>
        </div>
      </header>

      <div className="space-y-8">
        {data.body?.length > 0 &&
          (isLesson ? (
            <blockquote className="border-l-2 border-accent-500 pl-6">
              {data.body.map((p) => (
                <p key={p} className="max-w-measure font-reading text-xl italic leading-[1.6] text-mist-100 sm:text-[1.4rem]">
                  {p}
                </p>
              ))}
            </blockquote>
          ) : (
            <Prose paragraphs={data.body} lead={section === "problem"} />
          ))}

        {data.items?.length > 0 && (
          <ul className="grid gap-px overflow-hidden rounded-xl border border-edge/[0.08] bg-edge/[0.08] sm:grid-cols-2">
            {data.items.map((item, i) => (
              // An odd last item spans the row, so the grid never shows an empty cell.
              <li key={item} className="flex gap-4 bg-ink-900 p-5 sm:odd:last:col-span-2">
                <span aria-hidden="true" className="font-mono text-xs leading-6 text-mist-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-mist-200">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {data.tradeoffs?.length > 0 && <TradeoffList items={data.tradeoffs} />}
        {data.diagram && <SystemDiagram diagram={data.diagram} />}
        {data.code?.map((c) => <CodeExcerpt key={c.file} {...c} />)}
        {data.metrics?.length > 0 && <MetricComparison metrics={data.metrics} />}

        {SHOW_DRAFTS && data.gap && <ContentGap>{data.gap}</ContentGap>}
      </div>
    </section>
  );
}
