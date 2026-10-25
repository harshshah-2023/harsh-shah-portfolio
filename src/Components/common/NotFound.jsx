import { Link } from "react-router-dom";

/** Catch-all route. Previously an unknown URL rendered an empty page. */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-ink-900">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-4xl sm:text-5xl font-bold">This page doesn&apos;t exist.</h1>
      <p className="text-mist-400 mt-6 max-w-measure-sm">
        The link may be outdated. Head back home or jump straight to the work.
      </p>
      <div className="flex flex-wrap gap-4 justify-center mt-12">
        <Link
          to="/"
          className="px-8 py-3 rounded-lg bg-accent-500 text-ink-950 font-semibold shadow-glow
                     transition duration-200 ease-soft
                     hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-glow-lg"
        >
          Go Home
        </Link>
        <Link
          to="/projects"
          className="px-8 py-3 rounded-lg border border-edge/[0.14] text-mist-200 shadow-e2
                     transition duration-200 ease-soft
                     hover:-translate-y-0.5 hover:border-accent-500/50 hover:text-mist-50 hover:shadow-e3"
        >
          View Projects
        </Link>
      </div>
    </div>
  );
}
