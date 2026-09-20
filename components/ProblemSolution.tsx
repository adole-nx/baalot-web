"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SplitHeading from "./SplitHeading";

const problems = [
  { icon: "🗳️", title: "Rigged Elections", desc: "Ballot stuffing, manipulation, and intimidation undermine democratic outcomes across campuses." },
  { icon: "🔍", title: "Zero Transparency", desc: "Voters have no way to verify their vote was counted correctly — or counted at all." },
  { icon: "❌", title: "Manual Counting Errors", desc: "Human-led tallying introduces mistakes — intentional or otherwise. The margin is always disputed." },
  { icon: "😤", title: "Student Distrust", desc: "Chronically low turnout driven by one belief: that the result is predetermined before voting begins." },
];

const solutions = [
  { icon: "⛓️", title: "Tamper-Evident Records", desc: "Every ballot is hashed into a chain as it is cast. Alter one entry and every entry after it stops verifying." },
  { icon: "🌐", title: "Verifiable Results", desc: "Every voter holds a receipt they can check against the ballot chain, and the chain can be replayed end to end." },
  { icon: "🤖", title: "Automated Tallying", desc: "Votes are counted by the server as they arrive, with no human intervention. No overnight counting sessions." },
  { icon: "🛡️", title: "Voter Anonymity", desc: "Eligibility is checked at registration, not at the ballot. The ballot itself is stored unreadable and carries no identity." },
];

function Card({
  icon,
  title,
  desc,
  variant,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  variant: "problem" | "solution";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const fromLeft = variant === "problem";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`bg-surface-2 border border-subtle rounded-2xl p-5 cursor-default
        ${variant === "problem"
          ? "hover:border-red-500/30 hover:shadow-[0_0_24px_rgba(239,68,68,0.08)]"
          : "hover:border-blue/40 hover:shadow-[0_0_24px_rgba(59,110,248,0.1)]"
        } transition-all duration-300`}
    >
      <span className="text-2xl mb-3 block">{icon}</span>
      <h4 className="font-syne font-bold text-white text-base mb-1">{title}</h4>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function ProblemSolution() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="problem" className="section-padding bg-base">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-muted mb-4"
          >
            The Case for Baalot
          </motion.p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white">
            <SplitHeading text="Problem → Solution" />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem column */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-syne font-bold text-xl text-white/60 mb-6 flex items-center gap-2"
            >
              <span className="text-red-400">✕</span> The Problem
            </motion.p>
            <div className="flex flex-col gap-4">
              {problems.map((p, i) => (
                <Card key={p.title} {...p} variant="problem" index={i} />
              ))}
            </div>
          </div>

          {/* Solution column */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-syne font-bold text-xl text-white/60 mb-6 flex items-center gap-2"
            >
              <span className="text-blue">✓</span> The Baalot Solution
            </motion.p>
            <div className="flex flex-col gap-4">
              {solutions.map((s, i) => (
                <Card key={s.title} {...s} variant="solution" index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
