"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { EASE } from "@/lib/animations";

interface Tweet {
  handle: string;
  name: string;
  text: string;
  time: string;
  likes: number;
  avatar: string;
  accent: string;
}

// Fabricated testimonials removed during the honesty pass: every entry named a
// real person or institution and asserted unbuilt blockchain/on-chain/ZK
// capabilities plus invented metrics (turnout %, vote counts, "zero disputes").
// No honest replacement is possible without real, consented quotes, so the data
// arrays are intentionally empty and this component renders nothing.
const ROW_A: Tweet[] = [];

const ROW_B: Tweet[] = [];

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div
      className="card-dark card-glow flex-shrink-0 w-[300px] md:w-[340px] p-5 flex flex-col gap-3 select-none"
      style={{ background: "#0A0E16" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-bold text-[11px] flex-shrink-0"
            style={{
              background: `${tweet.accent}18`,
              color: tweet.accent,
              border: `1px solid ${tweet.accent}28`,
            }}
          >
            {tweet.avatar}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-primary leading-tight">{tweet.name}</p>
            <p className="text-[11px] leading-tight" style={{ color: "#4B5563" }}>{tweet.handle}</p>
          </div>
        </div>
        {/* X mark */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#374151", flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      </div>

      {/* Tweet text */}
      <p
        className="text-[13px] leading-[1.6] flex-1"
        style={{ color: "#8B9AB0" }}
      >
        {tweet.text}
      </p>

      {/* Footer */}
      <div
        className="flex items-center gap-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[11px]" style={{ color: "#374151" }}>{tweet.time}</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <Heart size={12} style={{ color: "#EF4444" }} />
          <span className="text-[11px]" style={{ color: "#6B7280" }}>{tweet.likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ tweets, direction }: { tweets: Tweet[]; direction: "left" | "right" }) {
  const doubled = [...tweets, ...tweets];
  return (
    <div className="overflow-hidden relative">
      {/* Fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #080C10, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #080C10, transparent)" }}
        aria-hidden="true"
      />
      <div
        className={`flex gap-4 w-max py-2 ${direction === "left" ? "marquee-left" : "marquee-right"}`}
      >
        {doubled.map((tweet, i) => (
          <TweetCard key={`${tweet.handle}-${i}`} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}

export default function TweetWall() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // No consented testimonials to show — render nothing rather than fabricate.
  if (ROW_A.length === 0 && ROW_B.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: "#080C10" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="px-5 md:px-10 lg:px-16 max-w-6xl mx-auto mb-12"
      >
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
          Testimonials
        </p>
        <h2
          className="font-syne font-bold text-primary max-w-xl"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          Trusted by people who can&apos;t afford to be wrong.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed max-w-lg" style={{ color: "#64748B" }}>
          Real quotes from institutions running elections on Baalot will appear here.
        </p>
      </motion.div>

      {/* Row 1 - scrolls left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="mb-4"
      >
        <MarqueeRow tweets={ROW_A} direction="left" />
      </motion.div>

      {/* Row 2 - scrolls right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
      >
        <MarqueeRow tweets={ROW_B} direction="right" />
      </motion.div>
    </section>
  );
}
