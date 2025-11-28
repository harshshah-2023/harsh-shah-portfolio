import React, { useRef } from 'react';

const ProjectRow = ({ title, projects, gradient, onProjectSelect, isActive }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative group mb-12">
      {/* Row Title */}
      <h2 className="text-2xl font-bold mb-4 px-6 flex items-center gap-3">
        <span className={`bg-gradient-to-r ${gradient} px-3 py-1 rounded-lg`}>
          {title}
        </span>
        {isActive && (
          <span className="text-sm text-gray-400 animate-pulse">• Now viewing</span>
        )}
      </h2>

      {/* Scroll Buttons */}
      <button 
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Projects Row */}
      <div 
        ref={rowRef}
        className="flex space-x-4 px-6 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className="flex-none w-80 transform transition-all duration-500 hover:scale-105 cursor-pointer group/card"
          >
            {/* Project Card */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-white/30 transition-all duration-300">
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  {/* Quick Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <button className="bg-gray-600/70 backdrop-blur-sm text-white p-2 rounded-full border border-gray-500 hover:bg-gray-500/70">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <button className="bg-gray-600/70 backdrop-blur-sm text-white p-2 rounded-full border border-gray-500 hover:bg-gray-500/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {project.featured && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      FEATURED
                    </span>
                  )}
                  <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs border border-white/20">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white line-clamp-1">{project.title}</h3>
                  <span className="text-green-500 text-sm font-medium">{project.metrics.performance}</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectRow;