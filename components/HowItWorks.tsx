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
    command: "baalot init --type=student-union --seats=5",
    output: `Initializing secure election context...
Deploying smart contract to Ethereum L2...
Contract address: 0x4a9f2b1e...3b21
Election ID: NUE-2025-001
Generating ballot schema...
✓ Election created. Share code: NILE-VOTE-7X3K`,
    successLines: [5],
  },
  {
    number: "02",
    label: "Register Voters",
    command: "baalot voters --verify=NIN --import=roster.csv",
    output: `Importing voter roster (2,847 students)...
Running NIN verification batch...
Verified: 2,801 ✓   Flagged: 46 ⚠
Generating anonymous voter tokens...
Sealing Merkle tree...
✓ Voter registry sealed. Root: 0x8f2a...`,
    successLines: [5],
    warningLines: [2],
  },
  {
    number: "03",
    label: "Run Election",
    command: "baalot election start --id=NUE-2025-001",
    output: `Election LIVE \u{1F7E2}
Turnout: 1,203 / 2,801 (42.9%)
Votes per minute: ▁▃▅▇█▇▅▃▂
Anomaly detection: CLEAR
ZK proof generation: ACTIVE
Time remaining: 05:32:17`,
    successLines: [0],
  },
  {
    number: "04",
    label: "Certify Results",
    command: "baalot results --certify --publish-ipfs",
    output: `Tallying 2,801 verified ballots...
Generating zero-knowledge proof...
ZK proof: ✓ VALID
Publishing to IPFS: QmXf9...k23p
Results certified at 14:07:33 WAT
✓ Election complete. 0 disputes.`,
    successLines: [2, 5],
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
  const { displayed } = useTypewriter(text, 18, active);
  const lines = displayed.split("\n");

  const getLineColor = (i: number) => {
    if (successLines.includes(i)) return "#22c55e";
    if (warningLines?.includes(i)) return "#B27FF0";
    return "#64748B";
  };

  return (
    <div className="terminal-output min-h-[120px]">
      {lines.map((line, i) => (
        <div key={i} style={{ color: getLineColor(i) }}>
          {line}
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

// ─── Main export ───────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Active step 0–3 based on scroll
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const step = Math.min(3, Math.floor(v * 4));
      setActiveStep(step);
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Heading reveal
  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const headerY       = useTransform(scrollYProgress, [0, 0.08], [0, -40]);

  return (
    <section
      ref={sectionRef}
      style={{ height: "420vh", background: "var(--bg-void)" }}
    >
      {/* Sticky frame */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Section header (fades out on scroll) */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-0 inset-x-0 z-20 pt-24 pb-4 flex flex-col items-center text-center pointer-events-none"
        >
          <p
            className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: "#9B5DE5" }}
          >
            How it works
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Run an election in four steps.
          </h2>
        </motion.div>

        {/* Main terminal layout */}
        <div className="flex-1 flex items-center justify-center px-5 md:px-10">
          <div className="w-full max-w-5xl grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16 items-center">

            {/* Step indicators */}
            <div className="hidden md:flex flex-col gap-2">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  animate={{
                    opacity: i === activeStep ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-default relative overflow-hidden"
                  style={{
                    borderLeft: `2px solid ${i === activeStep ? "#9B5DE5" : "transparent"}`,
                    background: i === activeStep ? "rgba(155,93,229,0.05)" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    className="font-mono text-[11px] font-semibold shrink-0 mt-0.5"
                    style={{ color: i === activeStep ? "#9B5DE5" : "#334155" }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <p
                      className="text-[13px] font-semibold leading-tight"
                      style={{ color: i === activeStep ? "#F0F4F8" : "#64748B" }}
                    >
                      {step.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Terminal card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#070B10",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 80px rgba(155,93,229,0.06), 0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Terminal title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0A0E15" }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444", opacity: 0.8 }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#9B5DE5", opacity: 0.8 }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e", opacity: 0.8 }} />
                <span className="ml-3 font-mono text-[11px]" style={{ color: "#334155" }}>
                  baalot-cli v2.1.0
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 live-dot" />
                  <span className="font-mono text-[10px]" style={{ color: "#9B5DE5" }}>
                    {steps[activeStep].label}
                  </span>
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 md:p-6 min-h-[280px]">
                {/* Mobile step label */}
                <div className="md:hidden flex items-center gap-2 mb-4">
                  <span className="font-mono text-[11px]" style={{ color: "#9B5DE5" }}>
                    {steps[activeStep].number}
                  </span>
                  <span className="text-[12px] font-semibold text-primary">
                    {steps[activeStep].label}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    {/* Prompt line */}
                    <div className="flex items-start gap-2 mb-4">
                      <span className="font-mono text-[12px] mt-0.5 shrink-0" style={{ color: "#334155" }}>$</span>
                      <span className="font-mono text-[12px] md:text-[13px]" style={{ color: "#9B5DE5" }}>
                        {steps[activeStep].command}
                      </span>
                    </div>

                    {/* Output */}
                    <TerminalOutput
                      text={steps[activeStep].output}
                      successLines={steps[activeStep].successLines}
                      warningLines={steps[activeStep].warningLines}
                      active={true}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Terminal footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {/* Step dots */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: i === activeStep ? 20 : 6,
                        background: i === activeStep ? "#9B5DE5" : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>

                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 font-semibold text-[12px] px-4 py-1.5 rounded-full transition-all"
                      style={{
                        background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                        color: "#FFFFFF",
                      }}
                    >
                      Start your election →
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll progress indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-500"
              style={{
                width: i <= activeStep ? 24 : 8,
                background: i <= activeStep ? "#9B5DE5" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
