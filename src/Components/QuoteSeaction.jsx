
const QuoteSeaction = () => {
    return (
        <div className="bg-ink-850 border-y border-white/[0.06] flex items-center justify-center h-96 px-6">
        <div className="text-center max-w-measure">
          <p className="text-mist-200 italic text-lg md:text-xl font-light">
            &ldquo;Great software isn&rsquo;t built with lines of code, it&rsquo;s built with lines of thought.
            The way we think shapes what we create and what we create shapes the world.&rdquo;
          </p>
          <div className="my-8 flex justify-center">
            <span className="inline-block w-8 h-px bg-accent-500"></span>
          </div>
          <p className="text-mist-400 font-medium text-xs uppercase tracking-[0.18em]">
            Harsh Shah
          </p>
        </div>
      </div>
      );
}

export default QuoteSeaction
