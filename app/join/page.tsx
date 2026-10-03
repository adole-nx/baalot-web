"use client";

/**
 * /join?c=CODE — landing page for community invite links shared from the app.
 *
 * Same hand-off as /institution: verified App Links open the app before this
 * page loads; otherwise we pass the code to the app's `baalot://join` route
 * (an intent:// URL on Android, falling back here with #noapp when Baalot
 * isn't installed). The code is shown so someone can type it into the app
 * once they have it — Join with a code on the Baalot tab.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const ANDROID_PACKAGE = "com.adolenx.baalot";

// Mirrors the app's invite alphabet: 8 characters, no 0/O/1/I/L.
function readCode(): string | null {
  const raw = new URLSearchParams(window.location.search).get("c") ?? "";
  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z0-9]{8}$/.test(code) ? code : null;
}

function appLinks(code: string) {
  const path = `join?c=${code}`;
  const fallback = `${window.location.origin}/join/?c=${code}#noapp`;
  return {
    scheme: `baalot://${path}`,
    intent: `intent://${path}#Intent;scheme=baalot;package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(fallback)};end`,
  };
}

export default function JoinLinkPage() {
  const [code, setCode] = useState<string | null>(null);
  const [href, setHref] = useState<string | null>(null);
  const [noApp, setNoApp] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const c = readCode();
    if (!c) { setInvalid(true); return; }
    setCode(c);
    const links = appLinks(c);
    const open = /android/i.test(navigator.userAgent) ? links.intent : links.scheme;
    setHref(open);
    if (window.location.hash === "#noapp") { setNoApp(true); return; }
    window.location.href = open;
  }, []);

  return (
    <main className="min-h-screen bg-bg section-pad pt-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-md mx-auto text-center"
      >
        <p className="label-tag mb-3">Community invite</p>
        <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white mb-4">
          {invalid ? "This invite looks incomplete" : noApp ? "Get Baalot to join" : "Opening in Baalot…"}
        </h1>
        <p className="text-muted leading-relaxed mb-8">
          {invalid
            ? "Ask whoever invited you to send the link or code again from the Baalot app."
            : noApp
              ? "Baalot isn't installed on this phone yet. Install it, then tap this link again — or open Baalot and enter the code below under Join with a code."
              : "If the app didn't open on its own, tap the button below."}
        </p>
        {code && (
          <p className="font-syne font-extrabold text-3xl tracking-[0.3em] text-white mb-8 select-all">
            {code.slice(0, 4)}-{code.slice(4)}
          </p>
        )}
        {href && !invalid && (
          <a
            href={href}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Open in Baalot
          </a>
        )}
      </motion.div>
    </main>
  );
}
