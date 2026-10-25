/**
 * A short, verbatim excerpt from the codebase. No runtime highlighter (the
 * blog highlights at build time); comments are dimmed so the code stands out.
 */
export default function CodeExcerpt({ file, lang, source }) {
  const lines = source.split("\n");

  return (
    <figure className="overflow-hidden rounded-xl border border-edge/[0.08] bg-ink-950 shadow-e2">
      <figcaption className="flex items-center justify-between gap-4 border-b border-edge/[0.06] bg-edge/[0.02] px-4 py-2.5">
        <span className="truncate font-mono text-xs text-mist-400">{file}</span>
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-mist-500">{lang}</span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-[1.7] text-mist-200 sm:px-5">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={`block ${/^\s*\/\//.test(line) ? "italic text-mist-500" : ""}`}
            >
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
