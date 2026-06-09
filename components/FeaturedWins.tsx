"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const wins = [
  {
    name: "NUESA Nile University",
    short: "Nile University",
    stat: "847",
    statLabel: "votes on-chain",
    desc: "Nigeria's first fully blockchain-recorded student election.",
    tag: "University",
    flag: "🇳🇬",
  },
  {
    name: "Federal Poly Bida SUG",
    short: "Fed Poly Bida",
    stat: "2,400",
    statLabel: "registered voters",
    desc: "Zero disputes. Results published in under 4 minutes.",
    tag: "Student Gov",
    flag: "🇳🇬",
  },
  {
    name: "TechFest Voting 2024",
    short: "TechFest 2024",
    stat: "60s",
    statLabel: "to publish results",
    desc: "Real-time results on-chain within 60 seconds of poll close.",
    tag: "Event",
    flag: "🇳🇬",
  },
  {
    name: "CFA Nigeria Chapter",
    short: "CFA Nigeria",
    stat: "800",
    statLabel: "members verified",
    desc: "Secure online ballot for professional association members.",
    tag: "Professional Body",
    flag: "🇳🇬",
  },
  {
    name: "University of Abuja SUG",
    short: "UniAbuja SUG",
    stat: "Q1 2025",
    statLabel: "pilot launch",
    desc: "Full blockchain integration — pilot currently in progress.",
    tag: "University",
    flag: "🇳🇬",
  },
  {
    name: "Pan-African DAO Vote",
    short: "Pan-African DAO",
    stat: "6",
    statLabel: "countries",
    desc: "Cross-border governance vote spanning 6 African nations.",
    tag: "Web3 / DAO",
    flag: "🌍",
  },
];

export default function FeaturedWins() {
  return (
    <section className="bg-paper overflow-hidden">
      {/* Header */}
      <div className="max-w-site mx-auto px-5 md:px-10 pt-20 pb-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <motion.p
              className="label-tag-ink mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Baalot in Action
            </motion.p>
            <motion.h2
              className="font-syne font-extrabold text-4xl md:text-5xl text-ink"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Pilot Elections &amp; Early Wins
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-ink/80 transition-colors"
            >
              Run your election →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hover-card grid */}
      <div className="border-t border-light-border">
        <div className="max-w-site mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {wins.map((w, i) => (
            <motion.div
              key={w.name}
              className="group relative overflow-hidden border-b border-r border-light-border min-h-[200px] cursor-pointer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              {/* Default state */}
              <div className="p-8 transition-opacity duration-300 group-hover:opacity-0">
                <span className="text-2xl block mb-4">{w.flag}</span>
                <h3 className="font-syne font-bold text-xl text-ink leading-tight">{w.short}</h3>
                <p className="text-muted text-sm mt-2 leading-snug">{w.tag}</p>
              </div>

              {/* Hover overlay — slides up from bottom */}
              <div
                className="absolute inset-0 bg-ink text-paper p-8 flex flex-col justify-between
                  translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
              >
                <div>
                  <p className="font-syne font-extrabold text-5xl text-white leading-none">
                    {w.stat}
                  </p>
                  <p className="text-white/50 text-sm mt-1">{w.statLabel}</p>
                  <p className="text-white/75 text-sm mt-4 leading-relaxed">{w.desc}</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/60">
                    {w.tag}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/60">
                    {w.flag} Nigeria
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="pb-4" />
    </section>
  );
}
