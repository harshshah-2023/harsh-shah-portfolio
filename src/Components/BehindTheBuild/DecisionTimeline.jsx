/**
 * How the work got here: dated milestones, with the one the story covers
 * marked. Vertical on phones, a single horizontal rail from md up.
 *
 * items = [{ date: "YYYY-MM", label, current? }]
 */
const monthLabel = (ym) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export default function DecisionTimeline({ items, title = "How it got here" }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">{title}</p>
      <ol className="relative mt-5 grid gap-5 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-4" style={{ "--n": items.length }}>
        <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-edge/[0.1] md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto" />
        {items.map((item) => (
          <li key={item.date + item.label} className="relative pl-7 md:pl-0 md:pt-7">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full border-2 md:top-0 ${
                item.current ? "border-accent-400 bg-accent-500" : "border-mist-600 bg-ink-900"
              }`}
            />
            <time dateTime={item.date} className={`block text-xs ${item.current ? "text-accent-300" : "text-mist-500"}`}>
              {monthLabel(item.date)}
            </time>
            <p className={`mt-1 text-sm leading-snug ${item.current ? "font-medium text-mist-50" : "text-mist-300"}`}>
              {item.label}
              {item.current && <span className="sr-only"> (this story)</span>}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
