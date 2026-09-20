"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const team = [
  {
    name: "Adole Daniel Inalegwu",
    role: "Founder & CEO",
    initials: "AD",
    color: "#3B6EF8",
    photo: "", // real headshot pending - initials render until then
    linkedin: "https://linkedin.com/in/adole-daniel-inalegwu",
  },
  {
    name: "Elie",
    role: "Team Member",
    initials: "EL",
    color: "#10B981",
    photo: "", // real headshot pending - initials render until then
    linkedin: "/contact",
  },
];

function Avatar({ member }: { member: typeof team[0] }) {
  const [error, setError] = useState(false);
  return (
    <div
      className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2"
      style={{ borderColor: `${member.color}50` }}
    >
      {!error && member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="96px"
          className="object-cover object-top"
          onError={() => setError(true)}
          unoptimized
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-syne font-bold text-lg"
          style={{ background: `${member.color}20`, color: member.color }}
        >
          {member.initials}
        </div>
      )}
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="section-pad bg-paper border-b border-light-border overflow-hidden">
      <div className="max-w-site mx-auto">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <motion.p className="label-tag-ink mb-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              The Team
            </motion.p>
            <motion.h2
              className="font-syne font-extrabold text-4xl md:text-5xl text-ink"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Meet the Team
            </motion.h2>
            <motion.p
              className="text-muted mt-3 max-w-md"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A small, focused team building election infrastructure for Africa.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/team" className="text-sm text-muted hover:text-ink transition-colors">
              Meet everyone →
            </Link>
          </motion.div>
        </div>

        {/* Card grid — 2 members, centered */}
        <div className="grid grid-cols-2 max-w-sm mx-auto gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center text-center p-4 rounded-2xl transition-colors duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Photo avatar */}
              <Avatar member={member} />

              <p className="font-semibold text-white text-sm leading-tight mb-1">{member.name}</p>
              <p className="text-muted text-xs mb-3">{member.role}</p>

              <Link
                href={member.linkedin}
                target={member.linkedin.startsWith("http") ? "_blank" : undefined}
                rel={member.linkedin.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex text-muted hover:text-white transition-colors"
                aria-label={`${member.name} LinkedIn`}
              >
                <LinkedinIcon />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-muted text-sm mt-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-white font-semibold">2 builders</span> · <span className="text-white font-semibold">3 universities piloting</span> · <span className="text-white font-semibold">1 mission</span>
        </motion.p>
      </div>
    </section>
  );
}
