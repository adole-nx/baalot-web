"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/animations";

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Your first pilot election, on us",
    accent: "#64748B",
    highlight: false,
    features: [
      "Up to 500 voters",
      "1 active election",
      "Chain-sealed results",
      "Web voting interface",
      "Basic audit trail",
      "Email support",
    ],
    cta: "Request Access",
    ctaHref: "/contact?plan=starter",
  },
  {
    name: "Institution",
    price: "₦150,000",
    sub: "per election · unlimited voters",
    accent: "#9B5DE5",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited voters",
      "Multiple concurrent elections",
      "Optional NIN / BVN ID badge (via Prembly)",
      "Encrypted ballots — stored unreadable",
      "Full ballot-chain audit trail",
      "Live results dashboard",
      "Voter receipts for every ballot",
    ],
    cta: "Get Started",
    ctaHref: "/contact?plan=institution",
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Government bodies & large orgs",
    accent: "#14B8A6",
    highlight: false,
    features: [
      "Everything in Institution",
      "Multi-election management",
      "Custom institution branding",
      "Priority support channel",
      "Dedicated account manager",
      "On-site training",
    ],
    cta: "Talk to Us",
    ctaHref: "/contact?plan=enterprise",
  },
];

export default function PricingTeaser() {
  return (
    <section
      id="pricing-section"
      data-levi-stop="3"
      className="py-24 px-5 md:px-10 lg:px-16 overflow-hidden"
      style={{ background: "#080C10" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            Pricing
          </p>
          <h2
            className="font-syne font-bold text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-[15px]" style={{ color: "#64748B" }}>
            Pay per election — only when you&apos;re ready. No hidden fees, no per-voter charges.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.1 }}
              className="relative rounded-2xl p-[1px] flex flex-col cursor-pointer"
              style={{
                background: plan.highlight
                  ? "linear-gradient(135deg, rgba(155,93,229,0.35), rgba(155,93,229,0.08), rgba(155,93,229,0.03))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                boxShadow: plan.highlight ? "0 0 60px rgba(155,93,229,0.12)" : "none",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(155,93,229,0.4)",
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div
                className="flex flex-col flex-1 rounded-[calc(1rem-1px)] p-6"
                style={{
                  background: plan.highlight ? "#0A0E15" : "#0D1117",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <p className="font-syne font-bold text-[18px] text-white mb-1">{plan.name}</p>
                <p className="text-[12px] mb-5" style={{ color: "#64748B" }}>{plan.sub}</p>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className="font-syne font-bold"
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                      letterSpacing: "-0.03em",
                      color: plan.highlight ? "#9B5DE5" : "#F0F4F8",
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span className="text-[11px] ml-2 block mt-0.5" style={{ color: "#64748B" }}>
                      {plan.sub}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                        style={{ background: plan.highlight ? "rgba(155,93,229,0.15)" : "rgba(255,255,255,0.06)" }}
                      >
                        <Check size={9} style={{ color: plan.highlight ? "#9B5DE5" : "#64748B" }} strokeWidth={2.5} />
                      </span>
                      <span className="text-[13px]" style={{ color: "#64748B" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-[13px] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: plan.highlight
                      ? "linear-gradient(135deg, #9B5DE5, #B27FF0)"
                      : "rgba(255,255,255,0.06)",
                    color: plan.highlight ? "#FFFFFF" : "#F0F4F8",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: plan.highlight ? "0 4px 16px rgba(155,93,229,0.25)" : "none",
                  }}
                >
                  {plan.cta}
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center mt-8 text-[12px]" style={{ color: "#334155" }}>
          All plans include encrypted transport, encrypted ballots, and we collect only the data an election actually needs.{" "}
          <Link href="/pricing" className="ml-1 underline underline-offset-2 hover:text-white transition-colors" style={{ color: "#64748B" }}>
            See full feature comparison →
          </Link>
        </p>
      </div>
    </section>
  );
}
