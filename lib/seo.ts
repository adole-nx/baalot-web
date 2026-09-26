import type { Metadata } from "next";

export const DOMAIN = "https://baalot.site";

/**
 * Per-route metadata. Every page needs its own title, description and a
 * canonical pointing at ITSELF — the root layout used to set canonical to the
 * homepage, which told Google/Bing (and the AI answer engines built on their
 * indexes) that every subpage was a duplicate of `/`.
 */
export function pageMeta(path: string, title: string, description: string): Metadata {
  const url = `${DOMAIN}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Baalot`, description, url, siteName: "Baalot", type: "website",
      images: [{ url: `${DOMAIN}/og-image.png`, width: 1200, height: 630, alt: "Baalot" }] },
    twitter: { card: "summary_large_image", title: `${title} | Baalot`, description, images: [`${DOMAIN}/og-image.png`] },
  };
}
