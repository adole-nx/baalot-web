"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SplitHeading from "./SplitHeading";

const features = [
  {
    icon: "🔐",
    title: "Chain-Sealed Ballots",
    desc: "Every ballot is sealed into a server-side hash chain in the same transaction that records it. Altering one entry breaks every entry after it.",
    num: "01",
  },
  {
    icon: "🕵️",
    title: "Anonymous Ballots",
    desc: "Ballots are stored unreadable and carry no voter identity. No administrator can link a ballot to the person who cast it.",
    num: "02",
  },
  {
    icon: "🗳️",
    title: "Real-Time Results Dashboard",
    desc: "Live tally updates as votes come in — no waiting for manual counting at midnight.",
    num: "03",
  },
  {
    icon: "📱",
    title: "Mobile-Friendly Voting",
    desc: "Cast your vote from your phone in under 2 minutes. No queues. No paper forms.",
    num: "04",
  },
  {
    icon: "🏫",
    title: "Built for University Elections",
    desc: "Designed around SUG, NUESA, departmental, and faculty-level election structures.",
    num: "05",
  },
  {
    icon: "🌍",
    title: "Scalable to National Elections",
    desc: "Built on managed infrastructure that scales horizontally, so the same design serves a faculty vote or a national one.",
    num: "06",
  },
];

function FeatureCard({
  icon,
  title,
  desc,
  num,
  index,
}: (typeof features)[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-surface border border-border rounded-2xl p-6 cursor-default overflow-hidden"
    >
      {/* Hover fill wipe from bottom */}
      <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl" />
      {/* Glow border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-accent/0 group-hover:border-accent/40 transition-colors duration-300" />

      <div className="relative">
        {/* Top row: number + icon */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-syne font-extrabold text-3xl text-white/10 group-hover:text-white/20 transition-colors duration-300">
            {num}
          </span>
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300 inline-block">
            {icon}
          </span>
        </div>

        {/* Title with underline expand */}
        <h3 className="font-syne font-bold text-white text-lg mb-2 relative inline-block">
          {title}
          <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-accent transition-all duration-[400ms] ease-out" />
        </h3>

        <p className="text-muted text-sm leading-relaxed mt-2">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="features" className="section-pad bg-bg">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-16">
          {/* Left-aligned like Phenomenon Studio */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={titleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-muted mb-4"
          >
            Capabilities
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-white max-w-xl">
              <SplitHeading text="Everything a Fair Election Needs" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted text-sm leading-relaxed max-w-xs md:text-right"
            >
              Built from first principles.<br />No shortcuts. No compromises.
            </motion.p>
          </div>

          {/* Animated divider line */}
          <motion.div
            className="mt-8 h-px bg-subtle origin-left"
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
