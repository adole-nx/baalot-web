"use client";
import { useState, useRef, useCallback } from "react";

/**
 * Animate a number from 0 to `target` over `duration` ms.
 * Call `start()` when the element enters the viewport.
 */
export function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const rafRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;

    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [target, duration]);

  return { count, start };
}
