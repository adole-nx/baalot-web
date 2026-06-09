"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Shield, Link as LinkIcon, LayoutDashboard } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";
import { EASE, EASE_SPRING } from "@/lib/animations";

const panels = [
  {
    tag: "VOTE",
    headline: "One-tap voting.\nNo compromise.",
    body: "Voters authenticate with NIN or student ID, cast their ballot in under 30 seconds, and receive a cryptographic receipt — all from any device, anywhere on the continent.",
    icon: Shield,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.12)",
    dir: "left" as const,
    visual: <VoteVisual />,
  },
  {
    tag: "VERIFY",
    headline: "Every vote is a\nblockchain entry.",
    body: "Each ballot is hashed, timestamped, and written to an immutable smart contract. Anyone can audit the result. No administrator can alter it.",
    icon: LinkIcon,
    color: "#14B8A6",
    glow: "rgba(20,184,166,0.12)",
    dir: "right" as const,
    visual: <ChainVisual />,
  },
  {
    tag: "MANAGE",
    headline: "Election command\ncenter. Live.",
    body: "Real-time turnout analytics, candidate dashboards, anomaly alerts, and one-click result certification — everything in a single control room your team actually wants to use.",
    icon: LayoutDashboard,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.12)",
    dir: "left" as const,
    visual: <DashboardVisual />,
  },
];

// ─── Visual: phone vote flow ───────────────────────────────────
function VoteVisual() {
  return (
    <div
      className="rounded-2xl p-4 w-full h-full min-h-[260px] flex flex-col justify-between"
      style={{ background: "#070B10", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-amber-500 live-dot" />
        <span className="font-mono text-[10px]" style={{ color: "#9B5DE5" }}>ELECTION LIVE</span>
      </div>
      {["Chukwuemeka Obi", "Adaeze Nwosu", "Babatunde Lawal"].map((name, i) => (
        <div
          key={name}
          className="flex items-center gap-3 p-2.5 rounded-lg mb-2"
          style={{
            background: i === 0 ? "rgba(155,93,229,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === 0 ? "rgba(155,93,229,0.2)" : "rgba(255,255,255,0.04)"}`,
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
            style={{ borderColor: i === 0 ? "#9B5DE5" : "rgba(255,255,255,0.15)" }}
          >
            {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium" style={{ color: i === 0 ? "#F0F4F8" : "#64748B" }}>{name}</p>
            <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: i === 0 ? "#9B5DE5" : i === 1 ? "#14B8A6" : "#6366F1" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${[42, 35, 23][i]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </div>
          <span className="font-mono text-[10px]" style={{ color: i === 0 ? "#9B5DE5" : "#334155" }}>
            {[42, 35, 23][i]}%
          </span>
        </div>
      ))}
      <button
        className="w-full mt-2 py-2 rounded-lg font-semibold text-[11px]"
        style={{ background: "linear-gradient(135deg, #9B5DE5, #B27FF0)", color: "#FFFFFF" }}
      >
        Cast Encrypted Vote ↗
      </button>
    </div>
  );
}

// ─── Visual: blockchain nodes ──────────────────────────────────
function ChainVisual() {
  const nodes = [
    { x: 50, y: 30 }, { x: 25, y: 60 }, { x: 75, y: 60 },
    { x: 12, y: 90 }, { x: 50, y: 90 }, { x: 88, y: 90 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5]];

  return (
    <div
      className="rounded-2xl p-4 w-full min-h-[260px] flex flex-col"
      style={{ background: "#070B10", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-teal-500 live-dot" />
        <span className="font-mono text-[10px]" style={{ color: "#14B8A6" }}>IMMUTABLE LEDGER</span>
      </div>
      <div className="flex-1 relative">
        <svg viewBox="0 0 100 100" className="w-full h-36">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke="rgba(20,184,166,0.25)"
              strokeWidth="0.8"
              strokeDasharray="3 2"
              style={{ animation: `dash-flow 2s linear infinite`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="5" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.4)" strokeWidth="0.8" />
              <circle cx={n.x} cy={n.y} r="2.5" fill="#14B8A6" style={{ animation: `node-pulse 2s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }} />
            </g>
          ))}
        </svg>
      </div>
      <div className="space-y-1.5 mt-2">
        {["0x4a9f...3b21 ✓ Block #19,204,731", "0x8f2a...c194 ✓ Block #19,204,730"].map((line, i) => (
          <p key={i} className="font-mono text-[9px]" style={{ color: "#14B8A6" }}>{line}</p>
        ))}
        <p className="font-mono text-[9px]" style={{ color: "#334155" }}>ZK proof: VALID — 2,801 ballots verified</p>
      </div>
    </div>
  );
}

// ─── Visual: dashboard UI ──────────────────────────────────────
function DashboardVisual() {
  const bars = [32, 48, 61, 55, 72, 68, 79, 85, 80, 91, 88, 95];
  return (
    <div
      className="rounded-2xl p-4 w-full min-h-[260px]"
      style={{ background: "#070B10", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px]" style={{ color: "#9B5DE5" }}>LIVE TURNOUT</span>
        <span className="font-mono text-[10px]" style={{ color: "#334155" }}>42.9% · 2,801 voters</span>
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-1 h-20">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ background: i === bars.length - 1 ? "#9B5DE5" : "rgba(155,93,229,0.25)" }}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
          />
        ))}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Turnout", value: "42.9%" },
          { label: "Votes/min", value: "124" },
          { label: "Anomalies", value: "0" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="font-mono text-[14px] font-semibold" style={{ color: "#F0F4F8" }}>{s.value}</p>
            <p className="text-[9px]" style={{ color: "#334155" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tilt card wrapper ─────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const { rotateX, rotateY, handleMouse, reset } = useTilt(6);
  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="perspective-[1000px]"
    >
      {children}
    </motion.div>
  );
}

// ─── Single panel ──────────────────────────────────────────────
function Panel({ panel }: { panel: typeof panels[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = panel.dir === "left";
  const Icon = panel.icon;

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${isLeft ? "" : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"}`}
    >
      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Tag */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[10px] font-bold tracking-[0.15em] uppercase"
          style={{
            background: `${panel.color}12`,
            border: `1px solid ${panel.color}25`,
            color: panel.color,
          }}
        >
          <Icon size={11} />
          {panel.tag}
        </div>

        {/* Headline */}
        <h2
          className="font-syne font-bold text-primary mb-5"
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            whiteSpace: "pre-line",
          }}
        >
          {panel.headline}
        </h2>

        <p className="text-[15px] leading-relaxed max-w-[480px]" style={{ color: "#64748B" }}>
          {panel.body}
        </p>

        <button
          className="mt-7 inline-flex items-center gap-2 font-semibold text-[13px] transition-colors"
          style={{ color: panel.color }}
        >
          Learn more <ArrowUpRight size={14} />
        </button>
      </motion.div>

      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_SPRING, delay: 0.15 }}
      >
        <TiltCard>
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: `linear-gradient(135deg, ${panel.color}20, rgba(255,255,255,0.04))`,
              boxShadow: `0 0 60px ${panel.glow}`,
            }}
          >
            <div className="rounded-[calc(1rem-1px)] overflow-hidden">
              {panel.visual}
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function SolutionSection() {
  return (
    <section
      id="solution"
      className="py-24 px-5 md:px-10 lg:px-16"
      style={{ background: "#080C10" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-syne font-bold text-primary"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Three pillars. One platform.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="mt-4 text-[15px]"
            style={{ color: "#64748B" }}
          >
            Every election, from ballot design to certified results.
          </motion.p>
        </div>

        <div className="space-y-28 lg:space-y-36">
          {panels.map((panel) => (
            <Panel key={panel.tag} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
