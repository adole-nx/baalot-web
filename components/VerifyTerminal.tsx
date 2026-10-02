"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

interface TerminalLine {
  text: string;
  type: "command" | "success" | "data" | "muted" | "warning" | "blank";
  delay?: number;
}

const LINES: TerminalLine[] = [
  { text: "$ baalot verify --receipt 9f4a2b...e8c71d --chain bbc-mainnet", type: "command", delay: 0 },
  { text: "", type: "blank", delay: 200 },
  { text: "Connecting to Baalot ballot chain...", type: "muted", delay: 400 },
  { text: "  Endpoint: api.baalot.site  [connected]", type: "success", delay: 800 },
  { text: "", type: "blank", delay: 900 },
  { text: "Fetching vote receipt: 9f4a2b...e8c71d", type: "muted", delay: 1100 },
  { text: "  Sequence:   #2,041,887", type: "data", delay: 1400 },
  { text: "  Chain:      Ballot Chain", type: "data", delay: 1550 },
  { text: "  Timestamp:  2025-11-03 08:17:44 UTC", type: "data", delay: 1700 },
  { text: "  Election:   SUG Presidential Election 2026", type: "data", delay: 1850 },
  { text: "", type: "blank", delay: 1950 },
  { text: "Verifying ballot integrity...", type: "muted", delay: 2100 },
  { text: "  Voter hash:   0x7f3a9c2e...d841b09f  [pseudonymous]", type: "success", delay: 2400 },
  { text: "  Candidate:    [sealed — stored unreadable]", type: "data", delay: 2600 },
  { text: "  Signature:    valid", type: "success", delay: 2800 },
  { text: "", type: "blank", delay: 2900 },
  { text: "Chain integrity check...", type: "muted", delay: 3000 },
  { text: "  Method:       SHA-256 hash chain", type: "data", delay: 3200 },
  { text: "  Link hash:    0xa1f2...7c3e", type: "data", delay: 3400 },
  { text: "  Verified:     true", type: "success", delay: 3600 },
  { text: "", type: "blank", delay: 3700 },
  { text: "VOTE RECORDED. SEALED. TAMPER-EVIDENT.", type: "success", delay: 3900 },
  { text: "", type: "blank", delay: 4000 },
  { text: "Your vote is sealed in the chain. Any change would break it.", type: "muted", delay: 4100 },
];

function getLineClass(type: TerminalLine["type"]) {
  switch (type) {
    case "command":  return "terminal-command";
    case "success":  return "terminal-success";
    case "data":     return "terminal-data";
    case "warning":  return "terminal-warning";
    case "muted":    return "terminal-muted";
    default:         return "terminal-muted";
  }
}

export default function VerifyTerminal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleCount, setVisibleCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleCount((c) => Math.max(c, i + 1));
      }, line.delay ?? i * 120);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className={`rounded-2xl overflow-hidden ${className ?? ""}`}
      style={{
        background: "#050810",
        border: "1px solid rgba(155,93,229,0.15)",
        boxShadow: "0 0 60px rgba(155,93,229,0.06)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444", opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B", opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E", opacity: 0.7 }} />
        </div>
        <span
          className="ml-3 text-[11px] font-mono flex-1 text-center"
          style={{ color: "#4B5563" }}
        >
          baalot-verify
        </span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full live-dot"
            style={{ background: "#22C55E" }}
          />
          <span className="text-[10px] font-mono" style={{ color: "#22C55E" }}>live</span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-5 md:p-6 min-h-[360px]">
        <div className="terminal-output space-y-0.5">
          {LINES.slice(0, visibleCount).map((line, i) => (
            <div
              key={i}
              className={`terminal-line visible ${getLineClass(line.type)}`}
              style={{
                minHeight: line.type === "blank" ? "0.85em" : undefined,
                fontWeight: line.type === "command" ? 600 : 400,
              }}
            >
              {line.text || " "}
            </div>
          ))}

          {/* Blinking cursor at end */}
          {visibleCount > 0 && visibleCount < LINES.length && (
            <div className="terminal-muted" style={{ display: "inline" }}>
              <span className="cursor-blink" style={{ color: "#9B5DE5" }}>|</span>
            </div>
          )}

          {visibleCount >= LINES.length && (
            <div className="flex items-center gap-2 mt-3">
              <span className="terminal-command">$</span>
              <span className="cursor-blink" style={{ color: "#9B5DE5" }}>|</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
