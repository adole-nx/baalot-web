import type { Metadata } from "next";

// One static shell serves every /institution/{id} share link (firebase.json
// rewrites them here), so these pages carry no per-institution content worth
// indexing.
export const metadata: Metadata = {
  title: "Open in Baalot",
  description: "Open this institution in the Baalot app.",
  robots: { index: false, follow: true },
};

export default function InstitutionLinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
