import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/security/",
  "Security",
  "How Baalot protects elections: server-side vote enforcement, anonymous ballots, a tamper-evident hash-chain with voter receipts and public verification, and optional NIN/BVN identity checks via Prembly.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
