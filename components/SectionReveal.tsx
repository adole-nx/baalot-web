"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Variant = "clip-up" | "clip-left" | "clip-right" | "blur" | "scale" | "up" | "left" | "right";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  duration?: number;
  once?: boolean;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const buildInitial = (variant: Variant) => {
  switch (variant) {
    case "clip-up":    return { clipPath: "inset(100% 0% 0% 0%)",   opacity: 0 };
    case "clip-left":  return { clipPath: "inset(0% 100% 0% 0%)",   opacity: 0 };
    case "clip-right": return { clipPath: "inset(0% 0% 0% 100%)",   opacity: 0 };
    case "blur":       return { filter: "blur(14px)", opacity: 0, scale: 0.97 };
    case "scale":      return { opacity: 0, scale: 0.92, y: 20 };
    case "up":         return { opacity: 0, y: 40 };
    case "left":       return { opacity: 0, x: -50 };
    case "right":      return { opacity: 0, x: 50 };
  }
};

const buildAnimate = (variant: Variant) => {
  switch (variant) {
    case "clip-up":
    case "clip-left":
    case "clip-right": return { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 };
    case "blur":       return { filter: "blur(0px)", opacity: 1, scale: 1 };
    case "scale":      return { opacity: 1, scale: 1, y: 0 };
    case "up":         return { opacity: 1, y: 0 };
    case "left":
    case "right":      return { opacity: 1, x: 0 };
  }
};

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  duration = 0.75,
  once = true,
}: SectionRevealProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={buildInitial(variant)}
      animate={inView ? buildAnimate(variant) : buildInitial(variant)}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
