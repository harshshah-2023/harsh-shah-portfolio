import { useState } from 'react';

/**
 * Project image with a graceful fallback.
 *
 * Three projects have no artwork (they previously pointed at
 * "/api/placeholder/800/450", a URL nothing serves, so the browser drew a
 * broken-image icon). When there is no usable source — or the file fails to
 * load — this renders a branded gradient tile carrying the project's emoji
 * instead, so the card never looks broken.
 */
export default function ProjectThumb({ project, className = "", hero = false }) {
  const source = hero ? project.heroImage : project.image;
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br
                    from-ink-750 via-ink-850 to-ink-950 ${className}`}
        role="img"
        aria-label={project.title}
      >
        <span className={hero ? "text-[12rem] opacity-[0.12]" : "text-6xl opacity-30"} aria-hidden="true">
          {project.logo}
        </span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={project.title}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "low"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
