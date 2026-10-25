import { useEffect, useRef } from "react";

/**
 * Wayfinding through a story's seven sections, highlighting the one being
 * read. A sticky vertical rail on large screens; a sticky, horizontally
 * scrolling strip under the navbar below that.
 */
export function SectionRail({ sections, active }) {
  return (
    <nav aria-label="Story sections" className="sticky top-28 hidden lg:block">
      <ol className="space-y-1 border-l border-edge/[0.08]">
        {sections.map((s) => {
          const isActive = s.key === active;
          return (
            <li key={s.key}>
              <a
                href={`#${s.key}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors ${
                  isActive
                    ? "border-accent-400 text-mist-50"
                    : "border-transparent text-mist-400 hover:border-mist-500 hover:text-mist-100"
                } ${s.gapOnly ? "opacity-60" : ""}`}
              >
                <span className={`font-mono text-xs leading-5 ${isActive ? "text-accent-400" : "text-mist-500"}`}>
                  {s.number}
                </span>
                {s.label.replace(/^The /, "")}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SectionStrip({ sections, active }) {
  const scroller = useRef(null);

  // Keep the active chip in view without scrolling the page itself.
  useEffect(() => {
    const box = scroller.current;
    const chip = box?.querySelector('[aria-current="location"]');
    if (!box || !chip) return;
    const left = chip.offsetLeft - box.clientWidth / 2 + chip.clientWidth / 2;
    box.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Story sections"
      className="sticky top-[68px] z-30 -mx-5 border-y border-edge/[0.06] bg-ink-900/90 backdrop-blur-xl sm:-mx-6 lg:hidden"
    >
      <ol ref={scroller} className="no-scrollbar fade-x flex gap-1 overflow-x-auto px-4 py-2 sm:px-5">
        {sections.map((s) => {
          const isActive = s.key === active;
          return (
            <li key={s.key} className="shrink-0">
              <a
                href={`#${s.key}`}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? "bg-accent-500/[0.14] text-accent-200" : "text-mist-400 hover:text-mist-100"
                }`}
              >
                <span className="font-mono">{s.number}</span>
                {s.label.replace(/^The /, "")}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
