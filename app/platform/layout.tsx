import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/platform/",
  "Platform",
  "How Baalot runs an election end to end: eligibility rules, one vote per verified identity, encrypted, server-verified ballots, live tallies, voter receipts and a tamper-evident ballot chain.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
