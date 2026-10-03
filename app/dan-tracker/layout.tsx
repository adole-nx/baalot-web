import type { Metadata } from "next";

// Private personal tracker. Unlisted: no nav link, no sitemap entry, never indexed.
export const metadata: Metadata = {
  title: "Tracker",
  robots: { index: false, follow: false, nocache: true },
};

export default function DanTrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
