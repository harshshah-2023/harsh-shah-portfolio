import { useState, useEffect } from 'react';

const PortfolioSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Full Stack Developer",
      subtitle: "Building Digital Experiences",
      description: "Specialized in React, Node.js, and modern web technologies that transform ideas into reality",
      emoji: "🚀",
      cta: "VIEW PROJECTS",
      accentColor: "rgb(70,135,145)",
      image: "👨‍💻"
    },
    {
      id: 2,
      title: "UI/UX Enthusiast",
      subtitle: "Creating Beautiful Interfaces",
      description: "Passionate about user-centered design and smooth, intuitive interactions",
      emoji: "🎨",
      cta: "SEE DESIGNS",
      accentColor: "rgb(70,135,145)",
      image: "✨"
    },
    {
      id: 3,
      title: "Problem Solver",
      subtitle: "Clean & Efficient Code",
      description: "Turning complex challenges into elegant, scalable solutions",
      emoji: "💡",
      cta: "CASE STUDIES",
      accentColor: "rgb(70,135,145)",
      image: "⚡"
    },
    {
      id: 4,
      title: "Team Collaborator",
      subtitle: "Agile Development",
      description: "Thriving in collaborative environments to deliver exceptional results",
      emoji: "🤝",
      cta: "ABOUT ME",
      accentColor: "rgb(70,135,145)",
      image: "🌟"
    }
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl group mt-10">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-xl animate-blob"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Content Grid */}
            <div className="relative z-10 h-full flex items-center justify-between text-white px-8 md:px-16">
              {/* Text Content */}
              <div className="flex-1 max-w-2xl">
                <div className="text-6xl mb-6 animate-bounce">
                  {slide.emoji}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white">
                  {slide.title}
                </h1>
                
                <h2 className="text-xl md:text-2xl mb-6 font-serif font-light text-[rgb(70,135,145)]">
                  {slide.subtitle}
                </h2>
                
                <p className="text-lg md:text-xl mb-8 font-extralight leading-relaxed text-gray-300 max-w-3xl">
                  {slide.description}
                </p>
                
                <button 
                  className="mt-5 p-3 px-8 border border-[rgb(70,135,145)] rounded-full font-sans hover:bg-[rgb(70,135,145)] font-medium transition duration-300 ease-in-out text-lg hover:scale-105 transform"
                  style={{ color: 'white' }}
                >
                  {slide.cta}
                </button>
              </div>

              {/* Visual Element */}
              <div className="hidden lg:flex flex-1 justify-center items-center">
                <div className="text-8xl opacity-80 transform hover:scale-110 transition duration-500">
                  {slide.image}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-[rgb(70,135,145)]/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 opacity-0 md:opacity-100 border border-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-[rgb(70,135,145)]/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 opacity-0 md:opacity-100 border border-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border border-gray-400 ${
              index === currentSlide 
                ? 'bg-[rgb(70,135,145)] scale-125' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
        <div 
          className="h-full bg-[rgb(70,135,145)] transition-all duration-6000 ease-linear"
          style={{ 
            width: `${(currentSlide + 1) * (100 / slides.length)}%`
          }}
        />
      </div>
    </div>
  );
};

export default PortfolioSlider;