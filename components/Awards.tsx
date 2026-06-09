"use client";

import { motion } from "framer-motion";

// TODO: replace with real award logos when available
const awards = [
  { icon: "🏆", name: "Top EdTech Startup", platform: "TechPoint Africa 2024" },
  { icon: "🥇", name: "Best Civic Tech Tool", platform: "Google for Startups Nigeria" },
  { icon: "⭐", name: "Featured Product", platform: "Product Hunt" },
  { icon: "🎓", name: "University Innovation Award", platform: "Nile University 2024" },
  { icon: "🌍", name: "Africa Tech Rising", platform: "Techcabal 2024" },
  { icon: "🛡️", name: "Blockchain Integrity Award", platform: "Web3Africa Summit" },
  { icon: "📱", name: "Best Mobile Civic App", platform: "DevFest Lagos 2024" },
];

export default function Awards() {
  return (
    <section className="section-pad bg-paper border-t border-light-border">
      <div className="max-w-site mx-auto">
        <motion.p
          className="label-tag-ink text-center mb-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          Recognition
        </motion.p>

        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #FFFFFF, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #FFFFFF, transparent)" }} />

          <div className="flex animate-marquee">
            {[...awards, ...awards].map((a, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-4 mx-8 py-4"
              >
                <div className="w-10 h-10 rounded-xl bg-paper-2 border border-light-border flex items-center justify-center text-xl">
                  {a.icon}
                </div>
                <div>
                  <p className="text-ink text-sm font-semibold whitespace-nowrap">{a.name}</p>
                  <p className="text-muted text-xs whitespace-nowrap">{a.platform}</p>
                </div>
                <div className="w-px h-8 bg-light-border ml-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
