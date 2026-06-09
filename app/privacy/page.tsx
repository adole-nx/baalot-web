"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;

const sections = [
  {
    title: "What We Collect",
    body: `When you use Baalot's platform, we collect only what is necessary to run a secure election. This includes:

• Voter identity information (NIN/BVN reference, institutional ID) — used solely to verify eligibility and prevent duplicate voting.
• Email address — used for credential delivery and election notifications.
• Vote data — stored on-chain as an encrypted, anonymised transaction. Baalot cannot link a vote to a voter.
• Usage logs — page visits and feature interactions, used to improve the platform (no personal identifiers attached).
• Device metadata — browser type, OS version, screen size — collected anonymously for compatibility purposes.

We do not collect payment card details. We do not build advertising profiles. We do not sell data.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use the information we collect for one purpose: running trustworthy elections.

Specifically:
• To verify voter eligibility before a ballot is opened.
• To deliver your unique voting credential securely.
• To send election result notifications you have opted into.
• To diagnose technical issues and improve platform reliability.
• To comply with legal obligations and respond to valid regulatory requests.

We will never use your information for marketing purposes without explicit opt-in consent.`,
  },
  {
    title: "Third-Party Services",
    body: `Baalot is built on infrastructure from the following third-party providers:

• Firebase (Google) — authentication and real-time database. Data is stored in the EU region.
• Vercel — web hosting and serverless API functions. No personal data is logged by Vercel beyond standard HTTP access logs.
• Ethereum blockchain — vote transactions are written to the public blockchain. These are anonymised and cannot be linked to your identity without your private voting credential.
• Cloudflare — DDoS protection and CDN. Only anonymous traffic metadata is processed.

Each provider is GDPR-compliant. We maintain Data Processing Agreements (DPAs) with all processors.`,
  },
  {
    title: "Your Rights",
    body: `You have the following rights over your personal data:

• Access — request a copy of all data we hold about you.
• Rectification — request correction of inaccurate data.
• Erasure — request deletion of your account and associated data (subject to legal retention requirements and on-chain immutability constraints).
• Portability — receive your data in a machine-readable format.
• Objection — object to processing based on legitimate interests.
• Restriction — request we limit how we process your data while a complaint is resolved.

To exercise any of these rights, email us at privacy@baalot.site. We will respond within 30 days.`,
  },
  {
    title: "Data Retention",
    body: `We retain personal data only as long as necessary:

• Voter identity records — retained for the duration of the election plus 90 days for dispute resolution, then deleted.
• Election audit logs — retained for 7 years to comply with electoral record-keeping standards.
• On-chain vote transactions — permanent (this is by design; the immutability is the security guarantee). On-chain records contain no personally identifiable information.
• Account data — retained until you request deletion.`,
  },
  {
    title: "Cookies",
    body: `Baalot uses minimal cookies:

• Session cookie — required to keep you logged in during a voting session. Expires when your browser closes.
• Preference cookie — remembers your language and display settings. Expires after 1 year.
• No third-party advertising or tracking cookies are used.

You can clear cookies at any time via your browser settings. Clearing the session cookie will log you out.`,
  },
  {
    title: "Contact",
    body: `If you have any questions about this Privacy Policy or how we handle your data, please contact:

Data Controller: Baalot Technologies Ltd
Email: privacy@baalot.site
Address: Abuja, Nigeria

If you are unhappy with our response, you have the right to lodge a complaint with the Nigeria Data Protection Bureau (NDPB) or your local supervisory authority.

This policy was last updated: January 2025.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="section-pad pt-36">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="label-tag mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            Legal
          </motion.p>
          <motion.h1
            className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-muted mb-16"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Baalot is built on trust. Here is exactly how we handle your data — plainly, without legalese.
          </motion.p>

          <div className="space-y-14">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.04, ease: EASE }}
              >
                <h2 className="font-syne font-bold text-xl text-white mb-4 pb-3 border-b border-border">
                  {s.title}
                </h2>
                <div className="text-muted leading-relaxed whitespace-pre-line text-sm">
                  {s.body}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/" className="text-accent hover:text-white transition-colors text-sm">
              ← Back to Baalot
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
