"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import VerifyTerminal from "@/components/VerifyTerminal";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: "introduction", label: "Introduction" },
  { id: "how-it-works", label: "How Elections Work" },
  { id: "admin-guide",  label: "Admin Guide" },
  { id: "voter-guide",  label: "Voter Guide" },
  { id: "security",     label: "Security Model" },
  { id: "api-access",   label: "API Access" },
];

const SECURITY_LAYERS = [
  [
    "Tamper-evident ballot chain",
    "Each accepted ballot is sealed into a per-election hash chain in the same transaction that records it. Altering any past ballot breaks every hash after it — including for Baalot. Anchoring chain heads to a public blockchain is on our roadmap.",
  ],
  [
    "Anonymous ballots",
    "Ballots are stored unreadable, and the chain publishes only a salted commitment of each one — enough to prove your ballot was counted, never enough to show what it said. Zero-knowledge proofs that verify validity without revealing the choice are on our roadmap.",
  ],
  [
    "NIN / BVN identity verification",
    "Every voter is checked against the national identity database before they can access a ballot. Duplicate registrations are detected and blocked automatically.",
  ],
  [
    "End-to-end encryption",
    "All data in transit is encrypted with TLS 1.3. Voter credentials are stored in device secure storage (iOS Keychain / Android Keystore), never on Baalot servers.",
  ],
];

const API_ENDPOINTS = [
  ["POST /otp",             "Send or verify a phone OTP. Body: { action: send or verify, phone, code? }"],
  ["POST /verify-kyc",      "Verify a voter's NIN / BVN against the national registry."],
  ["POST /bbc-register",    "Register a voter on the Baalot Ballot Chain for a given election."],
  ["POST /notify-election", "Send push notifications to all eligible voters for an election."],
  ["GET  /bbc-chain",       "Retrieve the full ballot-chain audit log for a given election ID."],
];

const divider = (
  <div className="my-10" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
);

const pill = (color: string, text: string) => (
  <span
    key={text}
    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mr-2 mb-2"
    style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
  >
    {text}
  </span>
);

const code = (text: string) => (
  <code
    className="px-1.5 py-0.5 rounded text-xs font-mono"
    style={{ background: "rgba(59,110,248,0.15)", color: "#7fa8ff" }}
  >
    {text}
  </code>
);

const step = (n: string, title: string, desc: string) => (
  <div key={n} className="flex gap-4 mb-5">
    <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center font-syne font-bold text-xs text-accent flex-shrink-0 mt-0.5">
      {n}
    </div>
    <div>
      <p className="font-semibold text-white mb-1">{title}</p>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function DocsPage() {
  const [active, setActive] = useState("introduction");

  return (
    <main className="bg-bg min-h-screen">
      <div className="max-w-site mx-auto px-5 md:px-10 lg:px-16 pt-32 pb-32">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="label-tag mb-3">Documentation</p>
          <h1 className="font-syne font-extrabold text-5xl md:text-6xl text-white mb-4 leading-[0.95]">
            Platform Docs
          </h1>
          <p className="text-muted text-lg max-w-xl">
            Everything you need to run a secure, verifiable election with Baalot — from first setup to published results.
          </p>
        </motion.div>

        <div className="flex gap-16">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-28">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                On this page
              </p>
              <nav className="flex flex-col gap-1">
                {NAV.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                    style={{
                      color: active === s.id ? "#fff" : "rgba(255,255,255,0.4)",
                      background: active === s.id ? "rgba(59,110,248,0.12)" : "transparent",
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >

            {/* Introduction */}
            <div id="introduction" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">Introduction</h2>
            <div className="flex flex-wrap mb-4">
              {pill("#3B6EF8", "Universities")}
              {pill("#10B981", "Student Unions")}
              {pill("#F97316", "Organizations")}
            </div>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Baalot is a secure election platform built for African institutions. It lets administrators
              create and manage elections, onboard verified voters, and publish results that voters and observers
              can check for themselves.
            </p>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Every accepted ballot is sealed into a per-election hash chain in the same transaction that records it,
              and the voter keeps a cryptographic receipt. Voter identity is verified against Nigerian national
              databases (NIN / BVN) before any ballot is cast. Results are published the moment polls close.
            </p>
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: "rgba(59,110,248,0.08)", border: "1px solid rgba(59,110,248,0.2)" }}
            >
              <p className="text-sm text-white/80 leading-relaxed">
                <span className="font-semibold text-accent">Who is this for?</span>{" "}
                University registrars, student union electoral committees, corporate secretaries, and any institution
                that needs a defensible, tamper-evident election record.
              </p>
            </div>

            {divider}

            {/* How It Works */}
            <div id="how-it-works" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">How Elections Work</h2>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Every Baalot election follows the same three-phase lifecycle, regardless of size.
            </p>
            {step("1", "Admin Setup", "The institution admin creates the election on the dashboard — sets the name, positions, candidates, and voting window. The voter list (CSV or manual) is uploaded and matched against the national ID registry to produce a verified electorate.")}
            {step("2", "Voter Authentication & Voting", "Eligible voters receive a credential link or download the Baalot app. They authenticate with their institutional ID and NIN/BVN. Once verified, they cast their ballot. The ballot is stored unreadable and sealed into the election’s hash chain, and the voter keeps a receipt. Median voting time is under 2 minutes.")}
            {step("3", "Tally & Results", "When polls close, the tally is finalised and published. The admin dashboard shows live results the instant counting completes, and every voter can check their own receipt against the election’s chain.")}

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Election states</h3>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              An election moves through four states:{" "}
              {code("draft")} {"->"} {code("open")} {"->"} {code("closed")} {"->"} {code("published")}.
              Only the institution admin can advance or revert between states. Votes can only be cast in
              the {code("open")} state.
            </p>

            {divider}

            {/* Admin Guide */}
            <div id="admin-guide" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">Admin Guide</h2>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Admins access the platform at{" "}
              <a href="https://admin.baalot.site" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                admin.baalot.site
              </a>{" "}
              using their institutional email. Admin accounts are provisioned by the Baalot team on institution onboarding.
            </p>

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Creating an election</h3>
            {step("1", "New Election", "From the dashboard, click New Election. Enter the election name, institution, and voting window (start date/time to end date/time).")}
            {step("2", "Add positions & candidates", "Add each position (e.g. President, Secretary). For each position, add the candidate names. Candidates do not need a Baalot account — only their name appears on the ballot.")}
            {step("3", "Upload voter list", "Upload a CSV with columns: matric_number, full_name, email (optional). Baalot matches each entry against the school registry. Unmatched rows are flagged for review before the election goes live.")}
            {step("4", "Go live", "Set the election to Open. Voters are notified automatically if email addresses were provided. The election runs until the end time you set, or until you manually close it.")}

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Managing members</h3>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              The Members tab shows every registered voter — Active, Pending, or Removed. You can approve, remove,
              or promote members from this view. For institutions with multiple departments, the institution picker
              in the top bar lets you switch context.
            </p>

            {divider}

            {/* Voter Guide */}
            <div id="voter-guide" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">Voter Guide</h2>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Voters use the Baalot mobile app (iOS and Android) to register, verify their identity, and cast their vote.
            </p>

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Registering</h3>
            {step("1", "Download the app", "Install Baalot from the App Store or Google Play. Create an account with your institutional email address.")}
            {step("2", "Complete your profile", "Enter your name, nationality, phone number, and date of birth. These details are used to match your record against the voter list.")}
            {step("3", "Verify your identity", "Enter your NIN or BVN. Baalot checks it against the national identity database via Prembly IdentityPass. Verification typically completes in under 30 seconds.")}
            {step("4", "Join your institution", "Go to the Explore tab, search for your institution, and enter your matriculation or membership number. If it matches the voter list, you are added instantly as an active voter.")}

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Casting a vote</h3>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              When an election is open, it appears on your Home tab. Tap it, review the candidates for each position,
              make your selections, and confirm. The app will show a brief &quot;Securing your vote&quot; state while
              your ballot is sealed into the election’s chain — this takes 1–2 seconds. You will receive a voter
              receipt you can check against that chain afterwards.
            </p>

            {divider}

            {/* Security */}
            <div id="security" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">Security Model</h2>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              Baalot&apos;s security rests on four independent layers. Each layer is designed so that compromising
              one does not compromise the others.
            </p>
            {SECURITY_LAYERS.map(([title, desc]) => (
              <div
                key={title}
                className="mb-4 p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="font-semibold text-white text-sm mb-1">{title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              For a full security brief — including our threat model and data-handling procedures — contact us at{" "}
              <a href="mailto:security@baalot.site" className="text-accent hover:underline">
                security@baalot.site
              </a>.
            </p>

            {divider}

            {/* API Access */}
            <div id="api-access" className="relative -top-24 invisible" />
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-4 mt-2">API Access</h2>
            <p className="text-white/70 leading-[1.8] mb-4 text-base">
              The Baalot API is available to institutions on the Institution and Enterprise plans.
              It allows you to programmatically manage elections, upload voter lists, and retrieve
              results — useful for integrating Baalot into existing student portals or HR systems.
            </p>
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: "rgba(245,197,24,0.07)", border: "1px solid rgba(245,197,24,0.2)" }}
            >
              <p className="text-sm text-white/80 leading-relaxed">
                <span className="font-semibold" style={{ color: "#F5C518" }}>Full API reference is in progress.</span>{" "}
                If you need API access now — for an integration, a student portal, or a custom voting workflow —
                reach out directly and we will give you early access with dedicated support.
              </p>
            </div>

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Base URL</h3>
            <div
              className="rounded-xl p-4 mb-6 font-mono text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-white/40">POST / GET </span>
              <span className="text-accent">https://baalot.vercel.app/api/</span>
            </div>

            <h3 className="font-syne font-bold text-lg text-white mb-2 mt-6">Key endpoints</h3>
            {API_ENDPOINTS.map(([endpoint, desc]) => (
              <div
                key={endpoint}
                className="mb-3 p-4 rounded-xl flex flex-col sm:flex-row sm:items-start gap-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <code
                  className="px-2 py-0.5 rounded text-xs font-mono flex-shrink-0"
                  style={{ background: "rgba(59,110,248,0.15)", color: "#7fa8ff" }}
                >
                  {endpoint}
                </code>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}

            <div className="mt-10">
              <Link
                href="/contact"
                className="group relative inline-flex items-center px-6 py-3 rounded-xl bg-accent font-semibold text-sm overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Request API Access</span>
              </Link>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Vote Verification Terminal */}
      <section className="py-20 px-5 md:px-10 lg:px-16" style={{ background: "#030507" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
              Verification
            </p>
            <h2
              className="font-syne font-bold text-primary"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em" }}
            >
              Verify any ballot receipt.
            </h2>
            <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ color: "#64748B" }}>
              Replay an election’s ballot chain through the public API and confirm your receipt is in it.
            </p>
          </div>
          <VerifyTerminal />
        </div>
      </section>
    </main>
  );
}
