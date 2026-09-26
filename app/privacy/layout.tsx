import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/privacy/",
  "Privacy Policy",
  "How Baalot collects, uses and protects personal data.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
