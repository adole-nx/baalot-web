"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const posRef     = useRef({ x: -100, y: -100 });
  const rafRef     = useRef<number>(0);
  const lastYRef   = useRef(0);
  const speedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // ── Mouse position tracking ────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = () => el.classList.add("hidden");
    const onLeave = () => el.classList.remove("hidden");

    // ── Interactive element hover ──────────────────────────────────────────
    const onHoverIn  = () => el.classList.add("hovered");
    const onHoverOut = () => el.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onEnter);
    document.addEventListener("mouseenter", onLeave);

    const addHover = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((node) => {
        node.addEventListener("mouseenter", onHoverIn);
        node.addEventListener("mouseleave", onHoverOut);
      });
    };
    addHover();
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    // ── Scroll velocity — triggers speed-line CSS animation on body ────────
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastYRef.current);
      lastYRef.current = window.scrollY;
      if (delta > 6) {
        document.body.classList.add("scrolling-fast");
        if (speedTimer.current) clearTimeout(speedTimer.current);
        speedTimer.current = setTimeout(() => {
          document.body.classList.remove("scrolling-fast");
        }, 320);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── RAF loop for smooth cursor movement ────────────────────────────────
    const loop = () => {
      if (el) {
        el.style.left = `${posRef.current.x}px`;
        el.style.top  = `${posRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onEnter);
      document.removeEventListener("mouseenter", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      if (speedTimer.current) clearTimeout(speedTimer.current);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} id="custom-cursor" aria-hidden="true" />;
}
