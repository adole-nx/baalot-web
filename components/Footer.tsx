import Link from "next/link";
import Logo from "./Logo";

const links = {
  Platform: [
    { label: "Ballot Builder",   href: "/platform" },
    { label: "Voter Portal",     href: "/platform" },
    { label: "Live Results",     href: "/platform" },
    { label: "Analytics",        href: "/platform" },
    { label: "Ballot Chain",     href: "/security" },
  ],
  Product: [
    { label: "Pricing",      href: "/pricing" },
    { label: "Security",     href: "/security" },
    { label: "API Docs",     href: "/docs" },
    { label: "Blog",         href: "/blog" },
  ],
  "Use Cases": [
    { label: "Universities",   href: "/platform" },
    { label: "Student Unions", href: "/platform" },
    { label: "NGOs & Orgs",   href: "/platform" },
    { label: "Enterprise",     href: "/pricing" },
    { label: "Government",     href: "/contact" },
  ],
  Company: [
    { label: "About",          href: "/about" },
    { label: "Team",           href: "/team" },
    { label: "Contact",        href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Request Demo",   href: "/contact?type=demo" },
  ],
};

// External links that open in a new tab
const externalLinks = [
  { label: "Admin Portal", href: "https://admin.baalot.site" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#030507", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pt-16 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 pr-4">
            {/* Logo — cursor-tracking eye logo */}
            <div className="mb-4">
              <Logo size="sm" href="/" />
            </div>
            <p className="text-[12px] leading-relaxed mb-5" style={{ color: "#334155" }}>
              Secure, anonymous election management for African institutions.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 live-dot" />
              <span className="font-mono text-[10px]" style={{ color: "#64748B" }}>
                110+ institutions in the directory
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "#334155" }}>
                {heading}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[12px] transition-colors hover:text-primary"
                      style={{ color: "#334155" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="font-mono text-[11px]" style={{ color: "#1E2A3A" }}>
              &copy; {new Date().getFullYear()} Baalot Technologies Ltd. All rights reserved.
            </p>
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] transition-colors hover:text-amber-500 flex items-center gap-1"
                style={{ color: "#334155" }}
              >
                {link.label}
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase"
              style={{ background: "rgba(155,93,229,0.08)", color: "#9B5DE5", border: "1px solid rgba(155,93,229,0.15)" }}
            >
              Early Access
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase"
              style={{ background: "rgba(20,184,166,0.08)", color: "#14B8A6", border: "1px solid rgba(20,184,166,0.15)" }}
            >
              Chain Sealed
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase"
              style={{ background: "rgba(255,255,255,0.04)", color: "#334155", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Encrypted In Transit
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
