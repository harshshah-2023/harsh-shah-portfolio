// src/Components/ProjectModal/ProjectModal.jsx
import { useEffect, useRef } from 'react';
import { FaPlay, FaTimes, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white z-10"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        
        {/* Hero section */}
        <div className="relative h-64 w-full">
          <img 
            src={project.poster} 
            alt={project.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <div className="flex space-x-4 mb-4">
              <span className="text-green-500 font-semibold">98% Match</span>
              <span>{project.year}</span>
              <span className="border px-1 text-xs">HD</span>
              <span>{project.duration}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="flex space-x-4 mb-6">
            <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80 transition">
              <FaPlay className="mr-2" />
              Play
            </button>
            
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 text-white px-6 py-2 rounded flex items-center hover:bg-gray-600 transition"
              >
                <FaGithub className="mr-2" />
                View Code
              </a>
            )}
            
            <button className="bg-gray-700 text-white px-6 py-2 rounded flex items-center hover:bg-gray-600 transition">
              <FaExternalLinkAlt className="mr-2" />
              Live Demo
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-lg">{project.longDescription}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Technologies:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400">Year:</p>
                <p>{project.year}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Responsive design for all devices</li>
              <li>User authentication system</li>
              <li>Real-time data updates</li>
              <li>Comprehensive documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;