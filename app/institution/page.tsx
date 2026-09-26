"use client";

/**
 * /institution/{id} — landing page for links shared from the app.
 *
 * The app shares https://baalot.site/institution/{id} because chat apps only
 * make http(s) links tappable. When Android App Links are verified the OS opens
 * the app before this page ever loads; otherwise we land here and hand off to
 * the app's `baalot://` scheme (via an intent:// URL on Android, which falls
 * back to this page with #noapp when Baalot isn't installed).
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const ANDROID_PACKAGE = "com.adolenx.baalot";

function readTarget(): { id: string; search: string } | null {
  const m = window.location.pathname.match(/^\/institution\/([^/?#]+)/);
  if (!m) return null;
  return { id: m[1], search: window.location.search };
}

function appLinks(id: string, search: string) {
  const path = `institution/${id}${search}`;
  const fallback = `${window.location.origin}/institution/${id}/${search}#noapp`;
  return {
    scheme: `baalot://${path}`,
    intent: `intent://${path}#Intent;scheme=baalot;package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(fallback)};end`,
  };
}

export default function InstitutionLinkPage() {
  const [href, setHref] = useState<string | null>(null);
  const [noApp, setNoApp] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const target = readTarget();
    if (!target) { setInvalid(true); return; }
    const links = appLinks(target.id, target.search);
    const isAndroid = /android/i.test(navigator.userAgent);
    const open = isAndroid ? links.intent : links.scheme;
    setHref(open);
    if (window.location.hash === "#noapp") { setNoApp(true); return; }
    // First attempt happens automatically; the button is there if the browser
    // wants a tap before leaving for another app.
    window.location.href = open;
  }, []);

  return (
    <main className="min-h-screen bg-bg section-pad pt-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-md mx-auto text-center"
      >
        <p className="label-tag mb-3">Shared from Baalot</p>
        <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white mb-4">
          {invalid ? "This link looks incomplete" : noApp ? "Get Baalot to open this" : "Opening in Baalot…"}
        </h1>
        <p className="text-muted leading-relaxed mb-8">
          {invalid
            ? "Ask whoever shared it to send the link again from the Baalot app."
            : noApp
              ? "Baalot isn't installed on this phone yet. Install it, then tap this link again to land on the institution page."
              : "If the app didn't open on its own, tap the button below."}
        </p>
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
