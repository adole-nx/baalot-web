import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/pricing/",
  "Pricing",
  "Baalot pricing: free Starter plan for up to 500 voters, Institution plan at ₦150,000 per election with unlimited voters, and custom Enterprise plans.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
