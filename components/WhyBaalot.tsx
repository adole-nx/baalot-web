"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const reasons = [
  {
    icon: "🔐",
    title: "Blockchain-Verified Results",
    desc: "Every vote is immutably stored on Ethereum. No admin can alter results — the ledger is public, permanent, and cryptographically auditable.",
    stat: "99.9%", statLabel: "tamper-proof"
  },
  {
    icon: "🕵️",
    title: "Voter Anonymity by Default",
    desc: "Zero-Knowledge Proofs let voters prove eligibility without revealing identity. Privacy is cryptographic, not a promise.",
    stat: "0", statLabel: "identity leaks"
  },
  {
    icon: "🌍",
    title: "Built for African Context",
    desc: "NIN/BVN integration, low-bandwidth support, Nigerian infrastructure — designed from the ground up, not force-fitted.",
    stat: "6", statLabel: "countries served"
  },
  {
    icon: "⚡",
    title: "Fast to Deploy",
    desc: "Run your first election in under 2 weeks. No IT team. No integrations. Self-serve, guided, and built for non-technical admins.",
    stat: "~14", statLabel: "days to launch"
  },
];

// ── Comparison bar chart ───────────────────────────────────────────────────────
const comparisons = [
  { metric: "Voter turnout",          before: 52, after: 89, unit: "%" },
  { metric: "Time to publish results", before: 92, after: 4,  unit: "% of 72h" },
  { metric: "Audit trail coverage",   before: 8,  after: 99.9, unit: "%" },
  { metric: "Dispute rate",           before: 41, after: 0.3, unit: "%" },
];

function ComparisonBar({ metric, before, after, unit, index, active }: typeof comparisons[0] & { index: number; active: boolean }) {
  const maxVal = Math.max(before, after, 100);
  const beforePct = (before / maxVal) * 100;
  const afterPct  = (after  / maxVal) * 100;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, x: 20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: EASE }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{metric}</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-muted/60 line-through">{before}{unit}</span>
          <span className="text-accent font-semibold">{after}{unit}</span>
        </div>
      </div>
      <div className="space-y-1">
        {/* Before bar */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted/50 w-10 text-right flex-shrink-0">Before</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white/20"
              initial={{ width: 0 }}
              animate={active ? { width: `${beforePct}%` } : { width: 0 }}
              transition={{ duration: 1.0, delay: 0.3 + index * 0.1, ease: EASE }}
            />
          </div>
        </div>
        {/* After bar */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-accent/60 w-10 text-right flex-shrink-0">Baalot</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={active ? { width: `${afterPct}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: EASE }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Uptime gauge ──────────────────────────────────────────────────────────────
function UptimeRing({ active }: { active: boolean }) {
  const R = 36; const C = 2 * Math.PI * R;
  const pct = 99.97;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={88} height={88}>
          <circle cx={44} cy={44} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
          <circle cx={44} cy={44} r={R} fill="none"
            stroke="#3B6EF8" strokeWidth={5} strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={active ? C * (1 - pct / 100) : C}
            style={{
              transition: active ? "stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1) 0.4s" : "none",
              transformOrigin: "44px 44px", transform: "rotate(-90deg)"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-syne font-bold text-lg text-white leading-none">99.97</span>
          <span className="text-[9px] text-muted">% uptime</span>
        </div>
      </div>
      <p className="text-[10px] text-muted text-center">SLA guaranteed</p>
    </div>
  );
}

// ── Blockchain speed viz ──────────────────────────────────────────────────────
function BlockchainSpeed({ active }: { active: boolean }) {
  const steps = ["Submit", "ZK Proof", "Blockchain", "Confirmed"];
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
            initial={{ scale: 0 }}
            animate={active ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.3 + i * 0.25, duration: 0.3, ease: "easeOut" }}
          />
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `rgba(59,110,248,${0.4 + i * 0.15})` }}
              initial={{ width: 0 }}
              animate={active ? { width: `${60 + i * 10}%` } : { width: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.25, ease: EASE }}
            />
          </div>
          <span className="text-[9px] text-muted w-14 flex-shrink-0">{["instant","~0.3s","~1.2s","~2.3s"][i]}</span>
        </div>
      ))}
      <p className="text-[10px] text-muted mt-1">End-to-end transaction pipeline</p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function WhyBaalot() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="why" className="section-pad bg-bg text-white overflow-hidden">
      <div className="max-w-site mx-auto">

        <div className="mb-14">
          <motion.p
            className="label-tag mb-3"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Why Baalot
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4"
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Built different.<br className="hidden md:block" /> Proven in the field.
          </motion.h2>
          <motion.p
            className="text-muted text-lg max-w-lg"
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Your voters deserve infrastructure that actually works.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* Left: feature cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
                className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 group hover:border-accent/30 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="text-right">
                    <p className="font-syne font-extrabold text-2xl text-white leading-none">{r.stat}</p>
                    <p className="text-[10px] text-muted">{r.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-syne font-bold text-white text-sm leading-snug">{r.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: data panel */}
          <motion.div
            className="bg-surface border border-border rounded-2xl p-6 space-y-7"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          >
            {/* Comparison chart */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Before vs After</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20 inline-block" />Traditional</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" />Baalot</span>
                </div>
              </div>
              <div className="space-y-5">
                {comparisons.map((c, i) => (
                  <ComparisonBar key={c.metric} {...c} index={i} active={inView} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <UptimeRing active={inView} />
              <BlockchainSpeed active={inView} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
