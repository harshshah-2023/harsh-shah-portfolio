
/** Lightweight fallback shown while a lazily-loaded route chunk downloads. */
export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900">
      <div
        className="w-8 h-8 rounded-full border-2 border-white/[0.10] border-t-accent-500 animate-spin"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}
