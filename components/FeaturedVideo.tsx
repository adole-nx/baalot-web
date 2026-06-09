"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { EASE } from "@/lib/animations";

// Nigeria's Election Process: Experts in Tech, Academia & Law call for e-voting
const VIDEO_ID = "v7inQSORNl4";

export default function FeaturedVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-pad"
      style={{ background: "#030507" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10"
        >
          <p
            className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: "#9B5DE5" }}
          >
            The Bigger Picture
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Africa is ready for credible elections.
          </h2>
          <p className="mt-4 text-[15px] max-w-xl mx-auto" style={{ color: "#64748B" }}>
            Experts in technology, academia, and law are unanimous: the infrastructure for
            trustworthy digital elections exists today. Baalot is that infrastructure.
          </p>
        </motion.div>

        {/* Video embed with glow border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
          className="rounded-2xl p-[1px]"
          style={{
            background: "linear-gradient(135deg, rgba(155,93,229,0.25), rgba(20,184,166,0.12), rgba(255,255,255,0.04))",
            boxShadow: "0 0 80px rgba(155,93,229,0.1), 0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <div className="rounded-[calc(1rem-1px)] overflow-hidden">
            <YouTubeEmbed
              videoId={VIDEO_ID}
              title="Nigeria's Election Process: Experts in Tech, Academia and Law call for E-Voting"
              label="Nigeria's Election Experts on Digital Voting"
              aspectRatio="16/9"
            />
          </div>
        </motion.div>

        {/* Stat strip below video */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { value: "200K+", label: "Votes recorded on-chain" },
            { value: "0",     label: "Disputed results" },
            { value: "< 2wk", label: "From signup to first election" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="font-syne font-bold text-[1.5rem] text-primary leading-none mb-1">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#64748B" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
