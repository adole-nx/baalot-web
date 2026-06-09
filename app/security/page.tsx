"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SplitHeading from "@/components/SplitHeading";
import NodeDiagram from "@/components/NodeDiagram";
import VerifyTerminal from "@/components/VerifyTerminal";

const EASE = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    icon: "⛓️",
    title: "Blockchain-Recorded Results",
    body: "Every vote is a signed transaction on the Ethereum blockchain. Once written, results cannot be altered by anyone — not Baalot, not the election admin, not a court order. The ledger is permanent.",
    accent: "#3B6EF8",
  },
  {
    icon: "🔐",
    title: "Zero-Knowledge Anonymity",
    body: "Baalot uses ZK proofs to verify a vote is valid (from an eligible voter, cast only once) without revealing who cast it. Your ballot is mathematically private.",
    accent: "#7C3AED",
  },
  {
    icon: "🆔",
    title: "NIN / BVN Identity Verification",
    body: "Voters are verified against Nigeria's national identity infrastructure before any ballot is opened. Duplicate voting is cryptographically impossible — one person, one vote, guaranteed.",
    accent: "#F5C518",
  },
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    body: "All data in transit is encrypted with TLS 1.3. Voter credentials use AES-256. Even if traffic were intercepted, it would be unreadable.",
    accent: "#10B981",
  },
  {
    icon: "📋",
    title: "Full Audit Trail",
    body: "Every admin action, voter check-in, and ballot submission is time-stamped and logged on-chain. Any observer can download a complete PDF audit report at any time.",
    accent: "#F97316",
  },
  {
    icon: "🛡️",
    title: "No Central Attack Surface",
    body: "Baalot uses a distributed node architecture. There is no single server that, if compromised, could alter results. The blockchain IS the database.",
    accent: "#EC4899",
  },
];

export default function SecurityPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* Hero */}
      <section className="section-pad pt-36 pb-12">
        <div className="max-w-site mx-auto">
          <div className="max-w-2xl">
            <motion.p
              className="label-tag mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            >
              Security
            </motion.p>
            <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-6">
              <SplitHeading text="Trust built into every layer." mode="mount" />
            </h1>
            <motion.p
              className="text-muted text-lg leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Baalot&apos;s security is not a feature — it&apos;s the architecture. From voter identity to final
              result publication, every step is cryptographically secured and independently verifiable.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Node Diagram */}
      <section className="pb-12">
        <div className="max-w-site mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex justify-center"
          >
            <NodeDiagram />
          </motion.div>
          <p className="text-center text-muted text-xs mt-4">
            Distributed node architecture — no single point of failure
          </p>
        </div>
      </section>

      {/* Security pillars */}
      <section className="section-pad bg-surface">
        <div className="max-w-site mx-auto">
          <div className="text-center mb-12">
            <motion.p
              className="label-tag mb-3"
              initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              How We Protect Every Vote
            </motion.p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-white">
              <SplitHeading text="Six layers of security." />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, filter: "blur(12px)", scale: 0.96 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}30` }}
                >
                  {p.icon}
                </div>
                <h3 className="font-syne font-bold text-white mb-3">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verify Terminal */}
      <section className="section-pad" style={{ background: "#030507" }}>
        <div className="max-w-site mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
              Independent Verification
            </p>
            <h2
              className="font-syne font-bold text-primary"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em" }}
            >
              Verify any vote receipt yourself.
            </h2>
            <p className="mt-3 text-[15px] max-w-lg mx-auto" style={{ color: "#64748B" }}>
              Every voter gets a blockchain receipt. Verify it independently with the Baalot CLI or any BBC node - no trust required.
            </p>
          </div>
          <VerifyTerminal className="max-w-2xl mx-auto" />
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-bg">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <h2 className="font-syne font-extrabold text-3xl text-white mb-4">
              Want a full security briefing?
            </h2>
            <p className="text-muted mb-8">
              We&apos;ll walk your IT team through the full architecture, smart contract audits, and data handling procedures.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Request a Security Brief</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
