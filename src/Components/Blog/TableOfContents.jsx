import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Tracks which heading is currently at the top of the reading area. */
function useActiveHeading(idsKey) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const elements = idsKey
      .split("|")
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Below the fixed navbar, in the top third of the viewport.
      { rootMargin: "-96px 0px -66% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}

function TocList({ toc, active }) {
  return (
    <ol className="space-y-1 border-l border-edge/[0.08]">
      {toc.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-px block border-l py-1 text-sm leading-snug transition-colors ${
                item.depth === 3 ? "pl-7" : "pl-4"
              } ${
                isActive
                  ? "border-accent-400 text-mist-50"
                  : "border-transparent text-mist-500 hover:border-edge/25 hover:text-mist-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Outline generated from the article's h2/h3 headings at build time.
 * "sidebar" is the sticky desktop rail; "inline" is a collapsible block
 * shown above the article on narrower screens.
 */
export default function TableOfContents({ toc, variant = "sidebar", className = "" }) {
  const active = useActiveHeading(toc.map((t) => t.id).join("|"));

  if (variant === "inline") {
    return (
      <details className={`group border-y border-edge/[0.1] ${className}`}>
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-xs font-medium uppercase tracking-[0.16em] text-mist-400 hover:text-mist-50 [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronDown size={16} aria-hidden="true" className="text-mist-500 transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="Table of contents" className="pb-5">
          <TocList toc={toc} active={active} />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-mist-500">On this page</p>
      <TocList toc={toc} active={active} />
    </nav>
  );
}
