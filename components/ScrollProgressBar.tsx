"use client";

import { useEffect } from "react";

/**
 * Injects a thin purple→teal gradient bar at the very top of the viewport
 * that fills as the user scrolls down the page.
 */
export default function ScrollProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? scrolled / max : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div id="scroll-progress" aria-hidden="true" />;
}
