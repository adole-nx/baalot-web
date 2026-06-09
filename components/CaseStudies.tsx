"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const cases = [
  {
    tags: ["#Blockchain Voting", "#University Election", "#Mobile"],
    title: "NUESA Nile University — Nigeria's First Blockchain Student Election",
    client: "Nile University NUESA · Abuja, Nigeria",
    stack: ["React", "Solidity", "Ethereum", "Firebase"],
    timeline: "2 weeks setup, 1 day election",
    results: ["847 votes recorded", "99.9% on-chain", "Zero disputes", "Results in 4 min"],
    accent: "#3B6EF8",
    chartData: [
      { candidate: "Candidate A", pct: 47, color: "#3B6EF8" },
      { candidate: "Candidate B", pct: 31, color: "#6B7280" },
      { candidate: "Candidate C", pct: 22, color: "#4B5563" },
    ],
    turnout: 84,
    totalVoters: "1,008",
  },
  {
    tags: ["#Voter Verification", "#Large Scale", "#Audit Trail"],
    title: "Federal Polytechnic Bida SUG — 2,400 Students, Zero Chaos",
    client: "Fed Poly Bida · Niger State, Nigeria",
    stack: ["Next.js", "Node.js", "ZK Proofs", "PostgreSQL"],
    timeline: "3 weeks setup",
    results: ["2,400 registered voters", "91.2% turnout", "Full audit log", "No contested results"],
    accent: "#F5C518",
    chartData: [
      { candidate: "Candidate A", pct: 54, color: "#F5C518" },
      { candidate: "Candidate B", pct: 28, color: "#6B7280" },
      { candidate: "Candidate C", pct: 18, color: "#4B5563" },
    ],
    turnout: 91,
    totalVoters: "2,400",
  },
  {
    tags: ["#Professional Body", "#Anonymity", "#Remote Voting"],
    title: "CFA Nigeria — Secure Online Ballot for 800 Members",
    client: "CFA Society Nigeria · Lagos, Nigeria",
    stack: ["React", "Firebase", "Blockchain"],
    timeline: "1 week setup",
    results: ["800 members verified", "6 cities covered", "Results in 60s", "Zero disputes"],
    accent: "#10B981",
    chartData: [
      { candidate: "Candidate A", pct: 62, color: "#10B981" },
      { candidate: "Candidate B", pct: 38, color: "#6B7280" },
    ],
    turnout: 77,
    totalVoters: "800",
  },
];

// ── Mini horizontal bar chart ──────────────────────────────────────────────────
function ResultChart({
  data,
  active,
}: {
  data: typeof cases[0]["chartData"];
  active: boolean;
}) {
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.candidate} className="flex items-center gap-2">
          <span className="text-[9px] text-muted w-16 flex-shrink-0 truncate">{d.candidate}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={{ width: 0 }}
              animate={active ? { width: `${d.pct}%` } : { width: 0 }}
              transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: EASE }}
            />
          </div>
          <motion.span
            className="text-[10px] font-semibold w-8 flex-shrink-0 text-right"
            style={{ color: d.color }}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          >
            {d.pct}%
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// ── Turnout donut ──────────────────────────────────────────────────────────────
function TurnoutDonut({ pct, color, active, totalVoters }: {
  pct: number; color: string; active: boolean; totalVoters: string;
}) {
  const R = 16; const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <svg width={40} height={40}>
          <circle cx={20} cy={20} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3.5} />
          <circle cx={20} cy={20} r={R} fill="none"
            stroke={color} strokeWidth={3.5} strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={active ? C * (1 - pct / 100) : C}
            style={{
              transition: active ? "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s" : "none",
              transformOrigin: "20px 20px", transform: "rotate(-90deg)"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-syne font-bold text-[9px] text-white">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-white/70">Voter turnout</p>
        <p className="text-[9px] text-muted">{totalVoters} registered</p>
      </div>
    </div>
  );
}

// ── Single case card ───────────────────────────────────────────────────────────
function CaseCard({ c, index }: { c: typeof cases[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      className="group bg-ink border border-ink rounded-2xl overflow-hidden hover:border-white/10 transition-colors duration-300 flex flex-col"
    >
      {/* Cover / gradient header */}
      <div
        className="h-36 relative overflow-hidden flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${c.accent}20 0%, #080A12 100%)` }}
      >
        {/* Animated background bars hinting at a chart */}
        <div className="absolute inset-0 flex items-end px-5 pb-4 gap-1.5">
          {c.chartData.map((d, i) => (
            <motion.div
              key={d.candidate}
              className="flex-1 rounded-t-sm opacity-30"
              style={{ background: d.color }}
              initial={{ height: 0 }}
              animate={inView ? { height: `${d.pct * 0.6}%` } : { height: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
          {c.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-bg/60 backdrop-blur-sm text-muted border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-syne font-bold text-white text-sm leading-snug mb-1">{c.title}</h3>
          <p className="text-[11px] text-muted">{c.client}</p>
        </div>

        {/* Result chart */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
          <p className="text-[9px] uppercase tracking-widest text-muted mb-2.5">Election results</p>
          <ResultChart data={c.chartData} active={inView} />
        </div>

        {/* Turnout + timeline */}
        <div className="flex items-center justify-between gap-4">
          <TurnoutDonut pct={c.turnout} color={c.accent} active={inView} totalVoters={c.totalVoters} />
          <div className="text-right">
            <p className="text-[9px] text-muted">Setup time</p>
            <p className="text-xs font-semibold text-white/80">{c.timeline}</p>
          </div>
        </div>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5">
          {c.stack.map((s) => (
            <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-subtle border border-border text-muted">
              {s}
            </span>
          ))}
        </div>

        {/* Results list */}
        <ul className="space-y-1 flex-1 border-t border-border pt-3">
          {c.results.map((r) => (
            <li key={r} className="text-xs text-white/60 flex items-center gap-2">
              <span style={{ color: c.accent }}>✓</span> {r}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-xs font-semibold transition-colors flex items-center gap-1"
          style={{ color: c.accent }}
        >
          Explore case study →
        </a>
      </div>
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function CaseStudies() {
  return (
    <section id="case-studies" className="section-pad bg-paper border-b border-light-border">
      <div className="max-w-site mx-auto">
        <div className="mb-14">
          <motion.p
            className="label-tag-ink mb-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Case Studies
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-4xl md:text-5xl text-ink mb-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Real elections. Real results.
          </motion.h2>
          <motion.p
            className="text-muted max-w-lg"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Every metric you see below is on-chain verifiable.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cases.map((c, i) => (
            <CaseCard key={c.client} c={c} index={i} />
          ))}
        </div>

        {/* Featured quote */}
        <motion.blockquote
          className="bg-ink border border-white/[0.06] rounded-2xl p-8 md:p-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xl md:text-2xl font-syne text-white/80 leading-relaxed mb-6">
            &ldquo;Baalot gave our election instant credibility. Students who never trusted the process before were checking the blockchain themselves.&rdquo;
          </p>
          <footer className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
              NP
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">NUESA President</p>
              <p className="text-muted text-xs">Nile University, Abuja</p>
            </div>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
