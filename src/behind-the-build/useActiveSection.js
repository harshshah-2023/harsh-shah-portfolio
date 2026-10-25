import { useEffect, useState } from "react";

/** The section currently under the reading line (a band ~30% down the viewport). */
export default function useActiveSection(keys) {
  const [active, setActive] = useState(keys[0]);
  const joined = keys.join(",");

  useEffect(() => {
    const els = joined
      .split(",")
      .map((k) => document.getElementById(k))
      .filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-28% 0px -62% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [joined, setActive]);

  return active;
}
