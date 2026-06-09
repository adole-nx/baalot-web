"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTubeEmbed from "./YouTubeEmbed";

const tabs = [
  {
    id: "universities",
    label: "Universities",
    headline: "Credible elections for academic communities",
    // "UNIVERSITY OF NAIROBI STUDENT COUNCIL ELECTION 2025" — real university election footage
    youtubeId: "L7TvUv7pTGI",
    challenges: [
      "Low voter trust in paper elections",
      "Allegations of result manipulation",
      "No audit trail for disputes",
      "Manual counting errors",
    ],
    solutions: [
      "Blockchain-recorded votes that anyone can verify",
      "Voter-anonymous ballots via ZK proofs",
      "Instant published results",
      "Full downloadable audit log",
    ],
    cta: "Run Your University Election →",
  },
  {
    id: "student-unions",
    label: "Student Unions",
    headline: "From chaos to credibility in one platform",
    // "Nigeria's Election Process: Experts In Tech, Academia, Law Increase Calls For E-Voting"
    youtubeId: "v7inQSORNl4",
    challenges: [
      "Ballot stuffing and proxy voting",
      "No voter ID system",
      "Results always contested",
      "Small team, large student body",
    ],
    solutions: [
      "Matric-number voter verification",
      "One vote per verified student",
      "Real-time public results",
      "One admin can run it all",
    ],
    cta: "Book a Demo for Your SU →",
  },
  {
    id: "corporate",
    label: "Corporate Orgs",
    headline: "Boardroom-grade voting for any organization",
    // "How Does Mobile Voting Work? - Animated Explainer Video for Apps"
    youtubeId: "-cuJ8lIp2BQ",
    challenges: [
      "Member verification for large bodies",
      "Privacy of individual votes",
      "Audit requirements for governance",
      "Remote participation",
    ],
    solutions: [
      "Custom member database integration",
      "ZK proof anonymity",
      "Immutable on-chain record",
      "Vote from anywhere",
    ],
    cta: "Set Up Organizational Voting →",
  },
  {
    id: "government",
    label: "Government",
    badge: "Roadmap",
    headline: "Infrastructure for Africa's democratic future",
    // "Nigeria's Election Process: Experts In Tech, Academia, Law" — most relevant for govt
    youtubeId: "v7inQSORNl4",
    challenges: [
      "NIN/BVN verification at scale",
      "USSD access for non-smartphone users",
      "INEC-compatible reporting",
      "Zero single point of failure",
    ],
    solutions: [
      "NIN/BVN API integration",
      "USSD fallback voting",
      "Exportable INEC-compatible reports",
      "Distributed node architecture",
    ],
    cta: "Talk to Our Team →",
  },
];

export default function UseCases() {
  const [active, setActive] = useState(0);
  const t = tabs[active];

  return (
    <section id="use-cases" className="section-pad bg-bg text-white">
      <div className="max-w-site mx-auto">
        <div className="mb-12">
          <motion.p className="label-tag mb-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Key Use Cases
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-4xl md:text-5xl text-white"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Where Baalot works best
          </motion.h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 flex-wrap">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                active === i
                  ? "bg-accent text-white shadow-[0_4px_16px_rgba(59,110,248,0.3)]"
                  : "bg-bg border border-border text-muted hover:border-accent/40 hover:text-white"
              }`}
            >
              {active === i && (
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {tab.label}
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/20">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            className="grid lg:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left: challenges / solutions */}
            <div>
              <h3 className="font-syne font-bold text-2xl md:text-3xl text-white mb-8">
                {t.headline}
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="label-tag mb-4 flex items-center gap-2">
                    <span className="text-red-400">✕</span> Challenges
                  </p>
                  <ul className="space-y-2">
                    {t.challenges.map((c) => (
                      <li key={c} className="text-muted text-sm flex items-start gap-2">
                        <span className="text-red-400/60 mt-0.5 flex-shrink-0">—</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label-tag mb-4 flex items-center gap-2">
                    <span className="text-accent">✓</span> How Baalot Solves It
                  </p>
                  <ul className="space-y-2">
                    {t.solutions.map((s) => (
                      <li key={s} className="text-white/70 text-sm flex items-start gap-2">
                        <span className="text-accent mt-0.5 flex-shrink-0">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {t.cta}
              </a>
            </div>

            {/* Right: YouTube embed */}
            <YouTubeEmbed
              videoId={t.youtubeId}
              title={t.headline}
              label={t.headline}
              aspectRatio="4/3"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
