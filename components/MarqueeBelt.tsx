"use client";

import Marquee from "./Marquee";

const items = [
  "Chain-Sealed Ballots",
  "Anonymous Voting",
  "Real-Time Results",
  "Voter Receipts",
  "Built for Africa",
  "University Elections",
  "Tamper-Evident Tallying",
  "Mobile Voting Interface",
  "NIN/BVN Verified",
  "One Vote Per Identity",
];

export default function MarqueeBelt() {
  return (
    <div className="border-y border-subtle bg-surface-2 overflow-hidden py-4 relative">
      {/* Left/right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #1C2333, transparent)" }}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #1C2333, transparent)" }}
        aria-hidden="true"
      />
      <Marquee items={items} speed={55} />
    </div>
  );
}
