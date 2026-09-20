"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Sparkline data (normalised 0–1) — shows upward growth trend ──────────────
const sparkData = [0.18, 0.25, 0.22, 0.38, 0.34, 0.51, 0.49, 0.63, 0.71, 0.68, 0.82, 1.0];

function Sparkline({ color = "#3B6EF8", animated }: { color?: string; animated: boolean }) {
  const W = 72; const H = 28;
  const pts = sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * W},${H - v * H}`).join(" ");
  const totalLen = 180; // approximate polyline length

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      {/* Area fill */}
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={animated ? 0 : totalLen}
        style={{ transition: animated ? "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" : "none" }}
      />
    </svg>
  );
}

// ── Radial progress ────────────────────────────────────────────
function RadialProgress({ pct, color, animated }: { pct: number; color: string; animated: boolean }) {
  const R = 20; const C = 2 * Math.PI * R;
  return (
    <svg width={52} height={52} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
      <circle
        cx="26" cy="26" r={R} fill="none"
        stroke={color} strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={animated ? C * (1 - pct / 100) : C}
        style={{ transition: animated ? "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s" : "none", transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
    </svg>
  );
}

// ── Mini bar chart (for avg time comparison) ──────────────────────────────────
function MiniBarChart({ animated }: { animated: boolean }) {
  const bars = [
    { label: "Before", pct: 78, color: "#4B5563" },
    { label: "Baalot", pct: 19, color: "#3B6EF8" },
  ];
  return (
    <div className="flex items-end gap-1.5 h-7">
      {bars.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-0.5">
          <motion.div
            className="w-5 rounded-sm"
            style={{ background: b.color, height: animated ? `${b.pct * 0.28}px` : "0px" }}
            animate={{ height: animated ? `${b.pct * 0.28}px` : "0px" }}
            transition={{ duration: 1.2, ease: EASE, delay: b.label === "Baalot" ? 0.2 : 0 }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Shield pulse (for 0 disputes) ─────────────────────────────────────────────
function ShieldIcon({ animated }: { animated: boolean }) {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border border-green-400/30"
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    </div>
  );
}

// ── Counter hook ───────────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, delay = 0) {
  const [val, setVal] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted || !active || target === 0) return;
    const id = setTimeout(() => {
      const dur = 1500;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - t, 4)) * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(id);
  }, [mounted, active, target, delay]);
  return mounted ? val : 0;
}

// ── Stat cards ─────────────────────────────────────────────────────────────────
function StatCard({
  index, active,
}: {
  index: number;
  active: boolean;
}) {
  const configs = [
    // Verifiable facts only. Baalot has run no customer elections yet, so there
    // are no vote totals, timing averages or incident counts to show here.
    {
      value:    110,
      display:  (v: number) => `${v}`,
      suffix:   "+",
      label:    "institutions in the directory",
      sublabel: "joinable from the app today",
      sublabelColor: "text-muted",
      viz:      <Sparkline animated={active} />,
    },
    {
      value:    28,
      display:  (v: number) => `${v}`,
      suffix:   "",
      label:    "Nigerian states covered",
      sublabel: "across the listed institutions",
      sublabelColor: "text-muted",
      viz:      <RadialProgress pct={78} color="#3B6EF8" animated={active} />,
    },
    {
      value:    3,
      display:  () => "3",
      suffix:   "",
      label:    "platforms",
      sublabel: "Android, iOS and web",
      sublabelColor: "text-muted",
      viz:      <MiniBarChart animated={active} />,
    },
    {
      value:    1,
      display:  () => "1",
      suffix:   "",
      label:    "vote per verified identity",
      sublabel: "enforced server-side",
      sublabelColor: "text-muted",
      viz:      <ShieldIcon animated={active} />,
    },
  ];

  const cfg = configs[index];
  const counted = useCounter(cfg.value, active, index * 140);
  const display = cfg.display(counted);

  return (
    <motion.div
      className="flex flex-col gap-3 px-6 py-5 relative"
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
    >
      {/* Vertical divider (not on first) */}
      {index > 0 && (
        <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-px bg-light-border" />
      )}

      {/* Top row: number + mini-viz */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-0.5">
          <span className="font-syne font-extrabold text-3xl md:text-4xl text-ink leading-none">
            {display}
          </span>
          <span className="font-syne font-bold text-xl text-ink/70">{cfg.suffix}</span>
        </div>
        <div className="flex-shrink-0 pb-0.5">{cfg.viz}</div>
      </div>

      {/* Label */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-2">{cfg.label}</p>
        <p className={`text-[11px] mt-0.5 ${cfg.sublabelColor}`}>{cfg.sublabel}</p>
      </div>
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function IntroStats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-paper section-pad border-b border-light-border">
      <div className="max-w-site mx-auto">

        {/* Statement */}
        <motion.p
          className="font-syne font-bold text-2xl md:text-4xl text-ink text-center max-w-4xl mx-auto leading-[1.15] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          We work with institutions that have outgrown paper ballots — and need one platform to run
          transparent, auditable elections end to end.
        </motion.p>

        {/* The "Trusted by" logo row that used to sit here named Nile University,
            Fed Poly Bida and Google for Startups. None of them is a Baalot
            customer or partner, so the row is gone rather than re-labelled. */}

        {/* Stats grid */}
        <div className="bg-paper-2 border border-light-border rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <StatCard key={i} index={i} active={inView} />
            ))}
          </div>

          {/* The live vote-accumulation strip that used to sit here plotted an
              invented "NUESA 2024" election. It returns when a real election has
              run and its own curve can be plotted. */}
        </div>

        {/* Caption */}
        <motion.p
          className="text-center text-xs text-muted"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Institution directory figures, current as of this build.
        </motion.p>

      </div>
    </section>
  );
}
