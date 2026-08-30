import { useEffect, useRef } from 'react';
import ProjectThumb from './ProjectThumb';

const ProjectModal = ({ project, onClose }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    // Remember what to restore rather than hard-coding 'unset': the mobile nav
    // also locks body scroll, and clobbering its value left the page unable to
    // scroll after closing.
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  // FIXED: Handle link clicks to prevent modal from closing
  const handleLiveDemoClick = (e) => {
    e.stopPropagation();
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGitHubClick = (e) => {
    e.stopPropagation();
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-ink-950/80 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative bg-ink-850 rounded-2xl border border-white/[0.08] shadow-e4 max-w-6xl w-full max-h-[90vh] overflow-y-auto modal-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section */}
        <div className="relative">
          <div className="h-96 overflow-hidden">
            <ProjectThumb project={project} hero />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/60 to-transparent pointer-events-none"></div>
          
          {/* Close Button */}
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-6 right-6 z-10 bg-ink-950/70 backdrop-blur-sm text-mist-300 w-10 h-10 rounded-full flex items-center justify-center border border-white/[0.12] shadow-e2 transition duration-200 ease-soft hover:bg-ink-950 hover:text-mist-50 hover:border-white/25"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start gap-6 mb-8">
            <span className="text-5xl">{project.logo}</span>
            <div>
              <h1 id="project-modal-title" className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
              <div className="flex items-center flex-wrap gap-2 text-sm text-mist-400">
                <span className="text-emerald-400 font-medium pr-2">{project.metrics?.accuracy || "High Performance"}</span>
                <span className="tabular px-1">{project.year}</span>
                <span className="border border-white/[0.16] text-mist-300 px-3 py-1 rounded-full text-xs">{project.maturityRating}</span>
                <span className="px-1">{project.metrics?.stations || project.metrics?.recovery || "Large Scale"}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 mb-12">
            {/* SHOW LIVE DEMO ONLY FOR PROJECTS WITH HASLIVEDEMO = TRUE */}
            {project.hasLiveDemo && project.liveUrl && (
              <button
                type="button"
                onClick={handleLiveDemoClick}
                className="flex items-center gap-2 bg-emerald-500/[0.16] text-emerald-200 border border-emerald-500/40 px-6 py-3 rounded-lg font-semibold shadow-e2 cursor-pointer transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-emerald-500/25 hover:shadow-e3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Live Demo
              </button>
            )}
            
            {/* ALWAYS SHOW GITHUB IF URL EXISTS */}
            {project.githubUrl && (
              <button
                type="button"
                onClick={handleGitHubClick}
                className="flex items-center gap-2 bg-white/[0.06] text-mist-100 border border-white/[0.12] px-6 py-3 rounded-lg font-semibold shadow-e2 cursor-pointer transition duration-200 ease-soft hover:-translate-y-0.5 hover:bg-white/[0.12] hover:shadow-e3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-mist-300 text-base max-w-measure-lg mb-12">
            {project.fullDescription}
          </p>

          {/* Highlights & Tech Stack */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Highlights */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Key Achievements</h3>
              <div className="space-y-2">
                {project.highlights && project.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-lg border border-white/[0.07]">
                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-mist-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/[0.04] text-mist-300 text-xs rounded-md border border-white/[0.07]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;