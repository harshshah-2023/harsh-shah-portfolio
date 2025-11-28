import React, { useState } from 'react';

const ProjectHero = ({ project, onPlay, onInfo }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-start bg-gradient-to-r from-black via-black/90 to-transparent">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isVideoPlaying && project.trailerVideo ? (
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            poster={project.heroImage}
          >
            <source src={project.trailerVideo} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${project.heroImage})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 mt-16">
        <div className="max-w-xl">
          {/* Logo/Title */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/20">
              {project.logo}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {project.title}
            </h1>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
            <span className="text-green-500 font-semibold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              {project.metrics.performance} Match
            </span>
            <span className="border border-gray-400 px-2 py-0.5 rounded-full text-xs">{project.maturityRating}</span>
            <span className="text-xs">{project.year}</span>
            <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full border border-red-600/30 text-xs">
              {project.metrics.scale}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-gray-200 mb-6 leading-relaxed max-w-2xl">
            {project.fullDescription}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 6).map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20 hover:border-red-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => {
                setIsVideoPlaying(true);
                onPlay();
              }}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play Demo
            </button>
            
            <button 
              onClick={onInfo}
              className="flex items-center gap-2 bg-gray-600/70 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500/70 transition-all duration-300 border border-gray-500 hover:border-white/50 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Details
            </button>

            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800/70 backdrop-blur-sm text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-700/70 transition-all duration-300 border border-gray-600 text-sm"
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
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
    </section>
  );
};

export default ProjectHero;