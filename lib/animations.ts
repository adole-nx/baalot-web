// ─── Baalot Animation Variants ──────────────────────────────────
// All Framer Motion variant objects, easing constants, and transition presets.
// Import from here; never inline duplicates.

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
export const EASE_SHARP: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Entrance variants ─────────────────────────────────────────
export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeDown = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const slideLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_SPRING } },
};

export const scaleUp = {
  hidden:  { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: EASE_SPRING } },
};

// ─── Clip-path text reveal ─────────────────────────────────────
export const clipReveal = {
  hidden:  { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 1.0, ease: EASE },
  },
};

// ─── Stagger containers ────────────────────────────────────────
export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const staggerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerSlow = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } },
};

// ─── Row stagger (list items) ──────────────────────────────────
export const rowStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const rowItem = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

// ─── Page / section transitions ────────────────────────────────
export const pageEnter = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3, ease: EASE_SHARP } },
};

// ─── Tab content swap ──────────────────────────────────────────
export const tabContent = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: EASE_SHARP } },
};

// ─── Number tick (for CountUp) ─────────────────────────────────
export const numberReveal = {
  hidden:  { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

// ─── Utility: viewport config ─────────────────────────────────
export const VIEWPORT_ONCE = { once: true, margin: "-80px" };
export const VIEWPORT_REPEAT = { once: false, margin: "-120px" };
