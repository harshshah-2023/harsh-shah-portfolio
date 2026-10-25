/**
 * A visible "missing content" note. Rendered only on the dev server (see
 * SHOW_DRAFTS in src/behind-the-build/stories.js), so an unfinished section
 * is obvious while writing and never reaches production.
 */
export default function ContentGap({ children, className = "" }) {
  return (
    <div
      role="note"
      className={`rounded-xl border border-dashed border-mist-500/50 bg-edge/[0.02] px-5 py-4 ${className}`}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
        Content gap · dev only
      </p>
      <p className="mt-2 text-sm leading-relaxed text-mist-300">{children}</p>
    </div>
  );
}
