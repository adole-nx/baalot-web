"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const frames = [
  {
    word: "Fraud.",
    color: "#EF4444",
    body: "Contested student and community elections are routine across Nigeria — disputed counts, missing ballots, no audit trail anyone can check. Paper trails don’t scale. People lose faith.",
    gradient: "radial-gradient(ellipse at 50% 80%, rgba(239,68,68,0.06) 0%, transparent 70%)",
  },
  {
    word: "Paper.",
    color: "#9B5DE5",
    body: "Manual ballots can be stolen, stuffed, or simply lost. Democracy deserves better infrastructure than a cardboard box and a biro.",
    gradient: "radial-gradient(ellipse at 50% 80%, rgba(155,93,229,0.06) 0%, transparent 70%)",
  },
  {
    word: "Exclusion.",
    color: "#64748B",
    body: "Voters who can't be physically present are silenced. Remote voting shouldn't be a privilege reserved for those with transport money.",
    gradient: "radial-gradient(ellipse at 50% 80%, rgba(100,116,139,0.06) 0%, transparent 70%)",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Which frame is active (0–2), plus a final state (3)
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Get snapped integer frame
  const f0Opacity = useTransform(scrollYProgress, [0, 0.22, 0.28], [0, 1, 0]);
  const f0Y       = useTransform(scrollYProgress, [0, 0.22, 0.28], [20, 0, -20]);
  const f1Opacity = useTransform(scrollYProgress, [0.22, 0.45, 0.52], [0, 1, 0]);
  const f1Y       = useTransform(scrollYProgress, [0.22, 0.45, 0.52], [20, 0, -20]);
  const f2Opacity = useTransform(scrollYProgress, [0.5, 0.7, 0.78], [0, 1, 0]);
  const f2Y       = useTransform(scrollYProgress, [0.5, 0.7, 0.78], [20, 0, -20]);
  const allWordOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const conclusionOpacity = useTransform(scrollYProgress, [0.88, 1], [0, 1]);
  const conclusionY = useTransform(scrollYProgress, [0.88, 1], [20, 0]);

  // Per-frame gradient opacity
  const bg0 = useTransform(scrollYProgress, [0, 0.22, 0.28], [0, 1, 0]);
  const bg1 = useTransform(scrollYProgress, [0.22, 0.45, 0.52], [0, 1, 0]);
  const bg2 = useTransform(scrollYProgress, [0.5, 0.7, 0.78], [0, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh", background: "var(--bg-void)" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient backgrounds per frame */}
        {frames.map((f, i) => {
          const opacity = [bg0, bg1, bg2][i];
          return (
            <motion.div
              key={i}
              className="absolute inset-0 pointer-events-none"
              style={{ background: f.gradient, opacity }}
              aria-hidden="true"
            />
          );
        })}

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        {/* Frame 0: Fraud */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: f0Opacity, y: f0Y }}
          aria-hidden
        >
          <FrameContent frame={frames[0]} />
        </motion.div>

        {/* Frame 1: Paper */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: f1Opacity, y: f1Y }}
          aria-hidden
        >
          <FrameContent frame={frames[1]} />
        </motion.div>

        {/* Frame 2: Exclusion */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: f2Opacity, y: f2Y }}
          aria-hidden
        >
          <FrameContent frame={frames[2]} />
        </motion.div>

        {/* Frame 3: All three + conclusion */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: allWordOpacity }}
        >
          <motion.div
            className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 mb-8"
            style={{ opacity: allWordOpacity }}
          >
            {frames.map((f) => (
              <span
                key={f.word}
                className="font-syne font-bold"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 6rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: f.color,
                }}
              >
                {f.word}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="font-syne font-bold text-primary"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 3.5rem)",
              letterSpacing: "-0.025em",
              opacity: conclusionOpacity,
              y: conclusionY,
            }}
          >
            Baalot ends all three.
          </motion.p>

          <motion.div style={{ opacity: ctaOpacity, y: conclusionY }}>
            <Link
              href="#solution"
              className="mt-8 inline-flex items-center gap-2 text-amber-500 font-semibold text-[15px] hover:text-amber-400 transition-colors"
            >
              See how →
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom counter — shows current scroll section */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[bg0, bg1, bg2].map((op, i) => (
            <motion.div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300"
              style={{
                width: 24,
                background: "#9B5DE5",
                opacity: op,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FrameContent({ frame }: { frame: (typeof frames)[0] }) {
  return (
    <>
      <p
        className="font-syne font-bold mb-6"
        style={{
          fontSize: "clamp(4rem, 14vw, 11rem)",
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          color: frame.color,
        }}
      >
        {frame.word}
      </p>
      <p
        className="max-w-[560px] text-[16px] leading-relaxed"
        style={{ color: "#64748B" }}
      >
        {frame.body}
      </p>
    </>
  );
}
