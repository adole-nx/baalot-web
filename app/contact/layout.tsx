import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/contact/",
  "Request a Demo",
  "Request a Baalot demo for your university, student union, NGO, cooperative or organisation. We reply within one business day.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
