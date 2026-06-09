"use client";

import Marquee from "./Marquee";

const items = [
  "Blockchain-Verified Votes",
  "ZK-Proof Anonymity",
  "Real-Time Results",
  "Distributed Node Network",
  "Built for Africa",
  "University Elections",
  "Tamper-Proof Tallying",
  "Mobile Voting Interface",
  "Ethereum-Secured",
  "Zero Central Failure",
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
