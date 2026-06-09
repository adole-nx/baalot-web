import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Backgrounds ─────────────────────────────── */
        void:        "#030507",
        bg:          "#080C10",
        surface:     "#0D1117",
        elevated:    "#111820",
        border:      "rgba(255,255,255,0.06)",

        /* ── Baalot Purple — primary (matches app #9B5DE5) ── */
        amber: {
          400: "#B27FF0",
          500: "#9B5DE5",
          glow: "rgba(155,93,229,0.15)",
          intense: "rgba(155,93,229,0.35)",
        },

        /* ── Civic Teal — secondary ──────────────────── */
        teal: {
          500: "#14B8A6",
          glow: "rgba(20,184,166,0.12)",
        },

        /* ── Vote Red ────────────────────────────────── */
        vote: {
          red:  "#EF4444",
          glow: "rgba(239,68,68,0.12)",
        },

        /* ── Text ────────────────────────────────────── */
        primary:   "#F0F4F8",
        secondary: "#64748B",
        muted:     "#334155",

        /* ── Convenience aliases ─────────────────────── */
        accent:      "#9B5DE5",
        "accent-dim": "rgba(155,93,229,0.15)",
        "accent-glow": "rgba(155,93,229,0.35)",

        /* Legacy (keep for pages that reference them) */
        paper:       "#FFFFFF",
        "paper-2":   "#F5F4EF",
        ink:         "#0D0D0D",
        "ink-2":     "#374151",
      },

      fontFamily: {
        syne:  ["var(--font-syne)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },

      fontSize: {
        "display": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.75rem, 5.5vw, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
        "h2": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },

      backgroundImage: {
        "amber-radial":  "radial-gradient(ellipse at 50% 80%, rgba(155,93,229,0.12) 0%, transparent 70%)",
        "teal-radial":   "radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.08) 0%, transparent 60%)",
        "void-gradient": "linear-gradient(to bottom, #030507, #080C10)",
        "card-border":   "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
      },

      boxShadow: {
        "amber":      "0 0 60px rgba(155,93,229,0.15)",
        "amber-lg":   "0 0 120px rgba(155,93,229,0.20)",
        "teal":       "0 0 60px rgba(20,184,166,0.12)",
        "card":       "0 1px 0 rgba(255,255,255,0.06) inset",
        "glow-amber": "0 8px 40px rgba(155,93,229,0.25), 0 0 0 1px rgba(155,93,229,0.15)",
      },

      animation: {
        marquee:           "marquee 35s linear infinite",
        "marquee-left":    "marquee 50s linear infinite",
        "marquee-right":   "marquee-right 50s linear infinite",
        "gradient-pan":    "gradient-pan 5s linear infinite",
        "shimmer-sweep":   "shimmer-sweep 0.65s ease-out forwards",
        "sovereignty-glow":"sovereignty-glow 3s ease-in-out infinite",
        "float-a":         "float-a 58s ease-in-out infinite",
        "float-b":         "float-b 72s ease-in-out infinite",
        "iris-spin":       "iris-spin 8s linear infinite",
        "city-ping":       "city-ping 2s ease-out infinite",
        "amber-pulse":     "purple-glow-pulse 3s ease-in-out infinite",
        "cursor-blink":    "blink-cursor 1.1s step-end infinite",
        "node-pulse":      "node-pulse 2s ease-in-out infinite",
      },

      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-a": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(50px,-70px) scale(1.08)" },
          "66%":     { transform: "translate(-40px,50px) scale(0.95)" },
        },
        "float-b": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "40%":     { transform: "translate(-60px,40px) scale(1.12)" },
          "80%":     { transform: "translate(30px,-50px) scale(0.92)" },
        },
        "iris-spin": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "city-ping": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "75%":  { transform: "scale(2.5)", opacity: "0" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "purple-glow-pulse": {
          "0%,100%": { boxShadow: "0 0 20px rgba(155,93,229,0.15), 0 0 40px rgba(155,93,229,0.08)" },
          "50%":     { boxShadow: "0 0 30px rgba(155,93,229,0.35), 0 0 60px rgba(155,93,229,0.15)" },
        },
        "blink-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        "node-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "1", transform: "scale(1.3)" },
        },
        "marquee-right": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "gradient-pan": {
          "0%":   { backgroundPosition: "0% center" },
          "50%":  { backgroundPosition: "100% center" },
          "100%": { backgroundPosition: "0% center" },
        },
        "shimmer-sweep": {
          "0%":   { transform: "translateX(-100%) skewX(-12deg)", opacity: "0.8" },
          "100%": { transform: "translateX(250%) skewX(-12deg)", opacity: "0" },
        },
        "sovereignty-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
