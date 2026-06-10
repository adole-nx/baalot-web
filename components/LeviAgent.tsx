"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

// ─── Levi floating pill + click-to-reveal bubble ───────────────
export default function LeviAgent() {
  const [visible, setVisible]   = useState(false);
  const [open, setOpen]         = useState(false);
  const wrapRef                 = useRef<HTMLDivElement>(null);

  // Gentle parallax follow on desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const px = useSpring(mouseX, { stiffness: 160, damping: 22 });
  const py = useSpring(mouseY, { stiffness: 160, damping: 22 });

  // Appear after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1600);
    return () => clearTimeout(t);
  }, []);

  // Subtle parallax on desktop
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(((e.clientX - window.innerWidth  / 2) / window.innerWidth)  * 6);
      mouseY.set(((e.clientY - window.innerHeight / 2) / window.innerHeight) * 6);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  // Close bubble on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const scrollToContact = () => {
    setOpen(false);
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="levi-root"
          ref={wrapRef}
          initial={{ y: 60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 22,
            zIndex: 8000,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
            x: px,
            y: py,
          }}
        >

          {/* ── Speech bubble ── */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="levi-bubble"
                initial={{ opacity: 0, scale: 0.88, y: 12, originX: 1, originY: 1 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 8 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                style={{
                  width: 272,
                  background: "rgba(6,9,14,0.97)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(155,93,229,0.28)",
                  borderRadius: 16,
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.04), 0 0 32px rgba(155,93,229,0.14), 0 16px 48px rgba(0,0,0,0.55)",
                  padding: "18px 18px 16px",
                  transformOrigin: "bottom right",
                  position: "relative",
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <X size={11} />
                </button>

                {/* Avatar + name row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(155,93,229,0.3)",
                        "0 0 12px rgba(155,93,229,0.7)",
                        "0 0 0px rgba(155,93,229,0.3)",
                      ],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #9B5DE5 0%, #14B8A6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      fontFamily: "var(--font-syne)",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    L
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "#22C55E",
                        border: "1.5px solid rgba(6,9,14,0.97)",
                      }}
                    />
                  </motion.div>
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "rgba(240,244,248,0.9)",
                        fontFamily: "var(--font-syne)",
                        lineHeight: 1,
                        marginBottom: 2,
                      }}
                    >
                      Levi
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#22C55E",
                        fontFamily: "var(--font-inter)",
                        lineHeight: 1,
                      }}
                    >
                      Online
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(203,213,225,0.88)",
                    fontFamily: "var(--font-inter)",
                    marginBottom: 14,
                  }}
                >
                  Hey! I&apos;m Levi, your Baalot guide. Ready to run a tamper-proof election?{" "}
                  <span style={{ color: "rgba(155,93,229,0.9)" }}>Your first one is free.</span>
                </p>

                {/* CTA button */}
                <motion.button
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 0",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(155,93,229,0.9) 0%, rgba(107,45,185,0.9) 100%)",
                    border: "1px solid rgba(155,93,229,0.4)",
                    boxShadow: "0 0 16px rgba(155,93,229,0.25)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "var(--font-syne)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Get started free
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                </motion.button>

                {/* Tail */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: 20,
                    width: 9,
                    height: 9,
                    background: "rgba(6,9,14,0.97)",
                    border: "1px solid rgba(155,93,229,0.28)",
                    transform: "rotate(45deg)",
                    borderTop: "none",
                    borderLeft: "none",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Floating pill ── */}
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            animate={open ? { boxShadow: "0 0 28px rgba(155,93,229,0.38), 0 8px 32px rgba(0,0,0,0.45)" } : {}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 8,
              paddingRight: 14,
              height: 44,
              borderRadius: 100,
              background: "rgba(6,9,14,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${open ? "rgba(155,93,229,0.55)" : "rgba(155,93,229,0.28)"}`,
              boxShadow: "0 0 20px rgba(155,93,229,0.16), 0 8px 32px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.04)",
              cursor: "pointer",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            title="Levi — Baalot AI guide"
          >
            {/* Avatar */}
            <motion.div
              animate={{
                boxShadow: open
                  ? ["0 0 8px rgba(155,93,229,0.6)", "0 0 14px rgba(155,93,229,0.85)", "0 0 8px rgba(155,93,229,0.6)"]
                  : ["0 0 0px rgba(155,93,229,0.3)", "0 0 8px rgba(155,93,229,0.5)", "0 0 0px rgba(155,93,229,0.3)"],
              }}
              transition={{ duration: open ? 1.6 : 2.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #9B5DE5 0%, #14B8A6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "var(--font-syne)",
                flexShrink: 0,
                letterSpacing: "-0.02em",
                position: "relative",
              }}
            >
              L
              {/* Online dot */}
              <motion.span
                animate={{ opacity: [1, 0.45, 1], scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22C55E",
                  border: "1.5px solid rgba(6,9,14,0.96)",
                }}
              />
            </motion.div>

            {/* Label */}
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(240,244,248,0.88)",
                fontFamily: "var(--font-syne)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Levi
            </span>

            {/* Idle bounce dots or close indicator */}
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="chevron"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <X size={12} color="rgba(155,93,229,0.8)" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex", gap: 2.5, alignItems: "center" }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -3, 0], opacity: [0.4, 0.85, 0.4] }}
                      transition={{ duration: 0.72, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      style={{
                        display: "block",
                        width: 3.5,
                        height: 3.5,
                        borderRadius: "50%",
                        background: "#9B5DE5",
                      }}
                    />
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
