/**
 * Before/after measurements. Each metric is scaled on its own, since kB and
 * ms can't share an axis; the "after" bar is drawn relative to "before".
 * Every value is printed, so the bars are reinforcement, never the only cue.
 *
 * metrics = [{ label, before, after, unit, approx?, note? }]
 */
const fmt = (n) => n.toLocaleString("en-US");

export default function MetricComparison({ metrics }) {
  return (
    <figure className="rounded-2xl border border-edge/[0.08] bg-ink-850 p-5 shadow-hairline sm:p-7">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mist-400">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-[2px] bg-mist-600/70" /> Before
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-[2px] bg-accent-500" /> After
        </span>
        <span className="text-mist-500">· lower is better</span>
      </div>

      <dl className="mt-6 space-y-6">
        {metrics.map((m) => {
          const ratio = m.after / m.before;
          const change = Math.round((ratio - 1) * 100);
          const tilde = m.approx ? "~" : "";
          return (
            <div key={m.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-sm font-medium text-mist-100">{m.label}</dt>
                <dd className="tabular text-sm text-mist-400">
                  <span className="sr-only">from </span>
                  {tilde}
                  {fmt(m.before)} {m.unit}
                  <span aria-hidden="true" className="mx-1.5 text-mist-600">→</span>
                  <span className="sr-only"> to </span>
                  <span className="font-semibold text-mist-50">
                    {tilde}
                    {fmt(m.after)} {m.unit}
                  </span>
                  <span className="ml-2 font-medium text-accent-300">{change}%</span>
                </dd>
              </div>
              <div aria-hidden="true" className="mt-2.5 space-y-[2px]">
                <div className="h-1.5 w-full rounded-[3px] bg-mist-600/70" />
                <div
                  className="h-1.5 rounded-[3px] bg-accent-500"
                  style={{ width: `${Math.max(ratio * 100, 1.5)}%` }}
                />
              </div>
              {m.note && <p className="mt-1.5 text-xs text-mist-500">{m.note}</p>}
            </div>
          );
        })}
      </dl>
    </figure>
  );
}
