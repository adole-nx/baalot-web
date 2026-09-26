import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/blog/",
  "Blog",
  "Engineering notes and election-integrity writing from the Baalot team.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
