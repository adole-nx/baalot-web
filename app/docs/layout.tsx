import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/docs/",
  "Platform Docs",
  "Guides for running an election on Baalot: set up an institution, add eligible voters, create positions and candidates, open voting and verify results.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
