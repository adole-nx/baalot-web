"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import NetworkCanvas from "./NetworkCanvas";

// ─── Character-by-character kinetic heading ───────────────────────────────────
interface KineticProps {
  text: string;
  className?: string;
  baseDelay?: number;
  triggerOnMount?: boolean;
  accentLastWord?: boolean;
}

function KineticHeading({ text, className = "", baseDelay = 0, triggerOnMount = false, accentLastWord = false }: KineticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldAnimate = triggerOnMount ? true : inView;

  // respect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const words = text.split(" ");

  let charIndex = 0;
  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.22em] ${className}`}>
      {words.map((word, wi) => {
        const isLast = wi === words.length - 1;
        const chars = word.split("");
        return (
          <span key={wi} className={`inline-flex ${accentLastWord && isLast ? "text-accent" : ""}`}>
            {chars.map((ch) => {
              const ci = charIndex++;
              return (
                <span key={ci} className="overflow-hidden inline-block leading-tight">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={shouldAnimate ? { y: "0%", opacity: 1 } : {}}
                    transition={
                      reducedMotion
                        ? { duration: 0.01 }
                        : { type: "spring", stiffness: 200, damping: 20, delay: ci * 0.03 + baseDelay }
                    }
                  >
                    {ch}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

// ─── Floating orb ────────────────────────────────────────────────────────────
interface OrbProps {
  color: string;
  opacity: number;
  size: number;
  blur: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animClass: string;
}
function Orb({ color, opacity, size, blur, top, bottom, left, right, animClass }: OrbProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none rounded-full z-[1] ${animClass}`}
      style={{
        width: size,
        height: size,
        background: color,
        opacity,
        filter: `blur(${blur}px)`,
        top, bottom, left, right,
      }}
    />
  );
}

// ─── Glass stat strip ─────────────────────────────────────────────────────────
// Verifiable facts only. Baalot has run no customer elections yet, so there are
// no vote totals, timing averages or incident counts to put here.
const heroStats = [
  { value: "AES-256", label: "Ballot Encryption" },
  { value: "SHA-256", label: "Audit Chain" },
  { value: "3",    label: "Platforms" },
  { value: "1",    label: "Vote Per Identity" },
];

export default function PlatformHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg">
      {/* Background layers */}
      <NetworkCanvas />
      <Orb color="#3B6EF8" opacity={0.12} size={600} blur={120} top="-200px" left="-100px" animClass="animate-float-a" />
      <Orb color="#F5C518" opacity={0.08} size={500} blur={140} top="200px"  right="-150px" animClass="animate-float-b" />
      <Orb color="#7C3AED" opacity={0.09} size={400} blur={100} bottom="-100px" left="30%" animClass="animate-float-c" />

      {/* Top glow overlay */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-[2]"
        style={{ background: "radial-gradient(ellipse at top, rgba(59,110,248,0.14) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-site mx-auto px-5 md:px-10 pt-36 pb-24 w-full">
        <motion.p
          className="label-tag mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Platform · Built for Africa
        </motion.p>

        {/* Kinetic H1 */}
        <h1
          className="font-syne font-extrabold leading-[0.9] tracking-tight text-white mb-6"
          style={{ fontSize: "clamp(52px,8.5vw,92px)" }}
        >
          <div className="mb-[0.08em]">
            <KineticHeading text="Elections That" baseDelay={0.1} triggerOnMount />
          </div>
          <div>
            <KineticHeading text="Prove Themselves." baseDelay={0.5} triggerOnMount accentLastWord />
          </div>
        </h1>

        {/* Subheading */}
        <motion.p
          className="text-muted text-lg md:text-xl leading-relaxed max-w-[560px] mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          Baalot gives African institutions encrypted, server-verified, tamper-evident elections —
          live as soon as your voter list is ready, usable on any device.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
        >
          <Link
            href="/contact"
            className="group relative inline-flex items-center px-7 py-3.5 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Request a Demo</span>
          </Link>
          <Link
            href="#bento"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 font-semibold text-sm hover:border-white/50 hover:bg-white/5 transition-all duration-200"
          >
            Explore Features →
          </Link>
        </motion.div>

        {/* Glassmorphism stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
            }}
          >
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-syne font-extrabold text-3xl md:text-4xl text-white">{s.value}</p>
                <p className="text-xs text-muted mt-1 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
