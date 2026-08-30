import { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ProjectHero from "./ProjectHero";
import ProjectModal from "./ProjectModal";
import ProjectThumb from "./ProjectThumb";
import { PROJECTS } from "./projects";

export default function ProjectsGallery() {
  // Seeded directly from the catalogue. This used to be set in an effect,
  // which meant the page rendered once with no hero, then re-rendered - a
  // visible flash plus a wasted commit on every visit.
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const openProject = useCallback((project) => {
    setActiveProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleProjectDetails = useCallback(() => {
    setSelectedProject((current) => current ?? activeProject);
  }, [activeProject]);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950">

      <ProjectHero project={activeProject} onInfo={handleProjectDetails} />

      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <p className="inline-flex px-4 py-1 text-xs font-medium tracking-[0.18em]
                        rounded-full bg-accent-500/[0.10] text-accent-300
                        border border-accent-500/25">
            🚀 HIGH-IMPACT PROJECT BUILDS
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-6 bg-gradient-to-r from-mist-50 to-mist-300 bg-clip-text text-transparent">
            Built for Scale &amp; Performance
          </h2>

          <p className="text-mist-400 text-lg font-light max-w-measure mx-auto mt-6">
            Systems engineered like products — optimized, automated &amp; production-focused.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 list-none p-0">
          {PROJECTS.map((p) => (
            <li key={p.id}>
              {/*
                Was a click-only <div>: not focusable and invisible to keyboard
                and screen-reader users. A real button keeps the same visuals
                and gets Enter/Space and focus rings for free.
              */}
              <button
                type="button"
                onClick={() => openProject(p)}
                aria-label={`View ${p.title}`}
                aria-current={activeProject.id === p.id ? "true" : undefined}
                className={`group w-full h-full text-left p-px rounded-2xl cursor-pointer
                            bg-gradient-to-br shadow-e2
                            transition duration-200 ease-soft
                            hover:-translate-y-0.5 hover:shadow-glow-lg
                            ${activeProject.id === p.id
                              ? "from-accent-500/50 to-accent-500/10"
                              : "from-white/[0.10] to-white/[0.03] hover:from-accent-500/40 hover:to-white/[0.06]"}`}
              >
                <div className="rounded-2xl overflow-hidden bg-ink-800/90 h-full flex flex-col">

                  <div className="h-56 relative overflow-hidden">
                    <ProjectThumb project={p} className="group-hover:scale-[1.04] duration-700" />
                    {/* Scrim keeps the badges legible over bright artwork. */}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-ink-950/40" />
                    <span className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full
                                     bg-ink-950/75 text-mist-300 border border-white/[0.12] backdrop-blur-sm">
                      {p.category}
                    </span>
                    {p.hasLiveDemo && (
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full
                                       bg-emerald-500/[0.14] text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                        🌐 Live Demo
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-mist-50 transition-colors duration-200 group-hover:text-accent-300">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-mist-400 line-clamp-2">{p.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-mist-500">
                          {t}
                        </span>
                      ))}
                      {p.technologies.length > 4 && (
                        <span className="text-xs text-mist-500 self-center">
                          +{p.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-6 pb-6 pt-4">
                    <span className="text-mist-500 text-xs tabular">{p.year}</span>
                    <span className="text-xs px-3 py-1 rounded-full border border-accent-500/25
                                     bg-accent-500/[0.08] text-accent-300">
                      {p.maturityRating}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="text-center mt-24">
          <h3 className="text-3xl font-bold mb-6">Want a System Like These?</h3>
          <p className="text-mist-400 mb-8">Let&apos;s build something technically serious.</p>
          {/*
            Was `window.location.href = "/contact"`, which triggered a full
            document reload and re-downloaded the whole app. Client-side
            navigation keeps it instant.
          */}
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="px-8 py-4 rounded-lg bg-accent-500 text-ink-950 font-semibold
                       shadow-glow transition duration-200 ease-soft cursor-pointer
                       hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-glow-lg"
          >
            🔥 Start a Project
          </button>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
}
