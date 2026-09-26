import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/about/",
  "About",
  "Baalot is a Nigerian election platform for universities, student unions and organisations — built to make campus and organisational elections verifiable and hard to rig.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
