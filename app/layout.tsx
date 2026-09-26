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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Baalot",
  url: DOMAIN,
  description:
    "Secure, anonymous election management platform for African universities and organisations. One vote per verified identity, live tallies, and tamper-evident ballot chain.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Android, iOS",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NGN",
  },
  provider: {
    "@type": "Organization",
    name: "Baalot",
    url: DOMAIN,
    logo: `${DOMAIN}/icon.png`,
    sameAs: [],
    areaServed: "NG",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Baalot — Secure Election Management for African Universities",
    template: "%s | Baalot",
  },
  description:
    "Run secure, anonymous, server-verified elections at your university or organisation. One vote per verified identity, live tallies, and every ballot sealed in a tamper-evident chain with voter-verifiable receipts.",
  keywords: [
    "election management system",
    "university elections Nigeria",
    "secure online voting",
    "student union elections",
    "digital voting platform Africa",
    "anonymous ballot system",
    "verified identity voting",
    "electoral management software",
  ],
  openGraph: {
    title: "Baalot — Elections You Can Trust",
    description: "Secure, anonymous election management for universities and organisations across Africa.",
    url: DOMAIN,
    siteName: "Baalot",
    images: [{ url: `${DOMAIN}/og-image.png`, width: 1200, height: 630, alt: "Baalot — Secure Election Platform" }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baalot — Elections You Can Trust",
    description: "Secure, anonymous election management for Africa.",
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
      </head>
      <body
        className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} font-inter bg-bg text-primary antialiased`}
      >
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
