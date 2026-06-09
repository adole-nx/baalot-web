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
import TweetWall          from "@/components/TweetWall";
import AudienceCTA        from "@/components/AudienceCTA";
import PricingTeaser      from "@/components/PricingTeaser";
import ContactForm        from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
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
      <TweetWall />
      <PricingTeaser />
      <AudienceCTA />
      <ContactForm />
    </main>
  );
}
