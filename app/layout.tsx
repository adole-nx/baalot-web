// v2
import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import LeviAgent from "@/components/LeviAgent";
import SovereigntyStrip from "@/components/SovereigntyStrip";
import EventBanner from "@/components/EventBanner";
import HydrationMark from "@/components/HydrationMark";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const DOMAIN = "https://baalot.site";

// One linked entity graph so search and AI engines resolve "Baalot" (often
// auto-corrected to "ballot") to this organisation, site and app.
const ORG_ID = `${DOMAIN}/#organization`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Baalot",
      alternateName: ["Baalot Elections", "Baalot app", "baalot.site"],
      url: DOMAIN,
      logo: `${DOMAIN}/icon.png`,
      description:
        "Baalot is a Nigerian election platform for universities, student unions, NGOs and organisations across Africa: server-enforced one-person-one-vote, encrypted ballots, and a tamper-evident ballot chain with voter receipts.",
      foundingLocation: { "@type": "Country", name: "Nigeria" },
      areaServed: [{ "@type": "Country", name: "Nigeria" }, { "@type": "Place", name: "Africa" }],
      founder: {
        "@type": "Person",
        name: "Adole Daniel Inalegwu",
        jobTitle: "Founder & CEO",
        sameAs: ["https://linkedin.com/in/adole-daniel-inalegwu"],
      },
      email: "hello@baalot.site",
      knowsAbout: ["Election management", "Online voting", "Student union elections", "Election integrity"],
    },
    {
      "@type": "WebSite",
      "@id": `${DOMAIN}/#website`,
      name: "Baalot",
      alternateName: "Baalot — Secure Election Management",
      url: DOMAIN,
      inLanguage: "en-NG",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${DOMAIN}/#app`,
      name: "Baalot",
      url: DOMAIN,
      description:
        "Secure, verifiable election management for African universities and organisations. One vote per verified identity, live tallies, and a tamper-evident ballot chain.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Android, iOS, Web",
      publisher: { "@id": ORG_ID },
      offers: [
        { "@type": "Offer", name: "Starter", price: "0", priceCurrency: "NGN", description: "Up to 500 voters, 1 active election" },
        { "@type": "Offer", name: "Institution", price: "150000", priceCurrency: "NGN", description: "Per election, unlimited voters" },
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Baalot — Secure Election Management for African Universities",
    template: "%s | Baalot",
  },
  description:
    "Run secure, server-verified elections at your university or organisation. One vote per verified identity, live tallies, and every ballot sealed in a tamper-evident chain with voter-verifiable receipts.",
  keywords: [
    "election management system",
    "university elections Nigeria",
    "secure online voting",
    "student union elections",
    "digital voting platform Africa",
    "encrypted ballot system",
    "verified identity voting",
    "electoral management software",
  ],
  openGraph: {
    title: "Baalot — Elections You Can Trust",
    description: "Secure, verifiable election management for universities and organisations across Africa.",
    url: DOMAIN,
    siteName: "Baalot",
    images: [{ url: `${DOMAIN}/og-image.png`, width: 1200, height: 630, alt: "Baalot — Secure Election Platform" }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baalot — Elections You Can Trust",
    description: "Secure, verifiable election management for Africa.",
    images: [`${DOMAIN}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} font-inter bg-bg text-primary antialiased`}
      >
        <HydrationMark />
        <ScrollProgressBar />
        <CustomCursor />
        <LeviAgent />
        <EventBanner />
        <Navbar />
        {children}
        <SovereigntyStrip />
        <Footer />
      </body>
    </html>
  );
}
