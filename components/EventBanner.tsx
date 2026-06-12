"use client";
/**
 * EventBanner — components/EventBanner.tsx
 *
 * Floating festive card (bottom-left, opposite Levi) shown site-wide
 * whenever an event from lib/events.ts is active — Democracy Day,
 * World Cup, Eid, Christmas…
 *
 * - Slides in ~1.2s after load so it never competes with the hero.
 * - Dismissible — persisted per event per year in localStorage, so it
 *   stays gone for the rest of the event but returns next year.
 * - Renders nothing when no event is active.
 *
 * Mirrors the mobile app's components/EventBanner.tsx.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getActiveEvent } from "@/lib/events";

const dismissKey = (id: string) =>
  `baalot_event_dismissed_${id}_${new Date().getFullYear()}`;

export default function EventBanner() {
  // Resolve the event on the client only — the server's date (UTC) can
  // disagree with the visitor's, which would cause a hydration mismatch.
  const [event, setEvent] = useState<ReturnType<typeof getActiveEvent>>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const active = getActiveEvent();
    if (!active) return;
    try {
      if (localStorage.getItem(dismissKey(active.id)) === "1") return;
    } catch {}
    setEvent(active);
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    if (event) {
      try { localStorage.setItem(dismissKey(event.id), "1"); } catch {}
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {event && visible && (
        <motion.aside
          key={event.id}
          role="status"
          aria-label={`${event.name} announcement`}
          initial={{ y: 60, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-5 left-4 right-4 sm:right-auto sm:w-[360px] z-[7000] overflow-hidden rounded-2xl p-[1px]"
          style={{
            background: `linear-gradient(135deg, ${event.accent}55, rgba(255,255,255,0.05))`,
          }}
        >
          <div
            className="relative flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{
              background: "rgba(8,12,16,0.92)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 32px ${event.tint}`,
            }}
          >
            {/* Oversized watermark emoji, clipped by the card */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -top-5 select-none text-[84px] opacity-10 -rotate-12"
            >
              {event.emoji}
            </span>

            <span
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xl"
              style={{ background: event.tint }}
            >
              {event.emoji}
            </span>

            <div className="min-w-0 flex-1">
              <p
                className="truncate font-syne text-sm font-bold tracking-wide"
                style={{ color: event.accent }}
              >
                {event.headline}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-4 text-[var(--text-secondary)]">
                {event.message}
              </p>
            </div>

            <button
              onClick={dismiss}
              aria-label={`Dismiss ${event.name} banner`}
              className="flex-shrink-0 self-start rounded-full p-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={14} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
