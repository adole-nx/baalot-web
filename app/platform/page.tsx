"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import PlatformHero from "@/components/PlatformHero";
import BentoFeatures from "@/components/BentoFeatures";
import AppFeatureShowcase from "@/components/AppFeatureShowcase";
import SplitHeading from "@/components/SplitHeading";
import SectionReveal from "@/components/SectionReveal";
import EcosystemGrid from "@/components/EcosystemGrid";
import AudienceCTA from "@/components/AudienceCTA";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Process Timeline ─────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Setup",
    desc: "Admin creates the election, uploads the voter list, and sets the voting window — all from the Baalot dashboard in minutes.",
    icon: "⚙️",
  },
  {
    number: "02",
    title: "Vote",
    desc: "Voters join with their institution ID, which must match the voter list, and confirm their ballot with a voting PIN from any device — phone, tablet or laptop. One vote per identity.",
    icon: "🗳️",
  },
  {
    number: "03",
    title: "Verify",
    desc: "Results are tallied live the moment voting closes, with real-time tallies in the dashboard. Public, cryptographic verification on a block explorer is on our roadmap.",
    icon: "✅",
  },
];

function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="section-pad bg-surface overflow-hidden">
      <div className="max-w-site mx-auto" ref={sectionRef}>
        <SectionReveal variant="clip-up" className="text-center mb-16">
          <p className="label-tag mb-3">The Process</p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white">
            <SplitHeading text="Three steps to a trusted election." />
          </h2>
        </SectionReveal>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent/60 via-accent/30 to-accent/60 origin-left"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.2 + i * 0.15, ease: EASE }}
              className="flex flex-col items-center text-center p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Number bubble */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-bg border-2 border-amber-500/40 flex items-center justify-center mb-6">
                <span className="font-syne font-extrabold text-xl text-amber-500">{step.number}</span>
                <motion.div
                  className="absolute inset-0 rounded-full border border-amber-500/20"
                  animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                />
              </div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Counter ────────────────────────────────────────────────────────────
const platformStats = [
  { value: 110, suffix: "+", prefix: "", label: "Institutions in the directory" },
  { value: 1,   suffix: "",  prefix: "", label: "Vote per verified identity" },
  { value: 3,   suffix: "",  prefix: "", label: "Platforms — iOS, Android, Web" },
];

function StatCounter({ value, suffix, prefix, label, index }: typeof platformStats[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !inView) return;
    if (value === 0) { setCurrent(0); return; }
    const delay = index * 150;
    const id = setTimeout(() => {
      const dur = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        setCurrent(Math.round((1 - Math.pow(1 - t, 4)) * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(id);
  }, [mounted, inView, value, index]);

  const display = value >= 1000
    ? current >= 1000 ? `${Math.round(current / 1000)}K` : `${current}`
    : `${current}`;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center gap-2 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
    >
      {index > 0 && (
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-border" />
      )}
      <span className="font-syne font-extrabold text-[1.75rem] sm:text-4xl lg:text-5xl text-white tabular-nums leading-none">
        {prefix}{display}{suffix}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted max-w-[120px]">{label}</span>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="section-pad bg-bg">
      <div className="max-w-site mx-auto">
        <motion.div
          className="p-5 sm:p-8 lg:p-10 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0">
            {platformStats.map((s, i) => (
              <StatCounter key={s.label} {...s} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="section-pad bg-surface">
      <div className="max-w-site mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          whileHover={{
            borderColor: "rgba(155,93,229,0.35)",
            boxShadow: "0 0 60px rgba(155,93,229,0.08)",
          }}
        >
          {/* Inner orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "#9B5DE5", opacity: 0.06, filter: "blur(80px)" }}
          />

          <motion.p
            className="label-tag mb-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Get Started
          </motion.p>

          <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-white mb-4 relative z-10">
            <SplitHeading text="Ready to run a transparent election?" />
          </h2>

          <motion.p
            className="text-muted text-lg max-w-xl mx-auto mb-10 relative z-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Live as soon as your voter list is ready. Built for universities, student unions and member organisations across Nigeria.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center relative z-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Request a Demo</span>
            </Link>
            <Link
              href="#bento"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 font-semibold text-sm hover:border-white/50 hover:bg-white/5 transition-all duration-200"
            >
              Explore Features →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlatformPage() {
  return (
    <main>
      <PlatformHero />
      <BentoFeatures />
      <AppFeatureShowcase />
      <ProcessSection />
      <EcosystemGrid />
      <StatsSection />
      <AudienceCTA />
      <CTASection />
    </main>
  );
}
