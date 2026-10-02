"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SplitHeading from "@/components/SplitHeading";
import NodeDiagram from "@/components/NodeDiagram";
import VerifyTerminal from "@/components/VerifyTerminal";
import YouTubeEmbed from "@/components/YouTubeEmbed";

const EASE = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    icon: "⛓️",
    title: "Tamper-Evident Ballot Chain (Live)",
    body: "Every accepted ballot is sealed into a per-election hash-chain in the same transaction that records the vote — altering any past ballot breaks every hash after it. Voters get a cryptographic receipt, and anyone can replay and verify the full chain through our public API.",
    accent: "#3B6EF8",
  },
  {
    icon: "🔐",
    title: "Encrypted Ballots",
    body: "Each candidate choice is encrypted with AES-256-GCM before it is stored, and ballots are recorded under a pseudonymous anchor, not your name. The chain publishes only a salted commitment of each ballot: the voter alone holds the salt that proves it's theirs. Baalot operates the database and holds the key that opens ballots to count them, so we do not claim ballots are hidden from Baalot itself.",
    accent: "#7C3AED",
  },
  {
    icon: "🆔",
    title: "Verified Membership, One Vote Each",
    body: "A ballot opens only for a member matched to the institution's voter list, confirmed with their voting PIN, and the server accepts one vote per identity. Voters can add a verified-identity badge by checking a NIN or BVN with a liveness selfie through Prembly.",
    accent: "#F5C518",
  },
  {
    icon: "🔒",
    title: "Encrypted In Transit And At Rest",
    body: "All data in transit is encrypted with TLS 1.3. Ballots are encrypted at rest with AES-256-GCM, and voting PINs are hashed with scrypt — never stored. Even if traffic or storage were read, it would be unreadable.",
    accent: "#10B981",
  },
  {
    icon: "📋",
    title: "Full Audit Trail",
    body: "Every admin action, voter check-in, and ballot submission is time-stamped and logged, and every ballot is sealed into the tamper-evident chain the moment it's cast. The full chain can be replayed and verified through the public API at any time.",
    accent: "#F97316",
  },
  {
    icon: "🛡️",
    title: "Hardened Infrastructure",
    body: "Votes are server-verified and stored unreadable on hardened, managed cloud infrastructure. A change to any past ballot breaks the audit chain, which anyone can re-verify.",
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
              result publication, every step is logged — and the ballot chain can be replayed and verified by anyone.
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
            Sharded ballot chain — each shard commits its own blocks into one merkle root
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
                whileHover={{ y: -4, boxShadow: `0 0 0 1px ${p.accent}30, 0 8px 32px rgba(0,0,0,0.3)`, transition: { duration: 0.22 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                className="p-6 rounded-2xl cursor-default"
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

      {/* Security video */}
      <section className="section-pad bg-bg">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
              The Case for Digital Elections
            </p>
            <h2
              className="font-syne font-bold text-primary"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}
            >
              Why experts are calling for e-voting now.
            </h2>
          </div>
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: "linear-gradient(135deg, rgba(155,93,229,0.2), rgba(255,255,255,0.04))",
              boxShadow: "0 0 60px rgba(155,93,229,0.08)",
            }}
          >
            <div className="rounded-[calc(1rem-1px)] overflow-hidden">
              <YouTubeEmbed
                videoId="v7inQSORNl4"
                title="Nigeria's Election Process: Experts in Tech, Academia and Law call for E-Voting"
                label="Experts on digital election security"
                aspectRatio="16/9"
              />
            </div>
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
              Every ballot already comes with a cryptographic receipt, checkable against the public chain API today. A standalone Baalot CLI so you can verify from any machine — no trust in us required — is next; here&apos;s how it will feel.
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
              We&apos;ll walk your IT team through the full architecture, our threat model, and data handling procedures.
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
