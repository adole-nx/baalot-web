"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface EyeProps {
  id: string;
  size: number;
  pupilSize: number;
  offset: { x: number; y: number };
  intro: boolean;
}

function Eye({ size, pupilSize, offset, intro }: EyeProps) {
  const max = (size - pupilSize) / 2 - 1;
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  return (
    <span
      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/8 relative overflow-hidden flex-shrink-0"
      style={{ width: size, height: size, verticalAlign: "middle" }}
    >
      <span
        className={`pupil absolute rounded-full bg-accent flex-shrink-0${intro ? " logo-intro" : ""}`}
        style={{
          width: pupilSize,
          height: pupilSize,
          transform: `translate(${clamp(offset.x)}px, ${clamp(offset.y)}px)`,
          transition: intro ? "none" : "transform 0.1s ease-out",
        }}
      />
    </span>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const cfg = {
  sm: { font: "text-xl",   eye: 11, pupil: 4 },
  md: { font: "text-2xl",  eye: 13, pupil: 4.5 },
  lg: { font: "text-4xl",  eye: 18, pupil: 6 },
};

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const c = cfg[size];
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [intro, setIntro] = useState(true);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (intro) return;
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      const factor = Math.min(dist / maxDist, 1) * 2.5;
      setOffset({ x: (dx / (dist || 1)) * factor, y: (dy / (dist || 1)) * factor });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [intro]);

  const inner = (
    <span
      ref={wrapRef}
      className={`inline-flex items-center gap-0 font-syne font-extrabold tracking-tight select-none ${c.font} ${className}`}
    >
      B
      <Eye id="e1" size={c.eye} pupilSize={c.pupil} offset={offset} intro={intro} />
      <Eye id="e2" size={c.eye} pupilSize={c.pupil} offset={offset} intro={intro} />
      lot
    </span>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
