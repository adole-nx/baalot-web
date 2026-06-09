"use client";
import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";
import { EASE } from "@/lib/animations";

// ─── Logos ─────────────────────────────────────────────────────
const logos = [
  "Nile University", "University of Lagos", "Covenant University",
  "ABU Zaria", "OAU Ile-Ife", "UNN Nsukka", "UNILAG",
  "LASU Lagos", "Bayero University", "Delta State Poly",
  "Bowen University", "Caleb University", "Landmark University",
  "Madonna University", "FUTA Akure", "UNIBEN Benin",
];

// ─── Stat counter item ─────────────────────────────────────────
function StatItem({
  target, suffix, label, delay = 0,
}: { target: number; suffix: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { count, start } = useCounter(target, 2200);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(start, delay);
      return () => clearTimeout(t);
    }
  }, [inView, start, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: delay / 1000 }}
      className="flex flex-col items-center text-center px-6"
    >
      <span
        className="font-syne font-bold"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "#9B5DE5",
        }}
      >
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[13px] mt-2" style={{ color: "#64748B" }}>{label}</span>
    </motion.div>
  );
}

// ─── Logo marquee ───────────────────────────────────────────────
function LogoTrack() {
  const doubled = [...logos, ...logos];
  return (
    <div className="overflow-hidden relative">
      {/* Fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #080C10, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #080C10, transparent)" }}
      />
      <div className="flex marquee-track" style={{ width: "max-content" }}>
        {doubled.map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-1.5 mx-2 rounded-full shrink-0"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(155,93,229,0.4)" }}
            />
            <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: "#64748B" }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function TrustStrip() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: "#080C10", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(155,93,229,0.3), transparent)" }}
        aria-hidden="true"
      />

      {/* Logo marquee */}
      <div className="mb-12">
        <p
          className="text-center mb-5 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "#334155" }}
        >
          Trusted by institutions across Africa
        </p>
        <LogoTrack />
      </div>

      {/* Stat counters */}
      <div
        className="flex items-stretch justify-center flex-wrap"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {[
          { target: 200000, suffix: "+", label: "Voters served",       delay: 0 },
          { target: 1200,   suffix: "+", label: "Elections completed",  delay: 150 },
          { target: 0,      suffix: "",  label: "Disputed results",     delay: 300 },
          { target: 99.97,  suffix: "%", label: "Platform uptime",      delay: 450 },
        ].map((s, i) => (
          <div
            key={i}
            className="pt-10"
            style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
          >
            <StatItem
              target={Math.floor(s.target)}
              suffix={s.suffix}
              label={s.label}
              delay={s.delay}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
