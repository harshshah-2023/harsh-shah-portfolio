import React from 'react'

const QuoteSeaction = () => {
    return (
        <div className="bg-[#1a1a1a] flex items-center justify-center h-96 px-4">
        <div className="text-center max-w-2xl">
          <p className="text-gray-100 italic text-base md:text-lg leading-relaxed">
            “Great software isn’t built with lines of code, it’s built with lines of thought. 
            The way we think shapes what we create and what we create shapes the world.”
          </p>
          <div className="my-6 flex justify-center">
            <span className="inline-block w-6 h-[2px] bg-red-500"></span>
          </div>
          <p className="text-white font-semibold text-sm tracking-wide">
            Harsh Shah
          </p>
        </div>
      </div>
      );
}

export default QuoteSeaction