"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import { submitContact } from "@/lib/contact";

const EASE = [0.16, 1, 0.3, 1] as const;

const roles = [
  "Student Union / SUG",
  "Faculty / Departmental Admin",
  "NGO / Cooperative",
  "Corporate Organisation",
  "Government / Civic Body",
  "Other",
];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-surface border border-border text-white placeholder:text-muted text-sm outline-none focus:border-accent/50 transition-colors";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", institution: "", role: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await submitContact({ source: "demo-request", ...form });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg section-pad pt-36">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-12"
        >
          <p className="label-tag mb-3">Get In Touch</p>
          <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4">
            Request a Demo
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            Tell us about your institution and what you&apos;re trying to achieve.
            We&apos;ll reply within one business day.
          </p>
        </motion.div>

        {submitted ? (
          <SectionReveal variant="scale">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-10 rounded-2xl text-center"
            style={{
              background: "rgba(59,110,248,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(59,110,248,0.3)",
            }}
          >
            <p className="text-4xl mb-4">✅</p>
            <h2 className="font-syne font-bold text-2xl text-white mb-2">Message sent!</h2>
            <p className="text-muted">We&apos;ve received your request and will reply within one business day.</p>
          </motion.div>
          </SectionReveal>
        ) : (
          <SectionReveal variant="blur" delay={0.1}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Full Name *</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Chidi Okafor" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Email Address *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="chidi@unibenin.edu.ng" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Institution / Organisation *</label>
              <input name="institution" required value={form.institution} onChange={handleChange} placeholder="University of Benin" className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Your Role *</label>
              <select name="role" required value={form.role} onChange={handleChange} className={`${inputCls} appearance-none`}>
                <option value="" disabled>Select your role…</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">What are you trying to achieve? *</label>
              <textarea
                name="message" required rows={5} value={form.message} onChange={handleChange}
                placeholder="Tell us about your upcoming election — when is it, how many voters, what positions?"
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-xl bg-accent font-semibold text-sm overflow-hidden disabled:opacity-70"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">{loading ? "Sending…" : "Send Message"}</span>
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center" role="alert">{error}</p>
            )}

            <p className="text-muted text-xs text-center">
              Or email us directly at{" "}
              <a href="mailto:hello@baalot.site" className="text-accent hover:underline">hello@baalot.site</a>
            </p>
          </motion.form>
          </SectionReveal>
        )}
      </div>
    </main>
  );
}
