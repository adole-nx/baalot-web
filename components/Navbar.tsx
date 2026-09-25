"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ArrowUpRight, ExternalLink } from "lucide-react";
import { EASE } from "@/lib/animations";
import Logo from "./Logo";

// Six flat links. The old Platform mega-menu had nine entries that all led to
// two pages (Live Results twice), and Use Cases led to the same pages again.
const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Security", href: "/security" },
  { label: "Pricing",  href: "/pricing" },
  { label: "Docs",     href: "/docs" },
  { label: "About",    href: "/about" },
  { label: "Blog",     href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating pill navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none px-4">
        <motion.div
          className="pointer-events-auto w-full max-w-5xl"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          {/* Double-bezel outer shell */}
          <div
            className="rounded-full p-[1px] transition-all duration-500"
            style={{
              background: scrolled
                ? "linear-gradient(135deg, rgba(155,93,229,0.2), rgba(255,255,255,0.04))"
                : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            }}
          >
            {/* Inner core */}
            <nav
              className="rounded-full flex items-center justify-between px-4 md:px-5 h-14 transition-all duration-500"
              style={{
                background: scrolled ? "rgba(8,12,16,0.94)" : "rgba(8,12,16,0.72)",
                backdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "blur(14px)",
                WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "blur(14px)",
                boxShadow: scrolled
                  ? "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(155,93,229,0.06) inset"
                  : "none",
              }}
            >
              {/* Logo — cursor-tracking eye logo */}
              <Logo size="sm" href="/" />

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3.5 py-2 text-sm font-medium text-secondary hover:text-primary rounded-full hover:bg-white/[0.05] transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Right CTAs */}
              <div className="flex items-center gap-2.5">
                {/* Admin portal link — desktop only */}
                <a
                  href="https://admin.baalot.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-medium transition-all duration-200 hover:bg-white/[0.06]"
                  style={{ color: "#64748B" }}
                >
                  Admin
                  <ExternalLink size={11} className="opacity-60" />
                </a>

                <Link
                  href="/contact"
                  className="hidden md:inline-flex items-center gap-0 pl-4 pr-1 py-1 rounded-full text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 20px rgba(155,93,229,0.3), 0 1px 0 rgba(255,255,255,0.3) inset",
                  }}
                >
                  Start Free Election
                  <span className="ml-2 w-7 h-7 rounded-full bg-black/15 flex items-center justify-center shrink-0">
                    <ArrowUpRight size={12} strokeWidth={2.5} />
                  </span>
                </Link>

                <button
                  className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] text-primary hover:bg-white/10 transition-all"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Toggle navigation"
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </nav>
          </div>
        </motion.div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-4 top-[76px] z-40 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8,12,16,0.98)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(155,93,229,0.06) inset",
            }}
          >
            <div className="p-5">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-[15px] font-medium text-secondary hover:text-primary hover:bg-white/[0.05] transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ArrowUpRight size={15} className="opacity-30" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-5 pt-5 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-[15px]"
                  style={{
                    background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                    color: "#FFFFFF",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Start Free Election
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>
                <a
                  href="https://admin.baalot.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-[13px] font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#64748B",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Admin Portal
                  <ExternalLink size={13} className="opacity-60" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
