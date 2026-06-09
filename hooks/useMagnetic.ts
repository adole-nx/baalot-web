"use client";
import { useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";

/**
 * Magnetic cursor attraction for CTA buttons.
 * Usage: attach handleMouse to onMouseMove, reset to onMouseLeave,
 * then use springX/springY as motion values on the element's x/y.
 */
export function useMagnetic(strength = 0.35) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 280, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 280, damping: 25, mass: 0.5 });

  const handleMouse = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2) * strength;
    const cy = (e.clientY - rect.top - rect.height / 2) * strength;
    x.set(cx);
    y.set(cy);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { x: springX, y: springY, handleMouse, reset };
}
