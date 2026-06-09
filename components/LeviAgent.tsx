"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

// ── Tour stops — specific key factors per section ─────────────────────────────
const TOUR_STOPS = [
  {
    id: 0,
    selector: '[data-levi-stop="0"]',
    text: "Hey, I'm Levi. Baalot runs elections on the blockchain — every vote a transaction, every result provably true. Scroll to see how it works.",
  },
  {
    id: 1,
    selector: '[data-levi-stop="1"]',
    text: "Voters open the app, find their institution, and tap once to cast a sealed ballot. Results update live — no waiting, no disputes.",
  },
  {
    id: 2,
    selector: '[data-levi-stop="2"]',
    text: "ZK proofs verify your vote without exposing who you voted for. NIN/BVN links each ballot to a real person — ghost voters can't get in.",
  },
  {
    id: 3,
    selector: '[data-levi-stop="3"]',
    text: "₦150,000 flat — whether you have 50 voters or 50,000. No per-seat fees, no hidden charges. First election is on us.",
  },
  {
    id: 4,
    selector: '[data-levi-stop="4"]',
    text: "That's Baalot. Book a demo call and we'll set up your first election together — free, no commitment needed. 🗳️",
  },
] as const;

type TourStop = (typeof TOUR_STOPS)[number];
type AgentState = "hidden" | "speaking" | "collapsed" | "dismissed";

// ── Section Highlight ─────────────────────────────────────────────────────────
function SectionHighlight({ stop }: { stop: TourStop }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const el = document.querySelector(stop.selector);
    if (!el) return;
    setRect(el.getBoundingClientRect());
  }, [stop.selector]);

  useEffect(() => {
    updateRect();
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect]);

  if (!rect) return null;

  const PAD = 10;

  return (
    <>
      {/* Dim overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 7900,
          background: "rgba(3,5,7,0.44)",
          pointerEvents: "none",
        }}
      />
      {/* Highlight ring */}
      <motion.div
        key={`hl-${stop.id}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
          zIndex: 7950,
          borderRadius: 14,
          pointerEvents: "none",
          boxShadow:
            "0 0 0 2px rgba(155,93,229,0.5), 0 0 0 5px rgba(155,93,229,0.1), 0 0 80px rgba(155,93,229,0.18)",
        }}
      />
    </>
  );
}

// ── Speech Bubble ─────────────────────────────────────────────────────────────
function SpeechBubble({
  stop,
  open,
  isMobile,
  onNext,
  onSkip,
}: {
  stop: TourStop;
  open: boolean;
  isMobile: boolean;
  onNext: () => void;
  onSkip: () => void;
}) {
  const { displayed } = useTypewriter(stop.text, 18, open);
  const isLast = stop.id === TOUR_STOPS.length - 1;

  const bubbleStyle: React.CSSProperties = isMobile
    ? { position: "fixed", bottom: 88, left: 14, right: 14, zIndex: 8001 }
    : { position: "absolute", bottom: "calc(100% + 14px)", right: 0, width: 284 };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key={`bubble-${stop.id}`}
          initial={{ opacity: 0, scale: 0.85, rotateX: -12, y: 16 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, rotateX: 8, y: 10 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          style={{
            transformPerspective: 800,
            transformOrigin: "bottom center",
            ...bubbleStyle,
          }}
        >
          <div
            style={{
              background: "rgba(8,12,16,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(155,93,229,0.26)",
              borderRadius: 18,
              padding: "15px 17px 13px",
              boxShadow:
                "0 0 0 1px rgba(155,93,229,0.08), 0 20px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#9B5DE5",
                  boxShadow: "0 0 8px rgba(155,93,229,0.9)",
                  animation: "purple-glow-pulse 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#B27FF0",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Levi AI
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.22)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {stop.id + 1} / {TOUR_STOPS.length}
              </span>
            </div>

            {/* Typewriter text */}
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 13px",
                fontFamily: "var(--font-inter)",
                minHeight: 58,
              }}
            >
              {displayed}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "0.9em",
                  background: "#9B5DE5",
                  marginLeft: 2,
                  verticalAlign: "text-bottom",
                  animation: "blink-cursor 0.8s step-end infinite",
                }}
              />
            </p>

            {/* Progress pills */}
            <div style={{ display: "flex", gap: 4, marginBottom: 13, alignItems: "center" }}>
              {TOUR_STOPS.map((s) => (
                <motion.div
                  key={s.id}
                  animate={{
                    width: s.id === stop.id ? 16 : 5,
                    background:
                      s.id === stop.id
                        ? "#9B5DE5"
                        : s.id < stop.id
                        ? "rgba(155,93,229,0.42)"
                        : "rgba(255,255,255,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ height: 5, borderRadius: 3 }}
                />
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={onSkip}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.32)",
                  fontSize: 12,
                  cursor: "pointer",
                  padding: "4px 0",
                  fontFamily: "var(--font-inter)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.32)")}
              >
                Skip tour
              </button>
              <motion.button
                onClick={onNext}
                whileHover={{ scale: 1.05, boxShadow: "0 6px 22px rgba(155,93,229,0.5)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(135deg, #9B5DE5 0%, #7B3DC9 100%)",
                  border: "none",
                  borderRadius: 9,
                  padding: "7px 16px",
                  color: "#fff",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                  boxShadow: "0 4px 14px rgba(155,93,229,0.36)",
                }}
              >
                {isLast ? "Got it ✓" : "Next →"}
              </motion.button>
            </div>
          </div>

          {/* Tail — desktop only */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: -6,
                right: 22,
                width: 12,
                height: 12,
                background: "rgba(8,12,16,0.95)",
                border: "1px solid rgba(155,93,229,0.26)",
                transform: "rotate(45deg)",
                borderTop: "none",
                borderLeft: "none",
                zIndex: -1,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Levi Orb ──────────────────────────────────────────────────────────────────
function LeviOrb({
  speaking,
  bubbleOpen,
  isScrolling,
  isMobile,
  onClick,
}: {
  speaking: boolean;
  bubbleOpen: boolean;
  isScrolling: boolean;
  isMobile: boolean;
  onClick: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const eyeX = useSpring(mouseX, { stiffness: 180, damping: 18 });
  const eyeY = useSpring(mouseY, { stiffness: 180, damping: 18 });

  useEffect(() => {
    if (isMobile) return;
    const handle = (e: MouseEvent) => {
      const nx = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 3;
      const ny = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 3;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY, isMobile]);

  // Reduced sizes — more compact and subtle
  const outer = isMobile ? 44 : 52;
  const mid   = isMobile ? 34 : 40;
  const inner = isMobile ? 26 : 30;

  return (
    <div
      className="animate-float-b"
      style={{ position: "relative", width: outer, height: outer, cursor: "pointer", flexShrink: 0 }}
      onClick={onClick}
      title="Levi AI Guide"
    >
      {/* Scroll-active pulsing ring — appears when user is scrolling */}
      <AnimatePresence>
        {isScrolling && (
          <motion.div
            key="scroll-ring"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.45, 1.7], opacity: [0.7, 0.35, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "2px solid rgba(155,93,229,0.7)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Outer dashed spinning ring — transparent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px dashed rgba(155,93,229,0.22)",
          transform: "rotateX(14deg)",
          transformStyle: "preserve-3d",
          animation: `iris-spin ${speaking ? "3.5s" : "10s"} linear infinite`,
        }}
      />

      {/* Middle glow ring — low opacity baseline */}
      <motion.div
        animate={{
          scale: speaking ? [1, 1.16, 1] : isScrolling ? [1, 1.1, 1] : [1, 1.04, 1],
          opacity: speaking ? [0.6, 0.9, 0.6] : isScrolling ? [0.5, 0.8, 0.5] : [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: speaking ? 1.0 : isScrolling ? 0.8 : 3.0,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: (outer - mid) / 2,
          left: (outer - mid) / 2,
          width: mid,
          height: mid,
          borderRadius: "50%",
          border: `1px solid rgba(155,93,229,${speaking ? "0.7" : isScrolling ? "0.6" : "0.3"})`,
          boxShadow: speaking
            ? "0 0 18px rgba(155,93,229,0.45), 0 0 36px rgba(155,93,229,0.2)"
            : isScrolling
            ? "0 0 14px rgba(155,93,229,0.4)"
            : "0 0 8px rgba(155,93,229,0.15)",
        }}
      />

      {/* Inner sphere — semi-transparent */}
      <div
        style={{
          position: "absolute",
          top: (outer - inner) / 2,
          left: (outer - inner) / 2,
          width: inner,
          height: inner,
          borderRadius: "50%",
          // Transparent-leaning gradient — glass-like
          background:
            "radial-gradient(circle at 34% 34%, rgba(208,170,255,0.75), rgba(155,93,229,0.60) 48%, rgba(94,31,170,0.70) 88%)",
          boxShadow:
            "0 4px 18px rgba(155,93,229,0.45), inset 0 1px 2px rgba(255,255,255,0.22)",
          overflow: "hidden",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Specular */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "16%",
            width: "35%",
            height: "24%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.28)",
            filter: "blur(2px)",
          }}
        />

        {/* Eye — desktop only */}
        {!isMobile && (
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: eyeX,
              y: eyeY,
              translateX: "-50%",
              translateY: "-50%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 4px rgba(255,255,255,0.5)",
            }}
          />
        )}
      </div>

      {/* Speaking bounce dots */}
      <AnimatePresence>
        {speaking && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            style={{
              position: "absolute",
              bottom: -14,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 3,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#9B5DE5",
                  boxShadow: "0 0 4px rgba(155,93,229,0.7)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification badge when collapsed */}
      <AnimatePresence>
        {!bubbleOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "#9B5DE5",
              border: "1.5px solid #080C10",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Root LeviAgent ─────────────────────────────────────────────────────────────
export default function LeviAgent() {
  const [state, setState] = useState<AgentState>("hidden");
  const [currentStop, setCurrentStop] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const highestSeen = useRef(-1);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll pulse ring
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Init — check session dismissal, then schedule appearance
  useEffect(() => {
    if (sessionStorage.getItem("levi-tour-dismissed") === "1") {
      setState("dismissed");
      return;
    }

    const timer = setTimeout(() => {
      if (!document.querySelector("[data-levi-stop]")) return;
      setState("speaking");
      setBubbleOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver — auto-advance on scroll
  useEffect(() => {
    if (state !== "speaking" && state !== "collapsed") return;

    const observers: IntersectionObserver[] = [];

    TOUR_STOPS.forEach((stop) => {
      const el = document.querySelector(stop.selector);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && stop.id > highestSeen.current) {
              highestSeen.current = stop.id;
              setCurrentStop(stop.id);
              if (state === "collapsed") {
                setState("speaking");
                setBubbleOpen(true);
              }
            }
          });
        },
        { threshold: 0.35 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [state]);

  const handleNext = useCallback(() => {
    if (currentStop < TOUR_STOPS.length - 1) {
      setCurrentStop((p) => p + 1);
    } else {
      setState("collapsed");
      setBubbleOpen(false);
    }
  }, [currentStop]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem("levi-tour-dismissed", "1");
    setState("dismissed");
  }, []);

  const handleOrbClick = useCallback(() => {
    if (state === "speaking" || state === "collapsed") {
      setBubbleOpen((prev) => {
        if (!prev && state === "collapsed") setState("speaking");
        if (prev && state === "speaking") setState("collapsed");
        return !prev;
      });
    }
  }, [state]);

  if (state === "dismissed") return null;

  const showHighlight =
    (state === "speaking" || state === "collapsed") && bubbleOpen && !isMobile;

  return (
    <>
      {/* Section highlight — desktop only */}
      <AnimatePresence>
        {showHighlight && (
          <SectionHighlight key={`hl-${currentStop}`} stop={TOUR_STOPS[currentStop]} />
        )}
      </AnimatePresence>

      {/* Mobile bubble — full width, outside orb container */}
      {isMobile && (
        <SpeechBubble
          stop={TOUR_STOPS[currentStop]}
          open={bubbleOpen && state !== "hidden"}
          isMobile={true}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      )}

      {/* Floating orb container */}
      <AnimatePresence>
        {state !== "hidden" && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 70, opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            style={{
              position: "fixed",
              bottom: isMobile ? 22 : 28,
              right: isMobile ? 18 : 28,
              zIndex: 8000,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {/* Desktop bubble (positioned above orb) */}
            {!isMobile && (
              <div style={{ position: "relative" }}>
                <SpeechBubble
                  stop={TOUR_STOPS[currentStop]}
                  open={bubbleOpen}
                  isMobile={false}
                  onNext={handleNext}
                  onSkip={handleSkip}
                />
              </div>
            )}

            {/* Orb */}
            <LeviOrb
              speaking={state === "speaking" && bubbleOpen}
              bubbleOpen={bubbleOpen}
              isScrolling={isScrolling}
              isMobile={isMobile}
              onClick={handleOrbClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
