"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CheckCircle, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { EASE, EASE_SPRING } from "@/lib/animations";
import { submitContact } from "@/lib/contact";

const inputCls =
  "w-full bg-[#070B10] border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-primary placeholder:text-[#334155] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-inter";

export default function ContactForm() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", institution: "", type: "", voters: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const { type, ...rest } = form;
      await submitContact({ source: "early-access", electionType: type, ...rest });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      data-levi-stop="4"
      className="py-24 px-5 md:px-10 lg:px-16 relative overflow-hidden"
      style={{ background: "var(--bg-void)" }}
    >
      {/* Ballot paper grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='20' height='20' fill='none' stroke='rgba(155,93,229,0.04)' stroke-width='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(155,93,229,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14"
        >
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            Get started
          </p>
          <h2
            className="font-syne font-bold text-primary"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Ready to run your first election?
          </h2>
          <p className="mt-4 text-[15px]" style={{ color: "#64748B" }}>
            Tell us about your election. We&apos;ll have you live within 48 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <div
              className="rounded-2xl p-[1px]"
              style={{ background: "linear-gradient(135deg, rgba(155,93,229,0.18), rgba(255,255,255,0.03))" }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE_SPRING }}
                    className="rounded-[calc(1rem-1px)] p-10 text-center"
                    style={{ background: "#0A0E15" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "rgba(155,93,229,0.12)", border: "1px solid rgba(155,93,229,0.3)" }}
                    >
                      <CheckCircle size={32} style={{ color: "#9B5DE5" }} />
                    </div>
                    <h3 className="font-syne font-bold text-[22px] text-primary mb-2">You&apos;re on the list.</h3>
                    <p className="text-[14px]" style={{ color: "#64748B" }}>
                      We&apos;ll reach out within 2 hours with your onboarding details.
                    </p>
                    <p className="mt-3 text-[12px]" style={{ color: "#334155" }}>
                      Or email directly:{" "}
                      <a href="mailto:hello@baalot.site" className="underline underline-offset-2" style={{ color: "#9B5DE5" }}>
                        hello@baalot.site
                      </a>
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="rounded-[calc(1rem-1px)] p-7 space-y-3"
                    style={{ background: "#0A0E15" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input required name="name" placeholder="Your name" value={form.name} onChange={set("name")} className={inputCls} />
                      <input required name="email" type="email" placeholder="Your email" value={form.email} onChange={set("email")} className={inputCls} />
                    </div>
                    <input required name="institution" placeholder="Institution / Organization" value={form.institution} onChange={set("institution")} className={inputCls} />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <select required name="type" value={form.type} onChange={set("type")} className={`${inputCls} appearance-none`}>
                        <option value="" disabled>Election type</option>
                        <option>Student Union</option>
                        <option>University Faculty</option>
                        <option>NGO / Organization</option>
                        <option>Enterprise / AGM</option>
                        <option>Government body</option>
                        <option>Other</option>
                      </select>
                      <input name="voters" placeholder="Estimated voter count" value={form.voters} onChange={set("voters")} className={inputCls} />
                    </div>
                    <textarea
                      name="message"
                      placeholder="Tell us about your election — timeline, seats, any special requirements"
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      className={`${inputCls} resize-none`}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[14px] transition-all active:scale-[0.99] disabled:opacity-70"
                      style={{
                        background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
                        color: "#FFFFFF",
                        boxShadow: "0 6px 24px rgba(155,93,229,0.3)",
                      }}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 rounded-full"
                          style={{ borderColor: "#FFFFFF", borderTopColor: "transparent" }}
                        />
                      ) : (
                        <>Request Early Access <ArrowUpRight size={15} strokeWidth={2.5} /></>
                      )}
                    </button>
                    {error && (
                      <p className="text-[13px] text-center" style={{ color: "#f87171" }} role="alert">{error}</p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar contact cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: Mail,
                title: "Talk to Sales",
                desc: "Ready to run an election? Our team responds within 2 hours on business days.",
                cta: "hello@baalot.site",
                href: "mailto:hello@baalot.site",
                color: "#9B5DE5",
              },
              {
                icon: MessageCircle,
                title: "Chat on WhatsApp",
                desc: "Prefer a quick conversation? Reach us directly.",
                cta: "Open WhatsApp →",
                href: "https://wa.me/2349000000000",
                color: "#22c55e",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.title}
                  href={card.href}
                  className="flex gap-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01] block"
                  style={{ background: "#0A0E15", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${card.color}10`, border: `1px solid ${card.color}20` }}
                  >
                    <Icon size={17} style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-primary mb-1">{card.title}</p>
                    <p className="text-[12px] mb-2" style={{ color: "#64748B" }}>{card.desc}</p>
                    <p className="text-[12px] font-medium" style={{ color: card.color }}>{card.cta}</p>
                  </div>
                </a>
              );
            })}

            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(155,93,229,0.04)", border: "1px solid rgba(155,93,229,0.12)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "#9B5DE5" }}>
                Why act now
              </p>
              {[
                "Free tier — no credit card required",
                "Live within 48 hours of sign-up",
                "Free ZK audit on your first election",
                "Cancel or downgrade any time",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[13px]" style={{ color: "#64748B" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
