import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import LeviAgent from "@/components/LeviAgent";
import SovereigntyStrip from "@/components/SovereigntyStrip";

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

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: "Baalot — Blockchain Election Management for African Universities",
  description:
    "Run transparent, tamper-proof elections at your university or organisation. Baalot uses blockchain and ZK proofs to make every vote count — and verifiable.",
  openGraph: {
    title: "Baalot — Elections You Can Trust",
    description: "Blockchain-powered election management for universities and organisations across Africa.",
    url: DOMAIN,
    siteName: "Baalot",
    images: [{ url: `${DOMAIN}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baalot — Elections You Can Trust",
    description: "Blockchain-powered election management for Africa.",
    images: [`${DOMAIN}/og-image.png`],
  },
  alternates: { canonical: DOMAIN },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} font-inter bg-bg text-primary antialiased`}
      >
        <ScrollProgressBar />
        <CustomCursor />
        <LeviAgent />
        <Navbar />
        <SovereigntyStrip />
        {children}
        <Footer />
      </body>
    </html>
  );
}
