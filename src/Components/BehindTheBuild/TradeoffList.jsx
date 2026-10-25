import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const LETTERS = "ABCDEFGHIJ";

/**
 * Each decision as "chose X over Y", expandable to the reasoning and the
 * price paid. The first one starts open so the pattern is self-explanatory.
 */
export default function TradeoffList({ items }) {
  const baseId = useId();
  const [open, setOpen] = useState(() => new Set([0]));
  const allOpen = open.size === items.length;

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div>
      {items.length > 1 && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((_, i) => i)))}
            className="rounded-lg px-2 py-1 text-xs font-medium text-mist-400 hover:text-accent-300"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}

      <ol className="divide-y divide-edge/[0.08] border-y border-edge/[0.08]">
        {items.map((t, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li key={t.chose}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="group flex w-full items-start gap-4 py-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 font-mono text-xs transition-colors ${
                      isOpen ? "text-accent-400" : "text-mist-500 group-hover:text-mist-300"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-semibold leading-snug text-mist-50 sm:text-lg">
                      {t.chose}
                    </span>
                    <span className="mt-1 block text-sm text-mist-400">
                      <span className="text-mist-500">over</span> {t.over}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`mt-1 shrink-0 text-mist-500 transition-transform duration-200 group-hover:text-mist-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>

              {isOpen && (
                <div id={panelId} className="animate-riseIn pb-6 pl-8">
                  <dl className={`grid gap-5 ${t.cost ? "sm:grid-cols-2 sm:gap-8" : ""}`}>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-400">Why</dt>
                      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-mist-300">{t.why}</dd>
                    </div>
                    {t.cost && (
                      <div className="sm:border-l sm:border-edge/[0.08] sm:pl-8">
                        <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
                          What it cost
                        </dt>
                        <dd className="mt-2 text-[0.9375rem] leading-relaxed text-mist-300">{t.cost}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
