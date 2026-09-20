"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplitHeading from "./SplitHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

// Screen background colors for reactive glow
const SCREEN_GLOWS = [
  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,110,248,0.12) 0%, transparent 70%)",
  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,197,24,0.10) 0%, transparent 70%)",
  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 70%)",
  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,110,248,0.12) 0%, transparent 70%)",
];

const SCREEN_ACCENT_COLORS = ["#3B6EF8", "#F5C518", "#10B981", "#3B6EF8"];

// ─── Screen 1: Cast Your Vote ─────────────────────────────────────────────────
function VoteScreen({ active }: { active: boolean }) {
  const candidates = [
    // Placeholder ballot. Real institutions are never named in these mockups.
    { initials: "A", color: "#3B6EF8", name: "Candidate A", party: "Sample ticket", selected: true  },
    { initials: "B", color: "#F5C518", name: "Candidate B", party: "Sample ticket", selected: false },
    { initials: "C", color: "#10B981", name: "Candidate C", party: "Sample ticket", selected: false },
  ];
  return (
    <div className="flex flex-col h-full bg-bg text-white px-4 pt-3 pb-4 gap-3">
      <div>
        <p className="font-syne font-bold text-sm">Sample Election</p>
        <p className="text-muted text-[10px]">Presidential Candidates</p>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {candidates.map((c, idx) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -12 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: EASE }}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
              c.selected ? "border-accent/60 bg-accent/10" : "border-border bg-surface"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: `${c.color}20`, color: c.color }}
            >
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">{c.name}</p>
              <p className="text-muted text-[9px] truncate">{c.party}</p>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                c.selected ? "border-accent" : "border-border"
              }`}
            >
              {c.selected && <div className="w-2 h-2 rounded-full bg-accent" />}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        className="w-full py-2.5 rounded-xl bg-accent font-syne font-bold text-xs text-white shadow-[0_0_16px_rgba(59,110,248,0.4)]"
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
        whileHover={{ scale: 1.02 }}
      >
        Cast Vote →
      </motion.button>
      <p className="text-center text-[9px] text-muted">⏱ 2h 34m remaining · 1,247 votes cast</p>
    </div>
  );
}

// ─── Screen 2: Live Results ───────────────────────────────────────────────────
function ResultsScreen({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (active) setMounted(true); }, [active]);

  const bars = [
    { name: "Amara Okafor", pct: 47.3, color: "#3B6EF8" },
    { name: "Dele Adeyemi", pct: 31.2, color: "#F5C518" },
    { name: "Chioma Nwosu", pct: 21.5, color: "#10B981" },
  ];
  return (
    <div className="flex flex-col h-full bg-bg text-white px-4 pt-3 pb-4 gap-4">
      <div>
        <p className="font-syne font-bold text-sm">Live Results</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-muted text-[10px]">Voting is open · updates every 30s</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {bars.map((b, i) => (
          <div key={b.name}>
            <div className="flex justify-between mb-1">
              <p className="text-[10px] text-white/80">{b.name}</p>
              <p className="text-[10px] font-bold tabular-nums" style={{ color: b.color }}>
                {b.pct}%
              </p>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: b.color }}
                initial={{ width: "0%" }}
                animate={mounted && active ? { width: `${b.pct}%` } : { width: "0%" }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-[9px] text-muted text-center">
          Sample data ·{" "}
          <span className="text-green-400">Chain-sealed ✓</span>
        </p>
      </div>
    </div>
  );
}

// ─── Screen 3: Identity Verified ─────────────────────────────────────────────
function IdentityScreen({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col h-full bg-bg text-white px-4 pt-3 pb-4 items-center justify-center gap-4">
      <motion.div
        className="w-16 h-16 rounded-full bg-green-400/10 border-2 border-green-400/40 flex items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <motion.svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="#4ade80" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <motion.polyline
            points="20 6 9 17 4 12"
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
      >
        <p className="font-syne font-bold text-base text-white">Identity Verified</p>
        <p className="text-muted text-[10px] mt-1">NIN ****-****-4821 confirmed</p>
        <p className="text-accent text-xs mt-2 font-semibold">Welcome, Chidi Okafor</p>
        <p className="text-muted text-[10px] mt-1 leading-relaxed">
          You are eligible to vote<br />in 1 active election
        </p>
      </motion.div>

      <motion.button
        className="w-full py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-semibold text-xs"
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, delay: 0.6, ease: EASE }}
      >
        Continue to Ballot →
      </motion.button>
    </div>
  );
}

// ─── Screen 4: Admin Dashboard ────────────────────────────────────────────────
function AdminScreen({ active }: { active: boolean }) {
  const elections = [
    { dot: "bg-green-400", name: "Presidential Election", status: "Live" },
    { dot: "bg-gold",      name: "Faculty Rep Election",  status: "3 days to go" },
    { dot: "bg-accent",    name: "Welfare Officer",       status: "Results published" },
  ];
  return (
    <div className="flex flex-col h-full bg-bg text-white px-4 pt-3 pb-4 gap-3">
      <div>
        <p className="font-syne font-bold text-sm">Dashboard</p>
        <p className="text-muted text-[10px]">Hello, Admin 👋</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[["Elections", "3"], ["Voters", "2,847"], ["Active", "1"]].map(([label, val]) => (
          <motion.div
            key={label}
            className="rounded-lg p-2 text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
          >
            <p className="font-syne font-bold text-white text-sm">{val}</p>
            <p className="text-muted text-[8px]">{label}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <p className="text-[9px] text-muted uppercase tracking-widest mb-0.5">Recent Elections</p>
        {elections.map((e, i) => (
          <motion.div
            key={e.name}
            className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-surface border border-border"
            initial={{ opacity: 0, x: 10 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.07, ease: EASE }}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white truncate">{e.name}</p>
              <p className="text-[9px] text-muted">{e.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        className="w-full py-2 rounded-xl border border-accent/40 text-accent text-xs font-semibold"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        + New Election
      </motion.button>
    </div>
  );
}

// ─── Callout pills ────────────────────────────────────────────────────────────
const screenPills: { side: "left" | "right"; label: string; color: string }[][] = [
  [
    { side: "left",  label: "Anonymous ballots", color: "#3B6EF8" },
    { side: "left",  label: "< 2 min to vote", color: "#F5C518" },
    { side: "left",  label: "Voter receipt",     color: "#10B981" },
  ],
  [
    { side: "right", label: "Live updates",      color: "#3B6EF8" },
    { side: "right", label: "Tamper-proof",       color: "#F5C518" },
    { side: "right", label: "Receipt-verifiable", color: "#10B981" },
  ],
  [
    { side: "left",  label: "NIN/BVN Auth",     color: "#3B6EF8" },
    { side: "left",  label: "Biometric check",  color: "#F5C518" },
    { side: "left",  label: "Single-use token", color: "#10B981" },
  ],
  [
    { side: "right", label: "Multi-election",    color: "#3B6EF8" },
    { side: "right", label: "Role-based access", color: "#F5C518" },
    { side: "right", label: "Audit export",      color: "#10B981" },
  ],
];

function Pills({ side, activeScreen }: { side: "left" | "right"; activeScreen: number }) {
  const pills = screenPills[activeScreen].filter((p) => p.side === side);
  return (
    <div className={`hidden lg:flex flex-col gap-3 ${side === "right" ? "items-start" : "items-end"}`}>
      <AnimatePresence>
        {pills.map((p, i) => (
          <motion.div
            key={`${activeScreen}-${p.label}`}
            initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: side === "left" ? -20 : 20 }}
            transition={{ duration: 0.35, delay: i * 0.1, ease: EASE }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              background: `${p.color}12`,
              border: `1px solid ${p.color}30`,
              color: p.color,
            }}
          >
            {p.label}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Speed-line burst on screen change ───────────────────────────────────────
function SpeedLineBurst({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      <motion.div
        key={trigger}
        className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-[37px]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {[15, 35, 50, 65, 85].map((top, i) => (
          <motion.div
            key={i}
            className="absolute left-0 h-px"
            style={{
              top: `${top}%`,
              background: `linear-gradient(to right, transparent, ${SCREEN_ACCENT_COLORS[trigger % SCREEN_ACCENT_COLORS.length]}80, transparent)`,
            }}
            initial={{ width: "0%", left: "0%" }}
            animate={{ width: "100%", left: "0%" }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
const screens = [VoteScreen, ResultsScreen, IdentityScreen, AdminScreen];
const screenLabels = ["Cast Vote", "Live Results", "ID Verified", "Admin"];

export default function AppShowcase() {
  const [active,    setActive]    = useState(0);
  const [mounted,   setMounted]   = useState(false);
  const [direction, setDirection] = useState(1);
  const [burst,     setBurst]     = useState(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive((prev) => {
        const next = (prev + 1) % screens.length;
        setBurst(next);
        return next;
      });
    }, 4000);
  };

  useEffect(() => {
    if (!mounted) return;
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setBurst(i);
    setActive(i);
    startTimer();
  };

  const ActiveScreen = screens[active];

  return (
    <section className="section-pad bg-bg text-white overflow-hidden">
      <div className="max-w-site mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            className="label-tag mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The App
          </motion.p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white">
            <SplitHeading text="The ballot, in your pocket." />
          </h2>
          <motion.p
            className="text-muted mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From voter registration to chain-sealed results — all in one app built for Africa.
          </motion.p>
        </div>

        {/* Showcase layout */}
        <div className="relative flex items-center justify-center gap-10 lg:gap-16">
          {/* Reactive radial glow — color-shifts per active screen */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ background: SCREEN_GLOWS[active] }}
            transition={{ duration: 0.8 }}
          />

          <Pills side="left" activeScreen={active} />

          {/* Phone frame */}
          <motion.div
            className="relative flex-shrink-0 animate-phone-float"
            style={{ width: 280, height: 580 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* Outer frame */}
            <motion.div
              className="absolute inset-0 rounded-[40px]"
              animate={{
                boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 40px ${SCREEN_ACCENT_COLORS[active]}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
              transition={{ duration: 0.8 }}
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(255,255,255,0.12)",
              }}
            />

            {/* Notch */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-bg"
              style={{ width: 80, height: 28, borderRadius: "0 0 20px 20px" }}
            />

            {/* Screen area */}
            <div className="absolute inset-[3px] rounded-[37px] overflow-hidden bg-bg z-10">
              {/* Speed-line burst */}
              <SpeedLineBurst trigger={burst} />

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[9px] text-muted">
                <span>●●●</span>
                <span className="font-semibold">9:41</span>
                <span>▮▮▮</span>
              </div>

              {/* Screen content */}
              <div className="relative overflow-hidden" style={{ height: "calc(100% - 24px)" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={active}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 40 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <ActiveScreen active={true} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <Pills side="right" activeScreen={active} />
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex items-center justify-center"
              aria-label={screenLabels[i]}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: active === i ? 24 : 8,
                  height: 8,
                  background: active === i ? SCREEN_ACCENT_COLORS[i] : "rgba(255,255,255,0.2)",
                }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </button>
          ))}
        </div>

        {/* Screen label */}
        <div className="text-center mt-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="text-xs text-muted"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {screenLabels[active]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
