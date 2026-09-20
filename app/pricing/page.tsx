"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import SplitHeading from "@/components/SplitHeading";
import SectionReveal from "@/components/SectionReveal";
import AudienceCTA from "@/components/AudienceCTA";

const EASE = [0.16, 1, 0.3, 1] as const;

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Perfect for your first pilot election",
    accent: "#6B7280",
    featured: false,
    features: [
      "Up to 500 voters",
      "1 active election",
      "Anonymous, server-verified results",
      "Web voting interface",
      "Basic audit trail",
      "Email support",
    ],
    cta: "Request Access",
    ctaHref: "/contact",
  },
  {
    name: "Institution",
    price: "₦150,000",
    sub: "per election · unlimited voters",
    accent: "#9B5DE5",
    featured: true,
    features: [
      "Unlimited voters",
      "Multiple concurrent elections",
      "NIN / BVN voter verification",
      "Anonymous ballots",
      "Full audit trail",
      "Live results dashboard",
      "Voter receipts for every ballot",
      "Dedicated setup support",
      "< 2 week deployment",
    ],
    cta: "Get Started",
    ctaHref: "/contact",
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "For government bodies & large orgs",
    accent: "#14B8A6",
    featured: false,
    features: [
      "Everything in Institution",
      "Multi-election management",
      "Custom institution branding",
      "Priority support channel",
      "Dedicated account manager",
      "On-site training",
    ],
    cta: "Talk to Us",
    ctaHref: "/contact",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-bg min-h-screen">
      <section className="section-pad pt-36">
        <div className="max-w-site mx-auto">
          <SectionReveal variant="clip-up" className="text-center mb-16">
            <p className="label-tag mb-4">Pricing</p>
            <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4">
              <SplitHeading text="Simple, transparent pricing." mode="mount" />
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              No hidden fees. No per-voter charges. Pay per election — and only when you&apos;re ready.
            </p>
          </SectionReveal>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative flex flex-col rounded-2xl p-8"
                style={{
                  background: plan.featured ? `rgba(155,93,229,0.08)` : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: plan.featured
                    ? `1px solid rgba(155,93,229,0.4)`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: plan.featured ? "0 0 60px rgba(155,93,229,0.12)" : "none",
                }}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <p className="font-syne font-bold text-sm mb-1" style={{ color: plan.accent }}>
                    {plan.name}
                  </p>
                  <p className="font-syne font-extrabold text-4xl text-white">{plan.price}</p>
                  <p className="text-muted text-xs mt-1">{plan.sub}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: plan.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`group relative inline-flex justify-center w-full py-3.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-200 ${
                    plan.featured
                      ? "bg-accent text-white"
                      : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  )}
                  <span className="relative">{plan.cta}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ note */}
          <motion.p
            className="text-center text-muted text-sm mt-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            All plans include free setup assistance.{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact us
            </Link>{" "}
            with questions.
          </motion.p>
        </div>
      </section>
      <AudienceCTA />
    </main>
  );
}
