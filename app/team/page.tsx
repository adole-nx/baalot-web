"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SplitHeading from "@/components/SplitHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const team = [
  {
    id: "adole",
    name: "Adole Daniel Inalegwu",
    role: "Founder & CEO",
    bio: "Adole built Baalot from a single conviction: African institutions deserve election infrastructure that cannot be corrupted. He leads product vision, investor relations, and institutional partnerships — driving Baalot from a university pilot to a pan-African platform.",
    photo: "https://images.unsplash.com/photo-29pFbI_D1Sc?w=700&h=875&q=88&fit=crop&auto=format",
    linkedin: "https://linkedin.com/in/adole-daniel-inalegwu",
    accent: "#9B5DE5",
    tag: "Leadership",
    skills: ["Product Strategy", "Election Systems", "Partnerships"],
  },
  {
    id: "elie",
    name: "Elie",
    role: "Team Member",
    bio: "Elie is a core member of the Baalot team, helping build election infrastructure that African institutions can trust. Committed to the mission of transparent, verifiable democracy across the continent.",
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=700&h=875&fit=crop",
    linkedin: "/contact",
    accent: "#14B8A6",
    tag: "Team",
    skills: ["Operations", "Strategy", "Execution"],
  },
];

// ─── Photo card with fallback ─────────────────────────────────────────────────
function PhotoCard({ member, priority = false }: { member: typeof team[0]; priority?: boolean }) {
  const [error, setError] = useState(false);
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${member.accent}25` }}
    >
      {!error ? (
        <>
          <Image
            src={member.photo}
            alt={member.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={() => setError(true)}
            unoptimized
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/4"
            style={{ background: `linear-gradient(to top, ${member.accent}15, transparent)` }}
          />
        </>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-syne font-bold text-6xl"
          style={{ background: `${member.accent}12`, color: member.accent }}
        >
          {member.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>
      )}

      {/* Role tag on photo */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
        style={{
          background: `${member.accent}25`,
          color: member.accent,
          border: `1px solid ${member.accent}35`,
        }}
      >
        {member.tag}
      </div>
    </div>
  );
}

// ─── Member card (alternating layout) ────────────────────────────────────────
function MemberCard({ member, i }: { member: typeof team[0]; i: number }) {
  const isLeft = i % 2 === 0;

  return (
    <motion.div
      className="group grid md:grid-cols-2 gap-8 lg:gap-20 items-center"
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {/* Photo side */}
      <div className={`aspect-[4/5] ${isLeft ? "md:order-1" : "md:order-2"}`}>
        <PhotoCard member={member} priority={i === 0} />
      </div>

      {/* Text side */}
      <div className={`${isLeft ? "md:order-2" : "md:order-1"}`}>
        {/* Number */}
        <p
          className="font-syne font-extrabold text-8xl leading-none mb-4 select-none"
          style={{ color: `${member.accent}15` }}
        >
          {String(i + 1).padStart(2, "0")}
        </p>

        <p className="label-tag mb-2" style={{ color: member.accent }}>
          {member.role}
        </p>

        <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-5 leading-tight">
          {member.name}
        </h2>

        <p className="text-muted leading-relaxed mb-6 text-sm md:text-base">
          {member.bio}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {member.skills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${member.accent}12`,
                color: member.accent,
                border: `1px solid ${member.accent}28`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={member.linkedin}
          target={member.linkedin.startsWith("http") ? "_blank" : undefined}
          rel={member.linkedin.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/5"
          style={{
            border: `1px solid ${member.accent}35`,
            color: member.accent,
          }}
        >
          <LinkedInIcon />
          {member.linkedin.startsWith("http") ? "View on LinkedIn" : "Join this role →"}
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <main className="bg-bg min-h-screen">

      {/* Hero */}
      <section className="section-pad pt-36 pb-8">
        <div className="max-w-site mx-auto text-center">
          <motion.p
            className="label-tag mb-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            The Team
          </motion.p>

          <h1 className="font-syne font-extrabold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-[0.95]">
            <SplitHeading text="The builders behind the ballot." mode="mount" />
          </h1>

          <motion.p
            className="text-muted text-lg max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A small, focused team building the election infrastructure Africa deserves.
          </motion.p>

          {/* Glassmorphism stat strip */}
          <motion.div
            className="inline-flex flex-wrap justify-center gap-8 px-8 py-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {[["2", "Team Members"], ["3", "Universities"], ["1", "Mission"]].map(([val, lbl]) => (
              <div key={lbl} className="text-center min-w-[80px]">
                <p className="font-syne font-extrabold text-3xl text-white">{val}</p>
                <p className="text-xs text-muted uppercase tracking-widest mt-1">{lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Thumbnails strip — quick visual preview of all 6 */}
      <section className="py-10 overflow-hidden">
        <div className="max-w-site mx-auto px-5 md:px-10">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
            {team.map((member, i) => (
              <motion.a
                key={member.id}
                href={`#${member.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="flex-shrink-0 snap-start group"
              >
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden"
                  style={{ border: `1.5px solid ${member.accent}35` }}
                >
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                    onError={() => {}}
                    unoptimized
                  />
                </div>
                <p className="text-[9px] text-muted text-center mt-1.5 max-w-[80px] truncate">{member.role}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Full spotlight cards */}
      <section className="section-pad pt-4 bg-bg">
        <div className="max-w-site mx-auto flex flex-col gap-24 lg:gap-36">
          {team.map((member, i) => (
            <div key={member.id} id={member.id}>
              <MemberCard member={member} i={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="section-pad bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="text-3xl mb-4">🌍</p>
            <p className="label-tag mb-4">We&apos;re hiring</p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-white mb-4">
              Build the future of African democracy.
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              If you believe every vote should count — and want to write the code that makes it so — we want to hear from you.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Get in Touch</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
