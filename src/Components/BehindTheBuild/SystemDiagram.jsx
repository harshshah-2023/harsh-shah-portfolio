import { useState } from "react";

/**
 * A system drawn as one or more lanes of stages joined by a rail. Selecting a
 * stage explains it: beside the diagram on wide screens, inline under the
 * stage on narrow ones (only one of the two is ever displayed).
 *
 * diagram = { caption, lanes: [{ label, nodes: [{ id, label, detail }] }] }
 */
export default function SystemDiagram({ diagram }) {
  const all = diagram.lanes.flatMap((lane) => lane.nodes.map((node) => ({ ...node, lane })));
  const [selectedId, setSelectedId] = useState(all[0]?.id);
  const selected = all.find((n) => n.id === selectedId) || all[0];

  return (
    <figure className="rounded-2xl border border-edge/[0.08] bg-ink-850 p-5 shadow-hairline sm:p-7">
      <div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
        <div className="space-y-7">
          {diagram.lanes.map((lane, laneIndex) => (
            <div key={lane.label}>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist-500">{lane.label}</p>
              <ol className="relative mt-3">
                {/* The rail. Dashed for secondary lanes. */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-4 left-[7px] top-4 w-px ${
                    laneIndex === 0 ? "bg-accent-500/40" : "border-l border-dashed border-mist-600/60"
                  }`}
                />
                {lane.nodes.map((node) => {
                  const isSelected = node.id === selected.id;
                  return (
                    <li key={node.id} className="relative">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(node.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg py-2 pr-2 text-left text-sm transition-colors ${
                          isSelected ? "text-mist-50" : "text-mist-300 hover:text-mist-50"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`relative z-10 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-colors ${
                            isSelected
                              ? "border-accent-400 bg-accent-500"
                              : "border-mist-600 bg-ink-850 group-hover:border-accent-400"
                          }`}
                        />
                        <span className={`font-mono text-[13px] ${isSelected ? "font-medium" : ""}`}>{node.label}</span>
                      </button>

                      {isSelected && (
                        <p className="animate-riseIn mb-2 ml-[27px] mt-1 text-sm leading-relaxed text-mist-300 md:hidden">
                          {node.detail}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        <div aria-live="polite" className="hidden md:block">
          <div key={selected.id} className="animate-riseIn md:sticky md:top-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-400">{selected.lane.label}</p>
            <p className="mt-3 font-mono text-lg text-mist-50">{selected.label}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-mist-300">{selected.detail}</p>
          </div>
        </div>
      </div>

      {diagram.caption && (
        <figcaption className="mt-6 border-t border-edge/[0.06] pt-4 text-xs text-mist-500">{diagram.caption}</figcaption>
      )}
    </figure>
  );
}
