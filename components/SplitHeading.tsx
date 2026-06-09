"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface SplitHeadingProps {
  text: string;
  className?: string;
  /** delay before first word starts (seconds) */
  delay?: number;
  /** animate on mount (hero) vs scroll into view */
  mode?: "mount" | "scroll";
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.75,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function SplitHeading({
  text,
  className = "",
  delay = 0,
  mode = "scroll",
}: SplitHeadingProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const animate = mode === "mount" ? true : inView;

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block leading-tight">
          <motion.span
            className="inline-block"
            variants={wordVariants}
            custom={i + delay / 0.07}
            initial="hidden"
            animate={animate ? "show" : "hidden"}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
