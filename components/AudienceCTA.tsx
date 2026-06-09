"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Smartphone, Code2, ArrowUpRight } from "lucide-react";
import { EASE, staggerContainer, fadeUp } from "@/lib/animations";

const AUDIENCES = [
  {
    icon: Building2,
    accent: "#9B5DE5",
    eyebrow: "For Institutions",
    headline: "Run your next election on Baalot",
    body: "For universities, student unions, NGOs, and enterprises that need verifiable, tamper-proof results.",
    cta: "Book a Demo",
    href: "/contact",
    external: false,
  },
  {
    icon: Smartphone,
    accent: "#14B8A6",
    eyebrow: "For Voters",
    headline: "Your vote, your receipt, your proof",
    body: "Download the Baalot app, verify your identity once, and vote in any election at your institution.",
    cta: "Download the App",
    href: "https://play.google.com/store",
    external: true,
  },
  {
    icon: Code2,
    accent: "#B27FF0",
    eyebrow: "For Developers",
    headline: "Build on the BBC blockchain",
    body: "Full REST API, BBC chain SDK, and on-chain verification tools. Integrate Baalot into your platform.",
    cta: "Read the Docs",
    href: "/docs",
    external: false,
  },
] as const;

export default function AudienceCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-pad"
      style={{ background: "#030507" }}
    >
      <div className="max-w-site mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14"
        >
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            One platform. Three ways to use it.
          </h2>
          <p className="mt-4 text-[15px] max-w-md mx-auto" style={{ color: "#64748B" }}>
            Whether you run the election, vote in it, or build on top of it - Baalot has a path for you.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {AUDIENCES.map((audience) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={audience.eyebrow}
                variants={fadeUp}
                className="card-dark card-glow flex flex-col p-7 rounded-2xl"
                style={{
                  background: "#0A0E16",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{
                    background: `${audience.accent}14`,
                    border: `1px solid ${audience.accent}22`,
                  }}
                >
                  <Icon size={20} style={{ color: audience.accent }} strokeWidth={1.8} />
                </div>

                {/* Eyebrow */}
                <p
                  className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
                  style={{ color: audience.accent }}
                >
                  {audience.eyebrow}
                </p>

                {/* Headline */}
                <h3
                  className="font-syne font-bold text-primary mb-3 leading-tight"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.25rem)" }}
                >
                  {audience.headline}
                </h3>

                {/* Body */}
                <p className="text-[14px] leading-relaxed flex-1 mb-7" style={{ color: "#64748B" }}>
                  {audience.body}
                </p>

                {/* CTA */}
                {audience.external ? (
                  <a
                    href={audience.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer group inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[13px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `${audience.accent}14`,
                      border: `1px solid ${audience.accent}28`,
                      color: audience.accent,
                    }}
                  >
                    {audience.cta}
                    <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <Link
                    href={audience.href}
                    className="btn-shimmer group inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[13px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `${audience.accent}14`,
                      border: `1px solid ${audience.accent}28`,
                      color: audience.accent,
                    }}
                  >
                    {audience.cta}
                    <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
