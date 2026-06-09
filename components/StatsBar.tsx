"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 100, suffix: "%", label: "Tamper-Proof Votes" },
  { prefix: "< ", value: 2, suffix: " min", label: "Average Voting Time" },
  { value: 1000, suffix: "+", label: "Voters Per Election" },
  { value: 0, suffix: "", label: "Central Points of Failure" },
];

function Counter({ value, suffix, prefix = "", label, index }: Stat & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (value === 0) { setCurrent(0); return; }
    const delay = index * 120;
    const timer = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        setCurrent(Math.round(ease * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center gap-3 relative"
    >
      {/* Vertical separator except first */}
      {index > 0 && (
        <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-subtle" />
      )}
      <span className="font-syne font-extrabold text-5xl md:text-6xl text-white tabular-nums">
        {prefix}{current}{suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
    </motion.div>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-surface border-y border-subtle section-padding">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
        {stats.map((s, i) => (
          <Counter key={s.label} {...s} index={i} />
        ))}
      </div>
    </section>
  );
}
