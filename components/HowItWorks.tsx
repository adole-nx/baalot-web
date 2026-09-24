"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { EASE } from "@/lib/animations";

// ─── Step data ─────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    label: "Create Election",
    eyebrow: "Setup",
    command: "baalot init --name='SUG Presidential' --seats=5 --chain=ballot",
    output: `Creating election...
  Ballot chain:  initialised
  Genesis hash:  0x4a9f2b1e8c3d7f2a...b521
  Election ID:   SUG-2026-DEMO-001
  Positions:     5
  Voter roster:  pending import
✓ Election ready. Share code: DEMO-7X3K`,
    successLines: [6],
  },
  {
    number: "02",
    label: "Register Voters",
    eyebrow: "Verification",
    command: "baalot voters add --verify=NIN --source=roster.csv",
    output: `Importing voter roster...
  Total records:   2,847
  NIN verified:    2,801  ✓
  Pending review:     46  (duplicate NIN flag)
Sealing anonymous voter registry...
  Registry hash: 0x8f2a9c...d31b
✓ Voter registry sealed. Ready to open.`,
    successLines: [2, 6],
    warningLines: [3],
  },
  {
    number: "03",
    label: "Election Live",
    eyebrow: "Voting Open",
    command: "baalot election open --id=SUG-2026-DEMO-001 --duration=8h",
    output: `● Election is LIVE
  Duration:   8 hours remaining
  Turnout:    1,203 / 2,801  (42.9%)
  Rate:       ▁▃▅▇█▇▅▃▂  votes/min
  Anomalies:  NONE DETECTED
  Ballot chain: sealing each vote
All ballots stored anonymously. Each one sealed into the chain.`,
    successLines: [0, 4],
  },
  {
    number: "04",
    label: "Certify Results",
    eyebrow: "Complete",
    command: "baalot results certify --publish",
    output: `Closing ballot. Tallying 2,801 votes...
  Winner:     Candidate A  (44.1%)
Verifying ballot chain...
  Chain:      ✓ INTACT  (2,801 links)
Publishing results...
  Receipts:   every voter can check their own
✓ Results certified and published.`,
    successLines: [3, 6],
  },
];

// ─── Typewriter output ─────────────────────────────────────────
function TerminalOutput({
  text, successLines = [], warningLines = [], active,
}: {
  text: string;
  successLines?: number[];
  warningLines?: number[];
  active: boolean;
}) {
  const { displayed } = useTypewriter(text, 16, active);
  const lines = displayed.split("\n");

  const getLineColor = (i: number) => {
    if (successLines.includes(i)) return "#22c55e";
    if (warningLines?.includes(i)) return "#F59E0B";
    return "#64748B";
  };

  return (
    <div className="terminal-output min-h-[148px]">
      {lines.map((line, i) => (
        <div key={i} style={{ color: getLineColor(i) }} className="leading-relaxed">
          {line || " "}
          {i === lines.length - 1 && (
            <span
              className="inline-block w-2 h-[1em] ml-0.5 align-text-bottom cursor-blink"
              style={{ background: "#9B5DE5" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Animated connector line between step dots ─────────────────
function StepConnector({ active, total }: { active: number; total: number }) {
  const pct = ((active / (total - 1)) * 100).toFixed(1);
  return (
    <div className="absolute left-[22px] top-[52px] bottom-[52px] w-px" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="w-full origin-top rounded-full"
        style={{ background: "linear-gradient(to bottom, #9B5DE5, #14B8A6)" }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 0.5, ease: EASE }}
      />
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [activeStep, setActiveStep] = useState(0);
  const [scanKey, setScanKey] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const step = Math.min(3, Math.floor(v * 4));
      setActiveStep((prev) => {
        if (step !== prev) setScanKey((k) => k + 1);
        return step;
      });
    });
    return () => unsub();
  }, [scrollYProgress]);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY       = useTransform(scrollYProgress, [0, 0.1], [0, -36]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Border glow intensity tracks active step change
  const accentColors = ["#9B5DE5", "#14B8A6", "#F59E0B", "#22c55e"];

  return (
    <section
      ref={sectionRef}
      style={{ height: "420vh", background: "var(--bg-void)" }}
    >
      {/* Sticky frame */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

        {/* Section header — sits above the step content in normal flow */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="w-full z-20 pt-24 pb-6 flex flex-col items-center text-center pointer-events-none shrink-0"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: "#9B5DE5" }}
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
          >
            Run an election in four steps.
          </motion.h2>
        </motion.div>

        {/* Main layout */}
        <div className="flex-1 flex items-center justify-center px-5 md:px-10 pb-12">
          <div className="w-full max-w-5xl grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16 items-center">

            {/* Step indicators with connector */}
            <div className="hidden md:flex flex-col gap-2 relative">
              <StepConnector active={activeStep} total={steps.length} />
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  animate={{ opacity: i === activeStep ? 1 : i < activeStep ? 0.55 : 0.28 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-start gap-3 p-3 rounded-xl relative overflow-hidden"
                  style={{
                    borderLeft: `2px solid ${i === activeStep ? accentColors[i] : "transparent"}`,
                    background: i === activeStep ? `${accentColors[i]}0D` : "transparent",
                    transition: "background 0.4s ease, border-color 0.4s ease",
                  }}
                >
                  {/* Active step pulse ring */}
                  {i === activeStep && (
                    <motion.div
                      className="absolute left-[-2px] top-0 bottom-0 w-0.5 rounded-full"
                      style={{ background: accentColors[i] }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* Step number dot */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      animate={{
                        background: i <= activeStep ? accentColors[i] + "22" : "rgba(255,255,255,0.04)",
                        borderColor: i <= activeStep ? accentColors[i] : "rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.4 }}
                      style={{ border: "1px solid" }}
                    >
                      <span
                        className="font-mono text-[9px] font-bold"
                        style={{ color: i <= activeStep ? accentColors[i] : "#334155" }}
                      >
                        {i < activeStep ? "✓" : step.number.slice(1)}
                      </span>
                    </motion.div>

                    {i === activeStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `1px solid ${accentColors[i]}` }}
                        animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: i === activeStep ? accentColors[i] : "#334155" }}>
                      {step.eyebrow}
                    </p>
                    <p className="text-[13px] font-semibold leading-tight" style={{ color: i === activeStep ? "#F0F4F8" : "#64748B" }}>
                      {step.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Terminal card */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              animate={{
                boxShadow: `0 0 80px ${accentColors[activeStep]}12, 0 24px 60px rgba(0,0,0,0.5)`,
                borderColor: `${accentColors[activeStep]}28`,
              }}
              transition={{ duration: 0.5 }}
              style={{
                background: "#070B10",
                border: "1px solid",
              }}
            >
              {/* Progress bar */}
              <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div
                  className="h-full origin-left"
                  style={{
                    width: progressWidth,
                    background: `linear-gradient(to right, #9B5DE5, ${accentColors[activeStep]})`,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0A0E15" }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444", opacity: 0.8 }} />
                <motion.span
                  className="w-3 h-3 rounded-full"
                  animate={{ background: accentColors[activeStep] }}
                  transition={{ duration: 0.4 }}
                  style={{ opacity: 0.8 }}
                />
                <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e", opacity: 0.8 }} />
                <span className="ml-3 font-mono text-[11px]" style={{ color: "#334155" }}>
                  baalot admin · illustration
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{ background: accentColors[activeStep], opacity: [1, 0.35, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <motion.span
                    key={activeStep}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono text-[10px]"
                    style={{ color: accentColors[activeStep] }}
                  >
                    {steps[activeStep].eyebrow}
                  </motion.span>
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 md:p-6 min-h-[280px] relative overflow-hidden">

                {/* Scan-line flash on step change */}
                <AnimatePresence>
                  <motion.div
                    key={`scan-${scanKey}`}
                    className="absolute inset-x-0 h-px pointer-events-none z-10"
                    style={{ background: `linear-gradient(to right, transparent, ${accentColors[activeStep]}60, transparent)` }}
                    initial={{ top: 0, opacity: 1 }}
                    animate={{ top: "100%", opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeIn" }}
                  />
                </AnimatePresence>

                {/* Mobile step label */}
                <div className="md:hidden flex items-center gap-2 mb-4">
                  <span className="font-mono text-[11px]" style={{ color: accentColors[activeStep] }}>
                    {steps[activeStep].number}
                  </span>
                  <span className="text-[12px] font-semibold text-primary">
                    {steps[activeStep].label}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    {/* Prompt line */}
                    <div className="flex items-start gap-2 mb-4">
                      <span className="font-mono text-[12px] mt-0.5 shrink-0" style={{ color: "#334155" }}>$</span>
                      <span className="font-mono text-[12px] md:text-[13px] break-all" style={{ color: accentColors[activeStep] }}>
                        {steps[activeStep].command}
                      </span>
                    </div>
                    <TerminalOutput
                      text={steps[activeStep].output}
                      successLines={steps[activeStep].successLines}
                      warningLines={steps[activeStep].warningLines}
                      active={true}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {/* Step progress pips */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 rounded-full"
                      animate={{
                        width: i === activeStep ? 22 : 7,
                        background: i <= activeStep ? accentColors[i] : "rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {activeStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <Link
                        href="/contact"
                        className="btn-shimmer inline-flex items-center gap-1.5 font-semibold text-[12px] px-4 py-1.5 rounded-full transition-all hover:scale-[1.03]"
                        style={{
                          background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                          color: "#FFFFFF",
                          boxShadow: "0 4px 14px rgba(155,93,229,0.3)",
                        }}
                      >
                        Start your election
                        <span style={{ marginLeft: 2 }}>→</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom scroll progress bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 rounded-full"
              animate={{
                width: i <= activeStep ? 28 : 10,
                background: i <= activeStep ? accentColors[i] : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
