"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE, EASE_SPRING, staggerContainer } from "@/lib/animations";
import SectionReveal from "./SectionReveal";

// ─── ZK proof visualization ────────────────────────────────────
function ZKProofViz() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-20" aria-hidden="true">
      {/* Circuit paths */}
      {[
        "M10,40 L30,40 L30,20 L50,20", "M10,40 L30,40 L30,60 L50,60",
        "M50,20 L70,40", "M50,60 L70,40",
        "M70,40 L90,40 L90,20 L110,20",
        "M70,40 L90,40 L90,60 L110,60",
      ].map((d, i) => (
        <path key={i} d={d} stroke="rgba(155,93,229,0.25)" strokeWidth="0.8" fill="none"
          strokeDasharray="3 2"
          style={{ animation: `dash-flow ${1.5 + i * 0.2}s linear infinite`, animationDelay: `${i * 0.15}s` }}
        />
      ))}
      {/* Nodes */}
      {[
        [10,40],[50,20],[50,60],[70,40],[110,20],[110,60],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="rgba(155,93,229,0.1)" stroke="rgba(155,93,229,0.4)" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="1.5" fill="#9B5DE5"
            style={{ animation: `node-pulse 2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
        </g>
      ))}
      {/* Center lock icon */}
      <rect x="62" y="33" width="16" height="14" rx="2" fill="rgba(155,93,229,0.15)" stroke="rgba(155,93,229,0.4)" strokeWidth="0.8" />
      <path d="M66,33 L66,30 A4,4 0 0,1 74,30 L74,33" stroke="rgba(155,93,229,0.4)" strokeWidth="0.8" fill="none" />
      <circle cx="70" cy="40" r="2" fill="#9B5DE5" />
    </svg>
  );
}

// ─── Blockchain node visualization ────────────────────────────
function BlockchainViz() {
  const nodes = [[60,15],[20,45],[100,45],[10,75],[50,75],[70,75],[110,75]];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return (
    <svg viewBox="0 0 120 90" className="w-full h-20" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="rgba(20,184,166,0.25)" strokeWidth="0.8" strokeDasharray="3 2"
          style={{ animation: `dash-flow ${1.8 + i * 0.15}s linear infinite`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.35)" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="1.8" fill="#14B8A6"
            style={{ animation: `node-pulse 2.2s ease-in-out infinite`, animationDelay: `${i * 0.22}s` }} />
        </g>
      ))}
    </svg>
  );
}

// ─── Biometric scan visualization ─────────────────────────────
function BiometricViz() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-20" aria-hidden="true">
      {/* Scan circle */}
      <circle cx="60" cy="40" r="28" fill="none" stroke="rgba(155,93,229,0.1)" strokeWidth="1"
        strokeDasharray="4 3"
        style={{ animation: `iris-spin 8s linear infinite` }}
      />
      <circle cx="60" cy="40" r="20" fill="none" stroke="rgba(155,93,229,0.15)" strokeWidth="0.8" />
      <circle cx="60" cy="40" r="12" fill="rgba(155,93,229,0.06)" stroke="rgba(155,93,229,0.3)" strokeWidth="0.8" />
      {/* Iris lines */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        const x1 = 60 + Math.cos(rad) * 13;
        const y1 = 40 + Math.sin(rad) * 13;
        const x2 = 60 + Math.cos(rad) * 19;
        const y2 = 40 + Math.sin(rad) * 19;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(155,93,229,0.3)" strokeWidth="0.6" />;
      })}
      {/* Pupil */}
      <circle cx="60" cy="40" r="5" fill="rgba(155,93,229,0.15)" stroke="rgba(155,93,229,0.5)" strokeWidth="0.8" />
      <circle cx="60" cy="40" r="2.5" fill="#9B5DE5" />
      {/* Scan line */}
      <line x1="35" y1="40" x2="85" y2="40" stroke="rgba(155,93,229,0.6)" strokeWidth="0.8"
        style={{ animation: `node-pulse 1.5s ease-in-out infinite` }} />
      {/* Highlight */}
      <circle cx="62.5" cy="37.5" r="1" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

// ─── Security pillar card ──────────────────────────────────────
const pillars = [
  {
    title: "Zero-Knowledge Proofs",
    body: "We prove your vote was counted without revealing how you voted. Mathematical certainty, complete privacy. No government, no admin, no one — can link a ballot to its voter.",
    viz: <ZKProofViz />,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.1)",
  },
  {
    title: "Blockchain Immutability",
    body: "Every ballot becomes an immutable on-chain entry. No server administrator can alter results. The ledger is public. The identity is private. That's the design.",
    viz: <BlockchainViz />,
    color: "#14B8A6",
    glow: "rgba(20,184,166,0.08)",
  },
  {
    title: "Biometric Identity",
    body: "NIN verification and optional facial matching ensure one person, one vote — verified at the moment of registration, anonymous at the moment of casting.",
    viz: <BiometricViz />,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.1)",
  },
];

export default function Security() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 px-5 md:px-10 lg:px-16 relative overflow-hidden"
      style={{ background: "var(--bg-void)" }}
    >
      {/* Background beams */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(155,93,229,0.2), transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(155,93,229,0.1), transparent)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <SectionReveal variant="clip-up" className="text-center mb-16">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            Security
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Built to withstand scrutiny.
          </h2>
          <p className="mt-4 text-[15px] max-w-[480px] mx-auto" style={{ color: "#64748B" }}>
            Three independent security layers. Each one would be enough. Together, they&apos;re unprecedented for African election infrastructure.
          </p>
        </SectionReveal>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-5"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
              animate={inView ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
              transition={{ duration: 0.7, ease: EASE_SPRING, delay: i * 0.18 }}
              className="group relative rounded-2xl p-[1px] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 },
              }}
            >
              <div
                className="h-full rounded-[calc(1rem-1px)] p-6 flex flex-col transition-all duration-300 group-hover:bg-[#0D1117]"
                style={{
                  background: "#0A0E15",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Visualization */}
                <div className="mb-4">
                  {pillar.viz}
                </div>

                {/* Content */}
                <h3
                  className="font-syne font-bold text-primary text-[18px] mb-3"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  {pillar.title}
                </h3>
                <p className="text-[13px] leading-relaxed flex-1" style={{ color: "#64748B" }}>
                  {pillar.body}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-px w-full transition-all duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${pillar.color}40, transparent)`,
                    opacity: 0.4,
                  }}
                />
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `0 0 40px ${pillar.glow}` }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom audit CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[13px]" style={{ color: "#64748B" }}>
            Every election comes with a full ZK proof audit report. Your institution can verify every result, independently.{" "}
            <a href="/security" className="underline underline-offset-2 hover:text-primary transition-colors" style={{ color: "#9B5DE5" }}>
              Read the security whitepaper →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
