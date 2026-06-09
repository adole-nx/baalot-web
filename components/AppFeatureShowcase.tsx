"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle2, Vote, BarChart3, ShieldCheck, Zap } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── BBC Blockchain cube animation ───────────────────────────────────────────
function CubeViz() {
  const cubeColors = [
    ["#9B5DE5", "#B27FF0", "#7B3DC9", "#6B2DB9"],
    ["#14B8A6", "#20D9C5", "#0F9280", "#0A7A6E"],
    ["#B27FF0", "#C99FF8", "#9B5DE5", "#8B4DD5"],
    ["#20D9C5", "#30EDD8", "#14B8A6", "#0EAFAA"],
  ];

  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        style={{ transformStyle: "preserve-3d", transformPerspective: 400 }}
        animate={{ rotateY: [0, 360], rotateX: [10, 25, 10] }}
        transition={{ rotateY: { duration: 8, repeat: Infinity, ease: "linear" }, rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="relative"
      >
        {/* 4×4 grid of tiny cubes */}
        <div className="grid grid-cols-4 gap-0.5" style={{ width: 72 }}>
          {cubeColors.flat().map((color, i) => (
            <motion.div
              key={i}
              style={{
                width: 16, height: 16,
                background: color,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.3)",
                boxShadow: `0 0 6px ${color}55`,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Simulated phone screen content ──────────────────────────────────────────
function ElectionsScreen() {
  const elections = [
    { title: "Law Students Association Elections", date: "2025-02-10", candidates: 4, live: true },
    { title: "Engineering Faculty Elections", date: "2025-02-01", candidates: 6, live: false },
    { title: "SUG 2024/2025 General Elections", date: "2025-01-15", candidates: 12, live: false },
  ];
  return (
    <div className="p-2 space-y-1.5 overflow-hidden h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]">🎓</div>
        <span className="text-[9px] font-bold text-white">NILE</span>
        <span className="text-[7px] ml-auto px-1 py-0.5 rounded-full" style={{ background: "rgba(155,93,229,0.2)", color: "#9B5DE5" }}>Verified</span>
      </div>
      {elections.map((el, i) => (
        <motion.div
          key={i}
          className="rounded-lg p-2"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5, ease: EASE }}
        >
          {el.live && (
            <div className="flex items-center gap-1 mb-1">
              <motion.span
                className="w-1 h-1 rounded-full"
                style={{ background: "#14B8A6" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-[6px] font-bold tracking-wider" style={{ color: "#14B8A6" }}>LIVE</span>
            </div>
          )}
          <p className="text-[7.5px] font-semibold text-white leading-tight mb-0.5">{el.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-[6.5px]" style={{ color: "#334155" }}>{el.candidates} Candidates</span>
            <span className="text-[6.5px]" style={{ color: "#334155" }}>{el.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BlockchainScreen() {
  return (
    <div className="p-2 h-full flex flex-col">
      {/* Search bar */}
      <div className="mb-2 px-2 py-1.5 rounded-lg text-[7px] flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.07)", color: "#334155" }}>
        <svg width="8" height="8" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="5" stroke="#64748B" strokeWidth="2"/><path d="M11 11l3 3" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/></svg>
        Search elections...
      </div>

      {/* News banner */}
      <div className="rounded-lg overflow-hidden mb-2 relative" style={{ height: 60, background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
        <div className="absolute inset-0 flex items-end p-1.5">
          <p className="text-[7px] font-bold text-white leading-tight">Your vote is your voice.</p>
        </div>
        {/* Carousel dots */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[0, 1, 2, 3].map((d) => (
            <div key={d} className="rounded-full" style={{ width: d === 1 ? 8 : 3, height: 3, background: d === 1 ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      {/* BBC Cube card */}
      <div className="rounded-lg p-2 flex-1 flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(155,93,229,0.15)" }}>
        <div className="text-[6px] font-bold tracking-wider mb-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(155,93,229,0.15)", color: "#B27FF0" }}>
          SECURE · TRANSPARENT · FREE
        </div>
        <CubeViz />
        <p className="text-[6.5px] text-center mt-1 leading-tight" style={{ color: "#64748B" }}>
          Every vote anchored on the BBC chain.
        </p>
        <div className="mt-1.5 w-full py-1 rounded-full text-[6.5px] font-bold text-center text-white" style={{ background: "linear-gradient(135deg, #9B5DE5, #14B8A6)" }}>
          Get Started →
        </div>
      </div>
    </div>
  );
}

function ResultsScreen() {
  const bars = [
    { name: "Aisha M.", pct: 78, color: "#9B5DE5" },
    { name: "Emeka O.", pct: 52, color: "#14B8A6" },
    { name: "Fatima B.", pct: 41, color: "#B27FF0" },
  ];

  return (
    <div className="p-2 h-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[8px] font-bold text-white">Live Results</p>
        <div className="flex items-center gap-1">
          <motion.span
            className="w-1 h-1 rounded-full"
            style={{ background: "#14B8A6" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[6px]" style={{ color: "#14B8A6" }}>COUNTING</span>
        </div>
      </div>

      <div className="rounded-lg p-2 mb-2" style={{ background: "rgba(155,93,229,0.06)", border: "1px solid rgba(155,93,229,0.1)" }}>
        <p className="text-[6.5px] mb-0.5" style={{ color: "#64748B" }}>SUG General Elections</p>
        <p className="text-[7px] font-semibold text-white">President</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5">
            <motion.span
              className="font-syne font-bold text-[14px]"
              style={{ color: "#9B5DE5" }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              1,247
            </motion.span>
          </div>
          <span className="text-[6px]" style={{ color: "#334155" }}>votes cast</span>
          <span className="ml-auto text-[6.5px] font-bold" style={{ color: "#14B8A6" }}>34%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {bars.map((b, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[6.5px] text-white">{b.name}</span>
              <span className="text-[6px] font-mono" style={{ color: b.color }}>{b.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: b.color }}
                initial={{ width: 0 }}
                animate={{ width: `${b.pct}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 p-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.15)" }}>
        <ShieldCheck size={8} style={{ color: "#14B8A6" }} />
        <span className="text-[6px]" style={{ color: "#14B8A6" }}>On-chain verified · BBC #4,821,093</span>
      </div>
    </div>
  );
}

// ─── Phone frame ─────────────────────────────────────────────────────────────
interface PhoneProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  screen: React.ReactNode;
  index: number;
  isCenter?: boolean;
}

function PhoneFrame({ title, description, icon, accent, screen, index, isCenter = false }: PhoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 180, damping: 22 });
  const springY = useSpring(ry, { stiffness: 180, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    ry.set(dx * 12);
    rx.set(-dy * 8);
  };
  const handleMouseLeave = () => { rx.set(0); ry.set(0); };

  const yOffsets = [-20, 0, -20];
  const rotateYOffsets = [8, 0, -8];
  const delays = [0.1, 0, 0.1];
  const scales = [0.92, 1, 0.92];

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-5"
      style={{ perspective: 900 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 20 }}
        animate={inView ? {
          opacity: 1,
          y: yOffsets[index] ?? 0,
          rotateX: 0,
          rotateY: rotateYOffsets[index] ?? 0,
          scale: scales[index] ?? 1,
        } : {}}
        transition={{ duration: 0.9, delay: delays[index] ?? 0, ease: EASE }}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-none"
      >
        {/* Glow behind center phone */}
        {isCenter && (
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 120% 80% at 50% 60%, rgba(155,93,229,0.25), transparent 70%)`,
              filter: "blur(24px)",
              transform: "translateY(10%) scale(1.2)",
            }}
          />
        )}

        {/* Phone outer shell */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 156,
            height: 320,
            borderRadius: 28,
            background: isCenter
              ? "linear-gradient(160deg, #1a0f2e, #0d0d1a)"
              : "linear-gradient(160deg, #111118, #080c10)",
            border: isCenter
              ? `1px solid rgba(155,93,229,0.4)`
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: isCenter
              ? "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(155,93,229,0.1) inset, 0 -4px 20px rgba(155,93,229,0.15) inset"
              : "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-3 pt-2 pb-1"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <span className="text-[6.5px] text-white font-medium">4:08</span>
            <div
              className="w-12 h-3 rounded-full"
              style={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <span className="text-[6.5px] text-white font-medium">89%</span>
          </div>

          {/* Screen content */}
          <div className="flex-1 overflow-hidden" style={{ height: "calc(100% - 40px)" }}>
            {screen}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
            <div className="w-10 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          </div>

          {/* Screen sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
              borderRadius: 28,
            }}
          />
        </div>
      </motion.div>

      {/* Caption */}
      <motion.div
        className="text-center max-w-[160px]"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: (delays[index] ?? 0) + 0.25, ease: EASE }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <span style={{ color: accent }}>{icon}</span>
          <span className="text-[11px] font-semibold text-white">{title}</span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "#475569" }}>{description}</p>
      </motion.div>
    </div>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Zap size={14} />,
    title: "One-tap voting",
    desc: "Voters confirm identity once, then cast ballots in a single tap.",
    accent: "#9B5DE5",
  },
  {
    icon: <ShieldCheck size={14} />,
    title: "BBC chain anchored",
    desc: "Each result is an immutable transaction — no server can alter it.",
    accent: "#14B8A6",
  },
  {
    icon: <BarChart3 size={14} />,
    title: "Instant results",
    desc: "Live count updates as votes come in. Zero wait for final tallies.",
    accent: "#B27FF0",
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
export default function AppFeatureShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const phones = [
    {
      title: "Election Hub",
      description: "Browse all active elections at your institution in one feed.",
      icon: <Vote size={14} />,
      accent: "#9B5DE5",
      screen: <ElectionsScreen />,
      isCenter: false,
    },
    {
      title: "BBC Blockchain",
      description: "Every vote anchored on-chain. Transparent and tamper-proof.",
      icon: <CheckCircle2 size={14} />,
      accent: "#14B8A6",
      screen: <BlockchainScreen />,
      isCenter: true,
    },
    {
      title: "Live Results",
      description: "Real-time counts with on-chain verification badge.",
      icon: <BarChart3 size={14} />,
      accent: "#B27FF0",
      screen: <ResultsScreen />,
      isCenter: false,
    },
  ];

  return (
    <section
      id="app-showcase"
      data-levi-stop="1"
      ref={sectionRef}
      className="relative overflow-hidden py-24 px-5 md:px-10 lg:px-16"
      style={{ background: "linear-gradient(180deg, #050810 0%, #080C10 50%, #050810 100%)" }}
    >
      {/* Background glow grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(155,93,229,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,93,229,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(180deg, #050810, transparent)" }} />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: "#9B5DE5" }}
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Mobile App
          </motion.p>
          <motion.h2
            className="font-syne font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            The complete voting experience,
            <br />
            <span style={{ color: "#9B5DE5" }}>on your phone.</span>
          </motion.h2>
          <motion.p
            className="text-[15px] max-w-xl mx-auto"
            style={{ color: "#64748B" }}
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            Voters browse elections, verify identity, cast ballots, and watch
            results arrive in real time — all within a single, secure app.
          </motion.p>
        </div>

        {/* 3 phones */}
        <div
          className="flex items-end justify-center gap-6 md:gap-10 lg:gap-14"
          style={{ perspective: 1200 }}
        >
          {phones.map((phone, i) => (
            <PhoneFrame
              key={phone.title}
              {...phone}
              index={i}
            />
          ))}
        </div>

        {/* Feature row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              whileHover={{ background: "rgba(155,93,229,0.04)", borderColor: "rgba(155,93,229,0.15)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}
              >
                <span style={{ color: f.accent }}>{f.icon}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white mb-1">{f.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "#475569" }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(0deg, #050810, transparent)" }} />
    </section>
  );
}
