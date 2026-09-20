"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const reasons = [
  {
    icon: "🔐",
    title: "Chain-Sealed Ballots",
    desc: "Every ballot is sealed into a hash chain in the same transaction that records it. Change one entry and every entry after it stops verifying.",
    stat: "1", statLabel: "chain per election"
  },
  {
    icon: "🕵️",
    title: "Voter Anonymity by Default",
    desc: "Ballots are stored unreadable and carry no voter identity. No administrator can open one or link it to the person who cast it.",
    stat: "0", statLabel: "admins can read a ballot"
  },
  {
    icon: "🌍",
    title: "Built for African Context",
    desc: "NIN/BVN identity verification, low-bandwidth support and Nigerian infrastructure — designed from the ground up, not force-fitted.",
    stat: "28", statLabel: "states in the directory"
  },
  {
    icon: "⚡",
    title: "Fast to Deploy",
    desc: "Set up your first election in under two weeks. No IT team. No integrations. Self-serve, guided, and built for non-technical admins.",
    stat: "~14", statLabel: "days to launch"
  },
];

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
            Built different.<br className="hidden md:block" /> Built to be checked.
          </motion.h2>
          <motion.p
            className="text-muted text-lg max-w-lg"
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Your voters deserve infrastructure that actually works.
          </motion.p>
        </div>

        <div className="grid gap-10 items-start">

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

          {/* The data panel that used to sit here charted invented before/after
              metrics (turnout 52% to 89%, dispute rate 41% to 0.3%), an uptime
              figure labelled "SLA guaranteed" that we have never measured or
              promised, and a "Submit / ZK Proof / Blockchain / Confirmed"
              pipeline that does not describe how Baalot works. It comes back
              when there are measured numbers to put in it. */}

        </div>
      </div>
    </section>
  );
}
