import Link from "next/link";
import { pageMeta } from "@/lib/seo";

// Linked from the Google Play data-safety form as the account deletion URL.
// Every statement here is claim C18 in baalot/docs/CLAIMS.md — keep them in step.
export const metadata = pageMeta(
  "/delete-account/",
  "Delete your Baalot account",
  "How to delete your Baalot account and personal data, what is erased, and what the institution keeps.",
);

const EMAIL = "privacy@baalot.site";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Delete it in the app",
    body: (
      <ol className="list-decimal pl-5 space-y-2">
        <li>Open Baalot and tap your profile picture at the top of Home.</li>
        <li>Tap the <strong className="text-white">settings</strong> gear, then <strong className="text-white">Delete account</strong>.</li>
        <li>If you still belong to an institution, the app asks you to leave it first.</li>
        <li>Confirm with <strong className="text-white">Delete my account</strong>.</li>
      </ol>
    ),
  },
  {
    title: "Or ask us by email",
    body: (
      <p>
        No longer have the app? Email{" "}
        <a className="text-accent hover:text-white" href={`mailto:${EMAIL}?subject=Delete%20my%20Baalot%20account`}>{EMAIL}</a>{" "}
        from the address you signed up with and say you want your account deleted. We erase it
        within 30 days, and sooner if you ask.
      </p>
    ),
  },
  {
    title: "What happens next",
    body: (
      <p>
        Your account is switched off straight away: your profile disappears and you can no longer
        vote or post. Thirty days later your personal data is permanently erased. If you change your
        mind before then, sign back in and tap <strong className="text-white">Reactivate</strong>.
      </p>
    ),
  },
  {
    title: "What is erased",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Your profile: name, email, phone number, date of birth and nationality</li>
        <li>Your comments, notifications and sign-in history</li>
        <li>Your campaign reels, including the stored videos</li>
        <li>The follow list, receipt keys and identity-verification link on your account</li>
        <li>Your sign-in account itself</li>
      </ul>
    ),
  },
  {
    title: "What the institution keeps",
    body: (
      <p>
        Ballots you cast, the record that you voted, your entry on the institution&apos;s member
        roster and any candidacy stay with the institution. They are part of an election result,
        and removing them would change a published count. Ballots are stored without your name.
      </p>
    ),
  },
];

export default function DeleteAccountPage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="section-pad pt-36">
        <div className="max-w-3xl mx-auto">
          <p className="label-tag mb-4">Account</p>
          <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4">
            Delete your Baalot account
          </h1>
          <p className="text-muted mb-16">
            You can delete your account from inside the Baalot app, or by emailing us.
          </p>

          <div className="space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-syne font-bold text-xl text-white mb-4 pb-3 border-b border-border">
                  {s.title}
                </h2>
                <div className="text-muted leading-relaxed text-sm">{s.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex gap-6 text-sm">
            <Link href="/privacy/" className="text-accent hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="text-accent hover:text-white transition-colors">← Back to Baalot</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
