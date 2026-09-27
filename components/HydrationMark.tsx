"use client";

import { useEffect } from "react";

// Marks <html> once React has hydrated. globals.css reveals framer-motion's
// server-rendered `opacity:0` states after a few seconds unless this class is
// set, so a script that fails to run leaves a readable page, not a blank one.
export default function HydrationMark() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);
  return null;
}
