import type { Metadata } from "next";

// Invite links (baalot.site/join?c=CODE) carry a bearer code in the query
// string, so nothing here is worth indexing.
export const metadata: Metadata = {
  title: "Join on Baalot",
  description: "Open this community invite in the Baalot app.",
  robots: { index: false, follow: false },
};

export default function JoinLinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
