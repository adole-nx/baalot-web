"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export type CaseStudy = {
  tags: string[];
  title: string;
  client: string;
  stack: string[];
  timeline: string;
  results: string[];
  accent: string;
  chartData: { candidate: string; pct: number; color: string }[];
  turnout: number;
  totalVoters: string;
};

// Deliberately empty.
//
// This section used to carry three case studies that never happened - invented
// vote counts, turnout figures and "zero disputes" claims attributed to Nile
// University NUESA, Federal Polytechnic Bida SUG and CFA Society Nigeria, none
// of which have run an election on Baalot. It also carried a testimonial signed
// by a named real office holder who never said it.
//
// The card, chart and turnout components below are real and stay. Add an entry
// here only when an institution has actually run an election on Baalot AND has
// agreed in writing to be named, with numbers taken from that election's own
// results - not estimated, not rounded up. Until then the section renders
// nothing.
const cases: CaseStudy[] = [];

// ── Mini horizontal bar chart ──────────────────────────────────────────────────
function ResultChart({
  data,
  active,
}: {
  data: CaseStudy["chartData"];
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
function CaseCard({ c, index }: { c: CaseStudy; index: number }) {
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
  // No real case studies yet - render nothing rather than invent them.
  if (cases.length === 0) return null;

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
            Elections run on Baalot.
          </motion.h2>
          <motion.p
            className="text-muted max-w-lg"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Published with each institution&apos;s permission. Every figure comes from
            that election&apos;s own results, and every voter in it holds a receipt they
            can check against the ballot chain.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={c.client} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
