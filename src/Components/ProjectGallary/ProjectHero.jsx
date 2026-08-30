import ProjectThumb from './ProjectThumb';

const ProjectHero = ({ project, onInfo }) => {
  if (!project) return null;

  return (
    <section className="relative h-screen flex items-center justify-start bg-ink-950">
      
      {/* Background image. Rendered as a real <img> rather than a CSS
          background so the browser's preload scanner can discover and
          prioritise it - as a background-image it was found only after the
          stylesheet applied, delaying the largest paint on this page. */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ProjectThumb project={project} hero />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 mt-16">
        <div className="max-w-2xl">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl bg-ink-950/60 backdrop-blur-sm p-3 rounded-lg border border-white/[0.12] shadow-e2">
              {project.logo}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-mist-50 to-mist-300 bg-clip-text text-transparent">
              {project.title}
            </h1>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
            <span className="text-emerald-400 font-medium flex items-center gap-2 pr-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              {project.metrics?.accuracy || "High Performance"}
            </span>
            <span className="border border-white/[0.16] text-mist-300 px-3 py-1 rounded-full text-xs">
              {project.maturityRating}
            </span>
            <span className="text-xs text-mist-400 tabular px-1">{project.year}</span>
            <span className="bg-accent-500/[0.12] text-accent-300 px-3 py-1 rounded-full border border-accent-500/30 text-xs">
              {project.metrics?.stations || project.metrics?.recovery || project.metrics?.scale || "Large Scale"}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-mist-300 mb-8 max-w-measure">
            {project.fullDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(project.technologies || []).slice(0, 6).map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs text-mist-300 border border-white/[0.10] hover:border-accent-500/40 hover:text-accent-200 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Project Details */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInfo();
              }}
              className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm text-mist-50 px-6 py-3 rounded-lg font-semibold border border-white/[0.14] shadow-e2 text-sm transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-white/[0.14] hover:border-white/25 hover:shadow-e3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Details
            </button>

            {/* Live Demo */}
            {project.hasLiveDemo && project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-emerald-500/[0.16] backdrop-blur-sm text-emerald-200 px-6 py-3 rounded-lg font-semibold border border-emerald-500/40 shadow-e2 text-sm transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-emerald-500/25 hover:shadow-e3"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Live Demo
              </a>
            )}

            {/* View Code */}
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-ink-800/80 backdrop-blur-sm text-mist-100 px-6 py-3 rounded-lg font-semibold border border-white/[0.10] shadow-e2 text-sm transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-ink-750 hover:border-white/[0.18] hover:shadow-e3"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-950 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default ProjectHero;
