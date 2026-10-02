"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;

const sections = [
  {
    title: "What We Collect",
    body: `When you use Baalot, we collect only what is necessary to run a secure election. This includes:

• Account information — name, email address, phone number, and a member or student ID where required, provided during registration.
• Organisation data — the institution, organisation, or community you belong to (and details such as faculty, department, or group), used to assign you to the correct election.
• Authentication data — we use Firebase Authentication (Google) to manage sign-in. We do not store passwords.
• ID card images — when you scan an ID for membership verification, the image is read for its text and is not stored by Baalot after processing.
• Identity verification — if you apply for the optional verified badge, your ID number and a liveness selfie are checked by Prembly. We keep only the result and a salted hash of the number, never the number itself.
• Levi assistant — messages you type to Levi, and voice you record while holding the mic, are processed to produce a reply. Voice is not kept after it is transcribed.
• Content you post — comments, photos and campaign reels.
• Location data — optional location shared only when you turn on the live voter map. We do not track your location in the background.
• Usage logs — app interactions and error reports used to improve the platform (via Sentry and Firebase Analytics).

Ads — the free app shows banner ads from Google AdMob, which uses your device's advertising ID. You can reset or delete that ID in your Android settings.

We do not collect payment card details. We do not sell data.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use the information we collect for one purpose: running trustworthy elections.

Specifically:
• To create and manage your account.
• To verify your identity and enrol you in the elections you are eligible for.
• To display real-time election results and voter maps.
• To send election notifications you have opted into.
• To detect fraud and maintain election integrity.
• To diagnose technical issues and improve platform reliability.
• To show ads in the free app (via Google AdMob).
• To comply with legal obligations and respond to valid regulatory requests.

We will never use your information for marketing purposes without explicit opt-in consent.`,
  },
  {
    title: "Third-Party Services",
    body: `Baalot is built on infrastructure from the following third-party providers:

• Firebase (Google) — authentication, Firestore database, and analytics.
• Vercel — API hosting and serverless functions. No personal data is logged beyond standard access logs.
• Sentry — error reporting. Error logs contain no personally identifiable information.
• Prembly IdentityPass — ID number and liveness checks for the optional verified badge, and ID card reading.
• Groq — processes Levi chat messages and voice recordings, and reads the text on scanned ID cards.
• Google AdMob — banner ads, using your device's advertising ID.
• Paystack — plan payments. Card details are entered on Paystack's own checkout and never reach Baalot.
• Cloudflare R2 — storage for campaign reels.
• Expo — push notification delivery.
• Google Sign-In — optional social login using your Google account (email and profile only).

Each provider operates under standard data protection agreements.`,
  },
  {
    title: "Your Rights",
    body: `You have the following rights over your personal data:

• Access — request a copy of all data we hold about you.
• Rectification — request correction of inaccurate data.
• Erasure — delete your account in the app, or see baalot.site/delete-account. Your personal data is erased 30 days later.
• Portability — receive your data in a machine-readable format.
• Objection — object to processing based on legitimate interests.
• Restriction — request we limit how we process your data while a complaint is resolved.

To exercise any of these rights, email us at adoledaniel111@gmail.com. We will respond within 30 days.`,
  },
  {
    title: "Data Retention",
    body: `We retain personal data only as long as necessary:

• Account data — retained while your account is active. When you delete your account it is switched off at once, and your personal data is permanently erased 30 days later. Sign back in before then to cancel.
• Election records — ballots (stored without your name), the record that you voted, your entry on the institution's member roster, any candidacy, and the audit chain are part of the institution's election result. They are kept when an account is deleted, because removing them would change a published count.
• Aggregate election results — retained as public records.`,
  },
  {
    title: "Children's Privacy",
    body: `Baalot is intended for voters aged 16 and above. We do not knowingly collect personal data from children under 16. If you believe a child under 16 has created an account, please contact us and we will delete the account promptly.`,
  },
  {
    title: "Contact",
    body: `If you have any questions about this Privacy Policy or how we handle your data, please contact:

Developer: Adole Daniel
Email: adoledaniel111@gmail.com
Website: https://baalot.site

If you are unhappy with our response, you have the right to lodge a complaint with the Nigeria Data Protection Bureau (NDPB) or your local supervisory authority.

This policy was last updated: September 27, 2026.`,
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
