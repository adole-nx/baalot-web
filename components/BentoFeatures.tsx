"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  type MotionStyle,
} from "framer-motion";
import {
  Fingerprint,
  Smartphone,
  Rocket,
  FileCheck,
  BarChart2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import SplitHeading from "./SplitHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── 3-D tilt hook ────────────────────────────────────────────────────────────
function useTilt(maxDeg = 14) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 260, damping: 24 });
  const springY = useSpring(ry, { stiffness: 260, damping: 24 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    ry.set(dx * maxDeg);
    rx.set(-dy * maxDeg);
  };
  const onMouseLeave = () => { rx.set(0); ry.set(0); };

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

// ─── Glass card wrapper ───────────────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  tilt?: boolean;
}

function GlassCard({ children, className = "", index = 0, tilt = true }: GlassCardProps) {
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt();

  const tiltStyle: MotionStyle = tilt
    ? {
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }
    : {};

  return (
    <motion.div
      className={`${className} group relative`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
    >
      <motion.div
        ref={tilt ? ref : undefined}
        className="relative w-full h-full p-6 rounded-[20px] overflow-hidden"
        style={tiltStyle}
        onMouseMove={tilt ? onMouseMove : undefined}
        onMouseLeave={tilt ? onMouseLeave : undefined}
        data-cursor="true"
      >
        {/* Glass background */}
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            border: "1px solid rgba(155,93,229,0.45)",
            boxShadow: "0 0 40px 0 rgba(155,93,229,0.12)",
          }}
        />
        {/* Radial light leak */}
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
          style={{
            background: "radial-gradient(circle at top right, rgba(155,93,229,0.10), transparent 70%)",
            mixBlendMode: "overlay",
          }}
        />
        {/* Content */}
        <div className="relative z-10 h-full" style={{ transform: "translateZ(0)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── BBC ballot-chain cube (CSS isometric) ─────────────────────────────────────
function BBCCube() {
  return (
    <div className="relative w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
      style={{ transform: "translateZ(32px)" }}
    >
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d", width: 64, height: 64, position: "relative" }}
      >
        {/* Front face */}
        <div style={{
          position: "absolute", width: 64, height: 64,
          background: "linear-gradient(135deg, #9B5DE5, #14B8A6)",
          border: "1px solid rgba(255,255,255,0.15)",
          transform: "translateZ(32px)",
          borderRadius: 4,
          opacity: 0.9,
        }} />
        {/* Right face */}
        <div style={{
          position: "absolute", width: 32, height: 64,
          background: "linear-gradient(135deg, #7B3DC9, #0F9280)",
          border: "1px solid rgba(255,255,255,0.08)",
          transform: "rotateY(90deg) translateZ(32px)",
          right: 0, borderRadius: 4,
          opacity: 0.75,
        }} />
        {/* Top face */}
        <div style={{
          position: "absolute", width: 64, height: 32,
          background: "linear-gradient(135deg, #B27FF0, #20D9C5)",
          border: "1px solid rgba(255,255,255,0.12)",
          transform: "rotateX(90deg) translateZ(32px)",
          top: 0, borderRadius: 4,
          opacity: 0.85,
        }} />
      </motion.div>
    </div>
  );
}

// ─── Animated chain links ─────────────────────────────────────────────────────
function ChainDecoration() {
  return (
    <div className="absolute bottom-5 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <svg height="24" width="100%" viewBox="0 0 300 24" fill="none">
        {[0, 60, 120, 180, 240].map((x, i) => (
          <g key={x}>
            <rect
              x={x + 2} y={6} width={52} height={12} rx={6}
              stroke="rgba(155,93,229,0.7)" strokeWidth={1.5}
            />
            {i < 4 && (
              <line
                x1={x + 54} y1={12} x2={x + 62} y2={12}
                stroke="rgba(155,93,229,0.4)" strokeWidth={1.5}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Cipher ring ─────────────────────────────────────────────────────────────
function CipherRing() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
      <motion.svg
        viewBox="0 0 144 144" fill="none"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={72} cy={72} r={64} stroke="rgba(155,93,229,0.7)" strokeWidth={1} strokeDasharray="4 8" />
        <circle cx={72} cy={72} r={50} stroke="rgba(20,184,166,0.4)" strokeWidth={1} strokeDasharray="2 6" />
      </motion.svg>
    </div>
  );
}

// ─── Live vote bars ───────────────────────────────────────────────────────────
function LiveBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const bars = [
    { h: 72, label: "Candidate A", color: "#9B5DE5" },
    { h: 48, label: "Candidate B", color: "#14B8A6" },
    { h: 88, label: "Candidate C", color: "#B27FF0" },
    { h: 55, label: "Candidate D", color: "#7B3DC9" },
  ];

  return (
    <div ref={ref} className="flex items-end gap-2 h-24 mt-4">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            className="w-full rounded-t-md relative overflow-hidden"
            style={{ background: b.color, minHeight: 4 }}
            initial={{ height: 0 }}
            animate={mounted && inView ? { height: b.h * 0.7 } : { height: 0 }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: EASE }}
          >
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)" }}
            />
          </motion.div>
          <span className="text-[8px] font-mono" style={{ color: "#334155" }}>
            {Math.round([62, 41, 78, 48][i])}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Deploy progress bar ──────────────────────────────────────────────────────
function DeployProgress() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="mt-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px]" style={{ color: "#334155" }}>Election setup</span>
        <span className="text-[10px] font-mono" style={{ color: "#9B5DE5" }}>
          {hovered ? "85%" : "0%"}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #9B5DE5, #14B8A6)" }}
          initial={{ width: "0%" }}
          animate={{ width: hovered ? "85%" : "0%" }}
          transition={{ duration: 1, ease: EASE }}
        />
      </div>
      <p className="text-[10px] mt-1" style={{ color: "#334155" }}>Hover to simulate deploy</p>
    </div>
  );
}

// ─── Audit log lines ──────────────────────────────────────────────────────────
function AuditLogs() {
  const logs = [
    "vote:0x8f3a…d2c1 recorded",
    "block #4,821,093 confirmed",
    "audit hash: 0xa4b7…",
  ];
  return (
    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 space-y-1">
      {logs.map((l, i) => (
        <motion.code
          key={l}
          className="block text-[9px] font-mono px-2 py-0.5 rounded"
          style={{ background: "rgba(155,93,229,0.06)", color: "#64748B", border: "1px solid rgba(155,93,229,0.1)" }}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          {l}
        </motion.code>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BentoFeatures() {
  return (
    <section id="bento" data-levi-stop="2" className="section-pad bg-bg overflow-hidden">
      <div className="max-w-site mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            className="label-tag mb-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Platform Features
          </motion.p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white">
            <SplitHeading text="Everything a fair election needs." />
          </h2>
        </div>

        {/* Bento grid */}
        <div
          className="grid grid-cols-4 lg:grid-cols-12 gap-4"
          style={{ gridAutoRows: "minmax(220px, auto)" }}
        >
          {/* Card A — Chain-sealed results (large hero card) */}
          <GlassCard className="col-span-4 lg:col-span-8 row-span-1 lg:row-span-2" index={0}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(155,93,229,0.2)" }}>
                    <ShieldCheck size={16} style={{ color: "#9B5DE5" }} />
                  </div>
                  <span className="label-tag text-accent">Core Feature</span>
                </div>
                {/* Live pulse indicator */}
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#14B8A6" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-mono" style={{ color: "#14B8A6" }}>LIVE</span>
                </div>
              </div>

              <h3
                className="font-syne font-bold text-2xl md:text-3xl text-white mb-3 leading-tight"
                style={{ transform: "translateZ(20px)" }}
              >
                Chain-Sealed<br />Results
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748B", transform: "translateZ(10px)" }}>
                Every ballot is sealed into a hash chain in the same transaction
                that records it. Results are final the moment voting closes, and
                every voter keeps a receipt they can check against the chain.
              </p>

              {/* Animated badge row */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(155,93,229,0.12)", color: "#9B5DE5", border: "1px solid rgba(155,93,229,0.2)" }}
                >
                  BBC Chain
                </span>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(20,184,166,0.08)", color: "#14B8A6", border: "1px solid rgba(20,184,166,0.15)" }}
                >
                  Voter Receipts
                </span>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#334155", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  Tamper-Evident
                </span>
              </div>

              {/* Floating cube on hover */}
              <div className="absolute bottom-6 right-6 pointer-events-none">
                <BBCCube />
              </div>

              <ChainDecoration />
            </div>
            {/* Ghost number */}
            <span className="absolute bottom-4 right-6 font-syne font-extrabold text-[120px] leading-none pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.02)" }}>01</span>
          </GlassCard>

          {/* Card B — Anonymous ballots */}
          <GlassCard className="col-span-4 row-span-1 lg:row-span-2" index={1}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(178,127,240,0.15)" }}>
                  <Lock size={16} style={{ color: "#B27FF0" }} />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#B27FF0" }}>Privacy</span>
              </div>
              <h3 className="font-syne font-bold text-xl text-white mb-3 leading-tight">
                Anonymous By Design
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748B" }}>
                Ballots are stored unreadable and unlinked from the voter. Your
                identity is verified before you vote, never alongside it — not even
                Baalot can see who you voted for.
              </p>

              {/* Animated privacy ring */}
              <div className="relative flex items-center justify-center mt-6 h-16">
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 56, height: 56, border: "1px solid rgba(155,93,229,0.25)" }}
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 40, height: 40, border: "1px solid rgba(155,93,229,0.35)" }}
                  animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                />
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                  style={{ background: "rgba(155,93,229,0.15)", border: "1px solid rgba(155,93,229,0.3)" }}
                >
                  <Lock size={18} style={{ color: "#9B5DE5" }} />
                </div>
              </div>
              <CipherRing />
            </div>
          </GlassCard>

          {/* Card C — NIN/BVN */}
          <GlassCard className="col-span-2 lg:col-span-4" index={2}>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 8, z: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-block mb-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Fingerprint size={32} className="text-amber-500" />
            </motion.div>
            <h3 className="font-syne font-bold text-white mb-2">NIN / BVN Verification</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              Nigeria&apos;s national identity infrastructure built right in — no external SSO needed.
            </p>
          </GlassCard>

          {/* Card D — USSD */}
          <GlassCard className="col-span-2 lg:col-span-4" index={3}>
            <motion.div
              whileHover={{ scale: 1.1, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block mb-3"
            >
              <Smartphone size={32} className="text-accent" />
            </motion.div>
            <h3 className="font-syne font-bold text-white mb-2">USSD Fallback</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              No smartphone required. Vote via *384# — every eligible voter in Nigeria can participate.
            </p>
          </GlassCard>

          {/* Card E — Deploy */}
          <GlassCard className="col-span-2 lg:col-span-4" index={4}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block mb-3"
            >
              <Rocket size={32} className="text-amber-500" />
            </motion.div>
            <h3 className="font-syne font-bold text-white mb-2">&lt; 2 Week Deployment</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              From first call to live election in under 14 days — for any institution size.
            </p>
            <DeployProgress />
          </GlassCard>

          {/* Card F — Audit Trail */}
          <GlassCard className="col-span-2 lg:col-span-4" index={5}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block mb-3"
            >
              <FileCheck size={32} className="text-accent" />
            </motion.div>
            <h3 className="font-syne font-bold text-white mb-2">100% Audit Trail</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              Every action is logged and sealed into the chain. Export a full PDF report for any observer.
            </p>
            <AuditLogs />
          </GlassCard>

          {/* Card G — Live Results */}
          <GlassCard className="col-span-4" index={6}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-block mb-3"
                >
                  <BarChart2 size={32} className="text-green-400" />
                </motion.div>
                <h3 className="font-syne font-bold text-white mb-2">Live Results Dashboard</h3>
                <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#64748B" }}>
                  Real-time vote tallying visible to all stakeholders — with a chain-verification badge.
                </p>
              </div>
              <div className="shrink-0 w-32">
                <LiveBars />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
