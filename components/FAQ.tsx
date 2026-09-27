import { Plus } from "lucide-react";
import { faqs } from "@/lib/faq";

// Server component on purpose: native <details> keeps every answer in the
// static HTML, which is what search crawlers and AI answer engines read.
export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-5 md:px-10 lg:px-16"
      style={{ background: "#080C10" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-syne font-bold text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Questions about Baalot
          </h2>
        </div>

        <div className="divide-y" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-syne font-semibold text-[16px] md:text-[17px] text-white leading-snug">{q}</h3>
                <span
                  className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45"
                  style={{ background: "rgba(155,93,229,0.12)" }}
                  aria-hidden
                >
                  <Plus size={13} strokeWidth={2.5} style={{ color: "#9B5DE5" }} />
                </span>
              </summary>
              <p className="mt-3 pr-12 text-[14px] leading-relaxed max-w-[65ch]" style={{ color: "#94A3B8" }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
