import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/team/",
  "Team",
  "The people building Baalot, the secure election platform for African universities and organisations.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
