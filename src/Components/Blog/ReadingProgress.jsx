import { useEffect, useRef } from "react";

/**
 * Thin progress bar pinned to the top of the viewport, measuring how far the
 * reader is through `targetRef`. Updates are rAF-throttled and write a
 * transform directly, so scrolling never re-renders React.
 */
export default function ReadingProgress({ targetRef, contentKey }) {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const target = targetRef.current;
      const bar = barRef.current;
      if (!target || !bar) return;
      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable));
      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [targetRef, contentKey]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-accent-500 to-accent-300"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
