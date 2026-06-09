"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Feature {
  num: string;
  title: string;
  desc: string;
  youtubeId: string;
}

const featureTabs: Record<string, Feature[]> = {
  "For Universities": [
    {
      num: "01", title: "Voter Registration",
      desc: "Upload student lists, verify via matric number or email.",
      // "Online Voting System" — shows the voter registration UX
      youtubeId: "iuN4h2_v6AI",
    },
    {
      num: "02", title: "Ballot Builder",
      desc: "Drag-and-drop ballot creation for any election type.",
      // "TUTORIAL ON THE NEW ELECTRONIC VOTING SYSTEM AND PROCESS"
      youtubeId: "iRcXtME7Y0E",
    },
    {
      num: "03", title: "Live Results Dashboard",
      desc: "Real-time vote tallying visible to all stakeholders.",
      // "Blockchain Voting" — clean explainer
      youtubeId: "J1V4bTN6sYI",
    },
  ],
  "For Organizations": [
    {
      num: "01", title: "Member Verification",
      desc: "Verify voters against membership databases.",
      youtubeId: "iuN4h2_v6AI",
    },
    {
      num: "02", title: "Anonymous Voting",
      desc: "ZK proof-based anonymity — no one can link vote to voter.",
      // "What Is Zero Knowledge Proof? (ZKP) - Explainer With Animation"
      youtubeId: "qMeNNjCQJG8",
    },
    {
      num: "03", title: "Audit Trail",
      desc: "Every action logged on-chain and downloadable as PDF.",
      // "Real World Blockchain Applications - Voting"
      youtubeId: "0BrKt26OwW8",
    },
    {
      num: "04", title: "Multi-Role Access",
      desc: "Admins, observers, candidates — each see only what they should.",
      youtubeId: "iRcXtME7Y0E",
    },
    {
      num: "05", title: "Dispute Resolution",
      desc: "On-chain evidence for any challenge or recount request.",
      // "What is Blockchain? How Elections on Blockchain work?" — Dhruv Rathee
      youtubeId: "ENrjn-lD1e8",
    },
  ],
  "For Government": [
    {
      num: "01", title: "NIN/BVN Integration",
      desc: "Voter identity verified via Nigeria's national ID infrastructure.",
      // "Nigeria's Election Process: Experts In Tech Increase Calls For E-Voting"
      youtubeId: "v7inQSORNl4",
    },
    {
      num: "02", title: "USSD Fallback",
      desc: "Voters without smartphones can vote via *384#-style USSD.",
      // "How Does Mobile Voting Work? - Animated Explainer"
      youtubeId: "-cuJ8lIp2BQ",
    },
    {
      num: "03", title: "INEC-Compatible Reports",
      desc: "Export results in formats compatible with electoral commission requirements.",
      youtubeId: "v7inQSORNl4",
    },
    {
      num: "04", title: "Scalable Node Network",
      desc: "Voters as distributed nodes — no central attack surface.",
      // "What is Blockchain? How Elections on Blockchain work?"
      youtubeId: "ENrjn-lD1e8",
    },
  ],
};

const tabKeys = Object.keys(featureTabs);

interface FeatureCardProps { feat: Feature; i: number; }

function FeatureCard({ feat, i }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${feat.youtubeId}/mqdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-bg border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-[0_0_24px_rgba(59,110,248,0.08)] transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* YouTube thumbnail */}
      <div className="relative overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        <Image
          src={thumbUrl}
          alt={feat.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          unoptimized
        />
        <div className={`absolute inset-0 bg-bg/40 transition-opacity duration-300 ${hovered ? "opacity-20" : "opacity-60"}`} />
        {/* Number label */}
        <span className={`absolute top-3 left-3 font-syne font-bold text-2xl transition-colors duration-300 ${hovered ? "text-gold" : "text-white/20"}`}>
          {feat.num}
        </span>
        {/* Play hint on hover */}
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href={`https://www.youtube.com/watch?v=${feat.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm"
              aria-label={`Watch ${feat.title} on YouTube`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                <path d="M0 0l12 7-12 7z"/>
              </svg>
            </a>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-syne font-bold text-white mb-1">{feat.title}</h3>
        <p className="text-muted text-sm leading-relaxed mb-3">{feat.desc}</p>
        <a href="#contact" className="text-xs text-accent hover:text-white transition-colors">Explore →</a>
      </div>
    </motion.div>
  );
}

export default function FeaturesGrid() {
  const [activeTab, setActiveTab] = useState(tabKeys[0]);

  return (
    <section id="features" className="section-pad bg-paper border-b border-light-border">
      <div className="max-w-site mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <motion.p className="label-tag-ink mb-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Platform Features
            </motion.p>
            <motion.h2
              className="font-syne font-extrabold text-4xl md:text-5xl text-ink"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Everything a fair election needs
            </motion.h2>
          </div>
          <a href="#contact" className="text-sm text-muted hover:text-ink transition-colors whitespace-nowrap">
            Explore all features →
          </a>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {tabKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-accent text-white shadow-[0_4px_16px_rgba(59,110,248,0.3)]"
                  : "bg-paper-2 border border-light-border text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {featureTabs[activeTab].map((feat, i) => (
              <FeatureCard key={feat.num + feat.title} feat={feat} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
