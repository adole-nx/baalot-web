"use client";
import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

// ─── Africa SVG map with animated city dots ────────────────────
// Filled dots are Nigeria, where Baalot's early-access institutions are.
// The rest of the continent is where Baalot is expanding — not where it already runs.
const cities = [
  { name: "Lagos, Nigeria",         x: 195, y: 256, major: true  },
  { name: "Abuja, Nigeria",         x: 208, y: 244, major: true  },
  { name: "Accra, Ghana",           x: 185, y: 258, major: false },
  { name: "Nairobi, Kenya",         x: 288, y: 278, major: false },
  { name: "Cairo, Egypt",           x: 270, y: 155, major: false },
  { name: "Addis Ababa, Ethiopia",  x: 300, y: 254, major: false },
  { name: "Kampala, Uganda",        x: 282, y: 268, major: false },
  { name: "Dar es Salaam, Tanzania",x: 290, y: 296, major: false },
  { name: "Cape Town, S. Africa",   x: 234, y: 390, major: false },
  { name: "Dakar, Senegal",         x: 155, y: 228, major: false },
  { name: "Kigali, Rwanda",         x: 275, y: 274, major: false },
];

// Simplified Africa outline path (viewBox 0 0 400 450)
const AFRICA_PATH = `
M 188 15 L 200 12 L 218 14 L 232 18 L 248 24 L 264 32 L 278 42 L 290 54
L 300 68 L 308 84 L 316 100 L 322 116 L 328 132 L 334 148 L 338 164
L 342 180 L 346 196 L 350 212 L 352 228 L 352 244 L 350 260 L 346 276
L 340 292 L 332 308 L 322 322 L 310 336 L 296 348 L 282 360 L 268 370
L 256 380 L 244 390 L 234 398 L 225 406 L 216 412 L 208 416 L 200 418
L 192 416 L 184 412 L 176 406 L 168 398 L 160 388 L 153 376 L 148 362
L 144 348 L 140 334 L 136 318 L 132 302 L 128 286 L 122 270 L 116 254
L 110 238 L 106 222 L 103 206 L 101 190 L 101 174 L 102 158 L 104 142
L 108 126 L 114 110 L 121 96 L 130 82 L 140 70 L 150 58 L 160 48
L 170 38 L 180 28 L 187 20 Z
`;

function AfricaMap() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 450"
      className="w-full max-w-[380px] mx-auto"
      style={{ filter: "drop-shadow(0 0 40px rgba(155,93,229,0.08))" }}
      aria-label="Africa map showing Baalot election coverage"
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9B5DE5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9B5DE5" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Continent fill */}
      <path
        d={AFRICA_PATH}
        fill="rgba(155,93,229,0.04)"
        stroke="rgba(155,93,229,0.15)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Grid lines inside continent */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={`h${i}`}
          x1="100" y1={15 + i * 80} x2="360" y2={15 + i * 80}
          stroke="rgba(155,93,229,0.04)" strokeWidth="0.5"
        />
      ))}

      {/* City dots */}
      {cities.map((city, i) => (
        <g key={city.name}>
          {/* Ping ring */}
          {inView && (
            <circle
              cx={city.x} cy={city.y}
              r="6"
              fill="none"
              stroke="rgba(155,93,229,0.3)"
              strokeWidth="0.8"
              style={{
                animation: `city-ping 2.5s ease-out infinite`,
                animationDelay: `${i * 0.22}s`,
              }}
            />
          )}
          {/* Core dot */}
          <circle
            cx={city.x} cy={city.y}
            r={city.major ? 3.5 : 2.5}
            fill="#9B5DE5"
            filter="url(#glow)"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 0.08}s`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function StatsImpact() {
  return (
    <section
      className="py-24 px-5 md:px-10 lg:px-16 overflow-hidden"
      style={{ background: "#080C10" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16 text-center"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            Where Baalot runs
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Built for elections across the continent.
          </h2>
        </motion.div>

        {/* Single column. The old right-hand rail carried fabricated totals and a
            fake "live vote stream" of invented hashes, so the map now carries the
            section on its own. */}
        <div className="max-w-xl mx-auto">
          {/* Africa map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(155,93,229,0.06) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <AfricaMap />

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {[
                { label: "Institutions listed today", color: "#9B5DE5" },
                { label: "Where we’re expanding next", color: "rgba(155,93,229,0.3)" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px]" style={{ color: "#64748B" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
