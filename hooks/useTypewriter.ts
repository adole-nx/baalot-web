"use client";
import { useState, useEffect, useRef } from "react";

/**
 * Animates text appearing character-by-character.
 * `active` controls whether the typewriter is running.
 * `speed` is ms per character.
 */
export function useTypewriter(text: string, speed = 22, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    // Reset on new text
    setDisplayed("");
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, active]);

  return { displayed, done };
}
