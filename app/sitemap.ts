import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";
import { DOMAIN } from "@/lib/seo";

// Generated at build so new blog posts can't be forgotten (the old static
// public/sitemap.xml never listed any of them).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, "weekly" | "monthly" | "yearly"][] = [
    ["/", 1.0, "weekly"],
    ["/platform/", 0.9, "monthly"],
    ["/security/", 0.8, "monthly"],
    ["/pricing/", 0.8, "monthly"],
    ["/docs/", 0.8, "monthly"],
    ["/about/", 0.6, "monthly"],
    ["/blog/", 0.6, "weekly"],
    ["/contact/", 0.6, "yearly"],
    ["/team/", 0.5, "monthly"],
    ["/privacy/", 0.3, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${DOMAIN}${path}`, priority, changeFrequency })),
    ...posts.map((p) => ({
      url: `${DOMAIN}/blog/${p.slug}/`,
      lastModified: new Date(p.date),
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
  ];
}
