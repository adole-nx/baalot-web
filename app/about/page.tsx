"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SplitHeading from "@/components/SplitHeading";
import SectionReveal from "@/components/SectionReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const milestones = [
  { year: "The problem", title: "A disputed election", desc: "Founder Adole Daniel sees a student election fall apart — manual counting, contested results, no audit trail — and asks why democratic institutions in Africa still run on paper and spreadsheets." },
  { year: "The build", title: "Baalot takes shape", desc: "A mobile-first election platform: ballots encrypted before they are stored, server-verified one-vote-per-identity, a voting PIN with optional biometrics, and live real-time tallies." },
  { year: "The platform", title: "More than a ballot", desc: "Per-institution mini-apps and branding, multi-position ballots, elections that auto open and close, an admin dashboard, a community feed, campaign reels, a news feed, and the in-app Levi assistant — on Android, iOS, and web." },
  { year: "Today", title: "In the field", desc: "Baalot is in early access with institutions across Nigeria, and every ballot cast is sealed into a tamper-evident hash-chain — with a cryptographic receipt for the voter and public verification for everyone else." },
];

const values = [
  { icon: "🗳️", title: "Every Vote Counts", body: "Not as a slogan — as an engineering requirement. We build systems where a single vote cannot be lost, changed, or ignored." },
  { icon: "🌍", title: "Built for Africa", body: "Africa's democracy deserves infrastructure designed for African realities: low bandwidth, feature phones, multiple languages, high trust stakes." },
  { icon: "🔓", title: "Radical Transparency", body: "The only way to trust an election is to verify it yourself. We're building a public, permanent audit trail that anyone can verify." },
  { icon: "⚡", title: "Speed Without Shortcuts", body: "Self-serve setup means you go live as soon as your voter list is ready — not by cutting corners, but by building reusable infrastructure that compounds with every election." },
];

export default function AboutPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* Hero */}
      <section className="section-pad pt-36 pb-16">
        <div className="max-w-site mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              className="label-tag mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            >
              About Baalot
            </motion.p>
            <h1 className="font-syne font-extrabold text-5xl md:text-6xl text-white mb-6 leading-tight">
              <SplitHeading text="Built where it matters most." mode="mount" />
            </h1>
            <motion.p
              className="text-muted text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Baalot started with a disputed student election and a question: why should democratic
              institutions in Africa run elections on paper and spreadsheets when the technology to do
              better already exists?
            </motion.p>
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Link
                href="/team"
                className="group relative inline-flex items-center px-6 py-3 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Meet the Team</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-white/20 font-semibold text-sm hover:border-white/50 transition-all duration-200"
              >
                Partner with Us
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {[
              // Verifiable facts only. Baalot has run no customer elections yet, so
              // there are no vote totals, turnout averages or incident counts to show.
              { value: "AES-256", label: "Ballot Encryption", accent: "#9B5DE5" },
              { value: "SHA-256", label: "Audit Chain",        accent: "#B27FF0" },
              { value: "3",    label: "Platforms",           accent: "#14B8A6" },
              { value: "1",    label: "Vote Per Identity",   accent: "#9B5DE5" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-6 rounded-2xl text-center"
                style={{
                  background: `${s.accent}10`,
                  border: `1px solid ${s.accent}25`,
                }}
              >
                <p className="font-syne font-extrabold text-4xl" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-muted text-xs mt-1 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-surface">
        <div className="max-w-site mx-auto">
          <SectionReveal variant="clip-up" className="text-center mb-12">
            <p className="label-tag mb-3">What We Stand For</p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-white">
              <SplitHeading text="Our values." />
            </h2>
          </SectionReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="flex gap-5 p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-3xl flex-shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-syne font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad bg-bg">
        <div className="max-w-3xl mx-auto">
          <SectionReveal variant="blur" className="text-center mb-12">
            <p className="label-tag mb-3">Our Story</p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-white">
              <SplitHeading text="From one disputed election to a platform." />
            </h2>
          </SectionReveal>
          <div className="relative">
            <div className="absolute left-[calc(theme(spacing.16)/2)] top-0 bottom-0 w-px bg-border" />
            <div className="flex flex-col gap-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  className="flex gap-8 items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                >
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-accent">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[calc(theme(spacing.8)+1px)] top-1 w-3 h-3 rounded-full bg-accent border-2 border-bg" />
                    <h3 className="font-syne font-bold text-white mb-1">{m.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
