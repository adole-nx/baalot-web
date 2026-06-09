"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplitHeading from "./SplitHeading";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.location.href = `mailto:hello@baalot.site?subject=Early Access Request&body=Email: ${email}`;
    setSubmitted(true);
  };

  return (
    <section id="cta" ref={ref} className="relative overflow-hidden section-pad">
      {/* Gradient bg */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0A0E1A 0%, #0F1E4A 55%, #1a3580 100%)" }}
        aria-hidden="true"
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />
      {/* Glow orb */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(59,110,248,0.18) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-widest text-accent mb-5"
        >
          Early Access
        </motion.p>

        <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          <SplitHeading text="Bring Transparent Elections to Your Institution." />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-muted text-lg mb-10 max-w-lg mx-auto"
        >
          Baalot is in early access. Be among the first institutions to run a tamper-proof election.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {submitted ? (
            <div className="bg-accent/10 border border-accent/30 rounded-2xl px-8 py-6">
              <p className="text-accent font-semibold text-lg">Request sent!</p>
              <p className="text-muted text-sm mt-1">We&apos;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@institution.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-muted text-sm outline-none focus:border-accent/60 transition-colors"
              />
              <button
                type="submit"
                className="group relative px-6 py-4 rounded-xl bg-gold text-base font-semibold text-sm whitespace-nowrap overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative">Request Early Access</span>
              </button>
            </form>
          )}

          <p className="text-muted text-xs mt-5">
            No commitment required. We&apos;ll reach out within 24 hours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
