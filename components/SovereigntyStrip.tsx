"use client";
import Link from "next/link";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function SovereigntyStrip() {
  return (
    <div
      className="relative w-full py-3 px-5 flex items-center justify-center gap-3 overflow-hidden"
      style={{
        background: "rgba(155,93,229,0.05)",
        borderBottom: "1px solid rgba(155,93,229,0.15)",
      }}
    >
      {/* Animated glow line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-px sovereignty-border"
        style={{
          width: "100%",
          background: "linear-gradient(90deg, transparent, rgba(155,93,229,0.5), rgba(20,184,166,0.4), rgba(155,93,229,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      <Lock
        size={13}
        style={{ color: "#9B5DE5", flexShrink: 0 }}
        strokeWidth={2.5}
      />
      <p className="text-[12px] font-medium text-center" style={{ color: "#64748B" }}>
        Every vote is cryptographically sealed on{" "}
        <span style={{ color: "#9B5DE5" }}>your institution&apos;s chain</span>
        {" "}- Baalot never stores your ballot.
      </p>
      <Link
        href="/security"
        className="text-[11px] font-semibold whitespace-nowrap transition-colors duration-200 hover:opacity-80"
        style={{ color: "#9B5DE5" }}
      >
        View proof
      </Link>
    </div>
  );
}
