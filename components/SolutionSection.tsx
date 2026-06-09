"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Shield, Link as LinkIcon, LayoutDashboard } from "lucide-react";
import { EASE, EASE_SPRING } from "@/lib/animations";
import YouTubeEmbed from "@/components/YouTubeEmbed";

const panels = [
  {
    tag: "VOTE",
    headline: "One-tap voting.\nNo compromise.",
    body: "Voters authenticate with NIN or student ID, cast their ballot in under 30 seconds, and receive a cryptographic receipt — all from any device, anywhere on the continent.",
    icon: Shield,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.12)",
    dir: "left" as const,
    // Mobile voting animated explainer
    youtubeId: "-cuJ8lIp2BQ",
    videoLabel: "How voters cast a Baalot ballot",
  },
  {
    tag: "VERIFY",
    headline: "Every vote is a\nblockchain entry.",
    body: "Each ballot is hashed, timestamped, and written to an immutable smart contract. Anyone can audit the result. No administrator can alter it.",
    icon: LinkIcon,
    color: "#14B8A6",
    glow: "rgba(20,184,166,0.12)",
    dir: "right" as const,
    // Nigeria e-voting experts discussing blockchain verification
    youtubeId: "v7inQSORNl4",
    videoLabel: "Experts on blockchain election verification",
  },
  {
    tag: "MANAGE",
    headline: "Election command\ncenter. Live.",
    body: "Real-time turnout analytics, candidate dashboards, anomaly alerts, and one-click result certification — everything in a single control room your team actually wants to use.",
    icon: LayoutDashboard,
    color: "#9B5DE5",
    glow: "rgba(155,93,229,0.12)",
    dir: "left" as const,
    // University student council election — real managed election footage
    youtubeId: "L7TvUv7pTGI",
    videoLabel: "Live election dashboard in action",
  },
];

// ─── Single panel ──────────────────────────────────────────────
function Panel({ panel }: { panel: typeof panels[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = panel.dir === "left";
  const Icon = panel.icon;

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${isLeft ? "" : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"}`}
    >
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[10px] font-bold tracking-[0.15em] uppercase"
          style={{ background: `${panel.color}12`, border: `1px solid ${panel.color}25`, color: panel.color }}
        >
          <Icon size={11} />
          {panel.tag}
        </div>

        <h2
          className="font-syne font-bold text-primary mb-5"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.025em", lineHeight: 1.1, whiteSpace: "pre-line" }}
        >
          {panel.headline}
        </h2>

        <p className="text-[15px] leading-relaxed max-w-[480px]" style={{ color: "#64748B" }}>
          {panel.body}
        </p>

        <button
          className="mt-7 inline-flex items-center gap-2 font-semibold text-[13px] transition-colors"
          style={{ color: panel.color }}
        >
          Learn more <ArrowUpRight size={14} />
        </button>
      </motion.div>

      {/* YouTube video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_SPRING, delay: 0.15 }}
      >
        <div
          className="rounded-2xl p-[1px]"
          style={{
            background: `linear-gradient(135deg, ${panel.color}20, rgba(255,255,255,0.04))`,
            boxShadow: `0 0 60px ${panel.glow}`,
          }}
        >
          <div className="rounded-[calc(1rem-1px)] overflow-hidden">
            <YouTubeEmbed
              videoId={panel.youtubeId}
              title={panel.headline.replace("\n", " ")}
              label={panel.videoLabel}
              aspectRatio="16/9"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function SolutionSection() {
  return (
    <section
      id="solution"
      className="py-24 px-5 md:px-10 lg:px-16"
      style={{ background: "#080C10" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-syne font-bold text-primary"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Three pillars. One platform.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="mt-4 text-[15px]"
            style={{ color: "#64748B" }}
          >
            Every election, from ballot design to certified results.
          </motion.p>
        </div>

        <div className="space-y-28 lg:space-y-36">
          {panels.map((panel) => (
            <Panel key={panel.tag} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
