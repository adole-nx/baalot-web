"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTubeEmbed from "./YouTubeEmbed";

const tabs = [
  {
    id: "paper",
    tab: "Paper ballots are broken",
    heading: "Manual counting errors cost trust",
    body: "Ballot stuffing, miscounts, and no audit trail destroy confidence in results. Students and members stop caring — or worse, they protest.",
    cta: "See how Baalot fixes this →",
    // "Blockchain Voting Explained For Beginners!" — simple accessible explainer
    youtubeId: "m7mZybTRpT0",
  },
  {
    id: "digital",
    tab: "Digital tools aren't built for elections",
    heading: "Google Forms isn't an election platform",
    body: "Generic tools have no voter verification, no anonymity, and no tamper-evident record. One IT admin can change results with a spreadsheet edit.",
    cta: "See how Baalot secures the vote →",
    // "How can technology enable mobile voting? Blockchain Voting"
    youtubeId: "t_ZMHQkyysk",
  },
  {
    id: "scale",
    tab: "Scaling elections is a logistical nightmare",
    heading: "3,000 voters, 1 admin, no system",
    body: "Without the right infrastructure, large elections become chaotic — long queues, disqualified voters, contested results. Baalot automates the hard parts.",
    cta: "See how Baalot scales →",
    // "TUTORIAL ON THE NEW ELECTRONIC VOTING SYSTEM AND PROCESS"
    youtubeId: "iRcXtME7Y0E",
  },
];

export default function PainSolution() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="section-pad bg-bg text-white">
      <div className="max-w-site mx-auto">
        <motion.h2
          className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-16 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Running elections is hard. It shouldn&apos;t be.
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: tabs + content */}
          <div>
            <div className="space-y-1 mb-10">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                    active === i
                      ? "bg-surface border border-accent/40 text-white"
                      : "text-muted hover:text-white hover:bg-surface/50"
                  }`}
                >
                  <span
                    className={`w-0.5 h-8 rounded-full flex-shrink-0 transition-colors duration-200 ${
                      active === i ? "bg-accent" : "bg-border"
                    }`}
                  />
                  <span className="text-sm font-medium leading-tight">{t.tab}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-syne font-bold text-2xl text-white mb-4">
                  {tabs[active].heading}
                </h3>
                <p className="text-muted leading-relaxed mb-6">{tabs[active].body}</p>
                <a href="#contact" className="text-accent hover:text-white transition-colors text-sm font-semibold">
                  {tabs[active].cta}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: YouTube embed panel — crossfades on tab change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <YouTubeEmbed
                videoId={tabs[active].youtubeId}
                title={tabs[active].heading}
                label={tabs[active].tab}
                aspectRatio="16/9"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
