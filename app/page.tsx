import type { Metadata } from "next";
import Hero               from "@/components/Hero";
import TrustStrip         from "@/components/TrustStrip";
import ProblemSection     from "@/components/ProblemSection";
import SolutionSection    from "@/components/SolutionSection";
import HowItWorks         from "@/components/HowItWorks";
import StatsImpact        from "@/components/StatsImpact";
import FeaturedVideo      from "@/components/FeaturedVideo";
import UseCases           from "@/components/UseCases";
import Security           from "@/components/Security";
import AppFeatureShowcase from "@/components/AppFeatureShowcase";
import AudienceCTA        from "@/components/AudienceCTA";
import PricingTeaser      from "@/components/PricingTeaser";
import ContactForm        from "@/components/ContactForm";
import FAQ                from "@/components/FAQ";
import { faqJsonLd }      from "@/lib/faq";

export const metadata: Metadata = { alternates: { canonical: "https://baalot.site/" } };

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <StatsImpact />
      <FeaturedVideo />
      <UseCases />
      <Security />
      <AppFeatureShowcase />
      <PricingTeaser />
      <AudienceCTA />
      <FAQ />
      <ContactForm />
    </main>
  );
}
