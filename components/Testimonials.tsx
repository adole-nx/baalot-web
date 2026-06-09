"use client";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { EASE } from "@/lib/animations";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Baalot transformed our SUG election. 3,200 students voted in under 4 hours. Zero complaints, zero disputes. It felt like the future.",
    name: "Chukwuemeka Obi",
    role: "SUG President",
    org: "Nile University of Abuja",
    initial: "CO",
    accent: "#9B5DE5",
  },
  {
    quote: "The ZK proof audit report gave our board complete confidence. Every vote verified, every voter anonymous. This is what transparent governance looks like.",
    name: "Dr. Amaka Okonkwo",
    role: "Vice Chancellor",
    org: "Covenant University, Ota",
    initial: "AO",
    accent: "#14B8A6",
  },
  {
    quote: "We ran a national NGO election across 6 countries on Baalot. The real-time dashboard let our board follow every region simultaneously. Remarkable product.",
    name: "Adekunle Fashola",
    role: "Executive Director",
    org: "Pan-African Youth Alliance",
    initial: "AF",
    accent: "#9B5DE5",
  },
  {
    quote: "For the first time in our university's history, not a single student challenged the result. The blockchain receipt made everything verifiable. Students trusted it.",
    name: "Prof. Ibrahim Sule",
    role: "Dean of Student Affairs",
    org: "Bayero University, Kano",
    initial: "IS",
    accent: "#14B8A6",
  },
  {
    quote: "NIN verification meant we had absolute confidence in our voter list. Baalot handled 8,000 verified voters seamlessly. Setup took less than an afternoon.",
    name: "Ngozi Eze",
    role: "Electoral Committee Chair",
    org: "University of Lagos",
    initial: "NE",
    accent: "#9B5DE5",
  },
];

// ─── Single testimonial card ───────────────────────────────────
function TestimonialCard({ t, active }: { t: typeof testimonials[0]; active: boolean }) {
  return (
    <div
      className="relative rounded-2xl p-[1px] flex-shrink-0 transition-all duration-500"
      style={{
        width: "clamp(300px, 40vw, 440px)",
        background: active
          ? `linear-gradient(135deg, ${t.accent}30, rgba(255,255,255,0.06))`
          : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        boxShadow: active ? `0 0 40px ${t.accent}15` : "none",
      }}
    >
      <div
        className="h-full rounded-[calc(1rem-1px)] p-7 flex flex-col"
        style={{ background: "#0A0E15", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        {/* Quote icon */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-5 shrink-0"
          style={{ background: `${t.accent}12`, border: `1px solid ${t.accent}20` }}
        >
          <Quote size={14} style={{ color: t.accent }} />
        </div>

        {/* Quote text */}
        <p
          className="text-[14px] leading-relaxed flex-1"
          style={{ color: "#9AABB8", fontStyle: "italic" }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Attribution */}
        <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-syne font-bold text-[12px]"
            style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}25` }}
          >
            {t.initial}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-primary">{t.name}</p>
            <p className="text-[11px]" style={{ color: "#64748B" }}>{t.role}, {t.org}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const x = useMotionValue(0);
  const CARD_W = 460;

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const dir = info.offset.x < -60 ? 1 : info.offset.x > 60 ? -1 : 0;
    const next = Math.max(0, Math.min(testimonials.length - 1, activeIndex + dir));
    setActiveIndex(next);
    x.set(-(next * CARD_W));
  };

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: "#080C10" }}
    >
      {/* Header */}
      <div className="px-5 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-6xl mx-auto mb-12"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            Testimonials
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Trusted by people who can&apos;t afford to be wrong.
          </h2>
        </motion.div>
      </div>

      {/* Drag carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <div className="overflow-hidden pl-5 md:pl-10 lg:pl-16">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -(testimonials.length - 1) * CARD_W, right: 0 }}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragEnd={handleDragEnd}
            animate={{ x: -(activeIndex * CARD_W) }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex gap-4"
            style={{ cursor: "grab", userSelect: "none" }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} active={i === activeIndex} />
            ))}
          </motion.div>
        </div>

        {/* Fade mask right */}
        <div
          className="absolute inset-y-0 right-0 w-32 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080C10, transparent)" }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-8 px-5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 6,
              background: i === activeIndex ? "#9B5DE5" : "rgba(255,255,255,0.12)",
            }}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      {/* Drag hint */}
      <p className="text-center mt-4 text-[11px] tracking-wide" style={{ color: "#334155" }}>
        ← drag to explore →
      </p>
    </section>
  );
}
