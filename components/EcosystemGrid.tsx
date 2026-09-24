"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

interface Integration {
  name: string;
  category: string;
  color: string;
  icon: React.ReactNode;
}

const INTEGRATIONS: Integration[] = [
  {
    name: "Firebase",
    category: "Auth & Storage",
    color: "#F57C00",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    category: "Deployment",
    color: "#FFFFFF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
  },
  {
    name: "Google Auth",
    category: "Identity",
    color: "#4285F4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
      </svg>
    ),
  },
  {
    name: "Sentry",
    category: "Monitoring",
    color: "#362D59",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.492 0l-6.54 11.316c1.63.938 3.045 2.26 4.108 3.857L14.843 11h3.01c-.084-.248-.168-.497-.27-.746-.898-2.244-2.397-4.2-4.329-5.618a10.45 10.45 0 011.32-1.867C17.73 4.995 19.5 7.81 20.46 11h3.03A15.972 15.972 0 0014.492 0zM.51 22.5h8.014c.2-.476.419-.947.652-1.402H.51zm6.498-5.258A14.978 14.978 0 008.2 21.1H2.22l4.788-8.286c.308.5.59 1.024.84 1.577a15.19 15.19 0 01.886 3.172A12.497 12.497 0 017.008 17.242z" />
      </svg>
    ),
  },
  {
    name: "Expo",
    category: "Mobile",
    color: "#000000",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 21.967c.22.022.44.033.663.033C2.247 22 3.558 21.29 4.37 20l7.63-13.25L19.63 20c.813 1.29 2.122 2 3.706 2 .224 0 .446-.011.664-.033L12 0 0 21.967z" />
      </svg>
    ),
  },
  {
    name: "Prembly",
    category: "Identity Verification",
    color: "#008751",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="M15 8h2M15 12h2M7 16h10" />
      </svg>
    ),
  },
  {
    name: "Paystack",
    category: "Payments",
    color: "#006B3F",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Cloudflare",
    category: "Edge Network",
    color: "#F38020",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.625 15.89l.25-.862c.025-.087-.05-.175-.137-.162l-4.675.662a.162.162 0 01-.175-.175l.025-.087.937-3.225c.025-.088-.05-.175-.138-.162l-1.637.237a.162.162 0 01-.175-.162v-.013l.038-.125L12 9.3c.025-.088-.05-.175-.138-.162l-1.625.237a.15.15 0 01-.175-.162l.038-.137.387-1.35c.025-.088-.05-.175-.138-.162l-4.375.637c-.075.013-.137.075-.138.162L5.5 12.5c0 .088.075.15.162.138l1.225-.175-.325 1.137c-.025.088.05.175.138.162l.862-.125-.337 1.175c-.025.088.05.175.138.162l9.125-1.3c.075-.013.137-.075.138-.162l-.001-.625z" />
      </svg>
    ),
  },
];

const DOUBLED = [...INTEGRATIONS, ...INTEGRATIONS];

export default function EcosystemGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 overflow-hidden" style={{ background: "#0D1117" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="px-5 md:px-10 lg:px-16 max-w-site mx-auto mb-12 text-center"
      >
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
          Ecosystem
        </p>
        <h2
          className="font-syne font-bold text-primary"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          Built on infrastructure you already trust.
        </h2>
        <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ color: "#64748B" }}>
          Every layer of Baalot runs on battle-tested, enterprise-grade platforms — nothing home-rolled where it matters.
        </p>
      </motion.div>

      {/* Marquee row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
        className="relative"
      >
        {/* Edge fade masks */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #0D1117, transparent)" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, #0D1117, transparent)" }}
          aria-hidden="true"
        />

        <div className="flex gap-5 w-max marquee-left py-3">
          {DOUBLED.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="card-dark flex items-center gap-3 px-5 py-3.5 rounded-xl flex-shrink-0 select-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                minWidth: 160,
              }}
            >
              <span style={{ color: item.color, opacity: 0.85, flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-primary leading-tight">{item.name}</p>
                <p className="text-[10px] leading-tight mt-0.5" style={{ color: "#4B5563" }}>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
