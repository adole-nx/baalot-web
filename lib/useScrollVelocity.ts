"use client";

import { useScroll, useVelocity, useTransform } from "framer-motion";

/** Returns a motion value clamped to [-1, 1] based on scroll velocity. */
export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  return useTransform(velocity, [-3000, 0, 3000], [-1, 0, 1]);
}
