"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import SplitHeading from "./SplitHeading";

// ── Data ──────────────────────────────────────────────────────────────────────
// Illustration only. This section used to present the same numbers as a real
// "NUESA Presidential Election - SUG 2025", complete with an Ethereum Sepolia
// block number and a ZK proof count. No such election ran, and Baalot does not
// anchor to a public chain. Everything below is placeholder data shown to
// demonstrate the results screen, and it is labelled as such on the card.
const CANDIDATES = [
  { name: "Candidate A", pct: 47.3, color: "#3B6EF8", party: "Sample ticket", initials: "A" },
  { name: "Candidate B", pct: 31.2, color: "#F5C518", party: "Sample ticket", initials: "B" },
  { name: "Candidate C", pct: 21.5, color: "#10B981", party: "Sample ticket", initials: "C" },
];

const ELIGIBLE  = 2400;
const CAST      = 2311;
const TURNOUT   = ((CAST / ELIGIBLE) * 100).toFixed(1);
const TOTAL_PCT = CANDIDATES.reduce((s, c) => s + c.pct, 0); // should be 100

// ── SVG arc helpers ───────────────────────────────────────────────────────────
const CX      = 110;
const CY      = 110;
const R_OUTER = 88;
const R_INNER = 58;
const GAP     = 2.5; // degrees between segments

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number, cy: number,
  rOuter: number, rInner: number,
  startDeg: number, endDeg: number
): string {
  const o1 = polarToXY(cx, cy, rOuter, startDeg);
  const o2 = polarToXY(cx, cy, rOuter, endDeg);
  const i1 = polarToXY(cx, cy, rInner, endDeg);
  const i2 = polarToXY(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

// Precompute arc paths
const arcs = (() => {
  let cursor = 0;
  return CANDIDATES.map((c) => {
    const span  = (c.pct / TOTAL_PCT) * 360 - GAP;
    const start = cursor + GAP / 2;
    const end   = start + span;
    cursor += (c.pct / TOTAL_PCT) * 360;
    return { ...c, start, end, path: describeArc(CX, CY, R_OUTER, R_INNER, start, end) };
  });
})();

// ── Mini sparkline — mock weekly vote accumulation ────────────────────────────
const SPARKLINE_POINTS = [0, 14, 28, 52, 71, 85, 91, 96.3];

function Sparkline() {
  const w = 260;
  const h = 48;
  const pts = SPARKLINE_POINTS.map((v, i) => ({
    x: (i / (SPARKLINE_POINTS.length - 1)) * w,
    y: h - (v / 100) * h,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fill = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="w-full">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3B6EF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3B6EF8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sparkGrad)" />
      <path d={d} stroke="#3B6EF8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => i === pts.length - 1 && (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3B6EF8" />
      ))}
    </svg>
  );
}

// ── Blockchain hash ticker ────────────────────────────────────────────────────
// Sample ballot-chain digests, not blockchain transactions.
const HASHES = [
  "0x8f3a...d219",
  "0x1c4e...a87f",
  "0x55b2...3ef0",
  "0x9d0a...c341",
];

function HashTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HASHES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.span
      key={idx}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="font-mono text-[11px] text-accent"
    >
      {HASHES[idx]}
    </motion.span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ElectionResultsGraph() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="results" className="section-pad bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="label-tag mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Live Results
          </motion.p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white">
            <SplitHeading text="Democracy, Verified" />
          </h2>
          <motion.p
            className="text-muted mt-4 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Every ballot is sealed into Baalot&apos;s hash chain as it is cast, and every
            voter keeps a receipt they can check against it. Sample data shown.
          </motion.p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface border border-border rounded-3xl overflow-hidden"
        >
          {/* Card header bar */}
          <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-semibold uppercase tracking-wider">Demo</span>
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="text-xs text-muted">Sample election · illustration only</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Chain:</span>
              <HashTicker />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: donut chart */}
            <div className="flex flex-col items-center justify-center py-12 px-8 border-r border-border">
              <div className="relative" style={{ width: 220, height: 220 }}>
                <svg
                  width="220" height="220"
                  viewBox="0 0 220 220"
                  style={{ overflow: "visible" }}
                >
                  {/* Background ring */}
                  <circle
                    cx={CX} cy={CY} r={(R_OUTER + R_INNER) / 2}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={R_OUTER - R_INNER}
                  />

                  {/* Arcs */}
                  {arcs.map((arc, i) => (
                    <motion.path
                      key={arc.name}
                      d={arc.path}
                      fill={hovered === i ? arc.color : `${arc.color}cc`}
                      stroke={arc.color}
                      strokeWidth="0.5"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        transformOrigin: `${CX}px ${CY}px`,
                        filter: hovered === i
                          ? `drop-shadow(0 0 8px ${arc.color}88)`
                          : "none",
                        transition: "filter 0.2s, fill 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}

                  {/* Center text */}
                  <text x={CX} y={CY - 10} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Syne, sans-serif">
                    {TURNOUT}%
                  </text>
                  <text x={CX} y={CY + 10} textAnchor="middle" fill="#6B7280" fontSize="10">
                    Turnout
                  </text>
                  <text x={CX} y={CY + 26} textAnchor="middle" fill="#6B7280" fontSize="9">
                    {CAST.toLocaleString()} / {ELIGIBLE.toLocaleString()}
                  </text>
                </svg>
              </div>

              {/* Sparkline below donut */}
              <div className="mt-6 w-full max-w-[260px]">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Vote accumulation</p>
                <Sparkline />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-muted">Day 1</span>
                  <span className="text-[9px] text-muted">Day 7</span>
                </div>
              </div>
            </div>

            {/* Right: legend + bars */}
            <div className="py-12 px-8 md:px-10 flex flex-col justify-center gap-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted uppercase tracking-widest">Candidates</p>
                <p className="text-xs text-muted">% of votes</p>
              </div>

              {arcs.map((arc, i) => (
                <motion.div
                  key={arc.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${arc.color}20`, color: arc.color }}
                    >
                      {arc.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold font-syne truncate">{arc.name}</p>
                        <span className="font-syne font-extrabold text-lg tabular-nums ml-2" style={{ color: arc.color }}>
                          {arc.pct}%
                        </span>
                      </div>
                      <p className="text-muted text-[11px]">{arc.party}</p>
                    </div>
                  </div>

                  {/* Animated progress bar */}
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${arc.color}99, ${arc.color})` }}
                      initial={{ width: "0%" }}
                      animate={inView ? { width: `${arc.pct}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  {/* Vote count */}
                  <p className="text-[10px] text-muted mt-1">
                    {Math.round((arc.pct / 100) * CAST).toLocaleString()} votes
                  </p>
                </motion.div>
              ))}

              {/* Footer row */}
              <div className="pt-4 border-t border-border grid grid-cols-3 gap-4">
                {[
                  { label: "Eligible", val: ELIGIBLE.toLocaleString() },
                  { label: "Cast",     val: CAST.toLocaleString() },
                  { label: "Turnout",  val: `${TURNOUT}%` },
                ].map((f) => (
                  <div key={f.label} className="text-center">
                    <p className="font-syne font-bold text-white text-lg">{f.val}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">{f.label}</p>
                  </div>
                ))}
              </div>

              {/* On-chain badge */}
              <div className="flex items-center gap-2 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <p className="text-green-400 text-xs font-semibold">
                  Every ballot sealed into the Baalot ballot chain as it is cast
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom row — secondary stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Ballots chained",              val: "Every one",  color: "#3B6EF8" },
            { label: "Receipts issued",              val: "1 per vote", color: "#10B981" },
            { label: "Votes per verified identity",  val: "1",          color: "#F5C518" },
            { label: "Admins who can read a ballot", val: "0",          color: "#EF4444" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.08 }}
              className="bg-surface border border-border rounded-2xl px-5 py-4 text-center hover:border-white/20 transition-colors"
            >
              <p className="font-syne font-extrabold text-2xl" style={{ color: s.color }}>{s.val}</p>
              <p className="text-muted text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
