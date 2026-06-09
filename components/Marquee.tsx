"use client";

import { useRef, useEffect } from "react";

interface MarqueeProps {
  items: string[];
  speed?: number; // px per second
  className?: string;
  separator?: string;
}

export default function Marquee({
  items,
  speed = 60,
  className = "",
  separator = "·",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const xRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    if (!track) return;

    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      xRef.current -= speed * dt;
      // reset when first half scrolled out
      const half = track.scrollWidth / 2;
      if (Math.abs(xRef.current) >= half) xRef.current = 0;
      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  // duplicate items so the loop is seamless
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-4">
            <span className="font-syne font-bold text-sm uppercase tracking-[0.15em] text-muted">
              {item}
            </span>
            <span className="text-blue opacity-50">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
