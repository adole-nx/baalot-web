"use client";
import { useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";

/**
 * 3D tilt effect for product cards and showcases.
 * Usage: attach handleMouse to onMouseMove, reset to onMouseLeave,
 * then apply rotateX/rotateY on the element with `style={{ perspective: 1000 }}` on parent.
 */
export function useTilt(maxTilt = 8) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.6 });

  const handleMouse = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-cy * maxTilt);
    rotateY.set(cx * maxTilt);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { rotateX: springX, rotateY: springY, handleMouse, reset };
}
