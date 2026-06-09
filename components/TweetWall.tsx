"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { EASE } from "@/lib/animations";

interface Tweet {
  handle: string;
  name: string;
  text: string;
  time: string;
  likes: number;
  avatar: string;
  accent: string;
}

const ROW_A: Tweet[] = [
  {
    handle: "@emeka.c.obi",
    name: "Emeka Obi",
    text: "Just voted on Baalot and got my blockchain receipt in under 30 seconds. No paper, no queue, no dispute possible. This is what elections should feel like.",
    time: "2h",
    likes: 142,
    avatar: "EO",
    accent: "#9B5DE5",
  },
  {
    handle: "@sug_covenant_official",
    name: "SUG Covenant University",
    text: "Our 6,000-student election ran with ZERO disputes. The ZK audit showed every vote, every candidate, every count. No more result manipulation at our institution.",
    time: "1d",
    likes: 389,
    avatar: "SC",
    accent: "#14B8A6",
  },
  {
    handle: "@ngozi_eze_unilag",
    name: "Ngozi Eze",
    text: "NIN verification gave us absolute confidence in our voter registry. 8,200 verified students voted seamlessly. Setup took less than an afternoon.",
    time: "3d",
    likes: 217,
    avatar: "NE",
    accent: "#9B5DE5",
  },
  {
    handle: "@adekunle_fashola",
    name: "Adekunle Fashola",
    text: "We ran a Pan-African NGO election across 6 countries on Baalot. Real-time dashboard, every region live simultaneously. Remarkable infrastructure for civic work.",
    time: "5d",
    likes: 503,
    avatar: "AF",
    accent: "#14B8A6",
  },
  {
    handle: "@prof_ibrahim_sule",
    name: "Prof. Ibrahim Sule",
    text: "First time in our university's history no student challenged the result. The on-chain receipt made everything independently verifiable. Trust came from proof, not promises.",
    time: "6d",
    likes: 671,
    avatar: "IS",
    accent: "#9B5DE5",
  },
  {
    handle: "@chidi_cs400_buk",
    name: "Chidi Nwosu",
    text: "Voted from my hostel room in 2 minutes. Checked my receipt on-chain immediately after. This is genuinely different from anything I've seen in student elections.",
    time: "1w",
    likes: 88,
    avatar: "CN",
    accent: "#14B8A6",
  },
  {
    handle: "@rector_aisha_fed",
    name: "Rector Aisha Mohammed",
    text: "Set up our federal polytechnic on Baalot in 20 minutes. 3,500 students voted without a single technical issue. The real-time results dashboard was a game-changer.",
    time: "1w",
    likes: 294,
    avatar: "AM",
    accent: "#9B5DE5",
  },
  {
    handle: "@usman_backend_dev",
    name: "Usman Garba",
    text: "Integrated the Baalot API over a weekend. Docs are actually good. BBC chain verification just works. Rare to say that about election-tech infrastructure.",
    time: "2w",
    likes: 156,
    avatar: "UG",
    accent: "#14B8A6",
  },
  {
    handle: "@grace_oghenekevwe",
    name: "Grace Oghenekevwe",
    text: "Poor network at 11pm and I still cast my vote successfully. The reliability alone is worth everything. UNIBEN elections will never go back to paper.",
    time: "2w",
    likes: 201,
    avatar: "GO",
    accent: "#9B5DE5",
  },
  {
    handle: "@dr_okafor_fce_abeokuta",
    name: "Dr. Chisom Okafor",
    text: "Three simultaneous departmental elections, all on Baalot. Every result published on-chain within seconds of closing. No manual counting, no drama.",
    time: "3w",
    likes: 347,
    avatar: "CO",
    accent: "#14B8A6",
  },
];

const ROW_B: Tweet[] = [
  {
    handle: "@tolani_law_300",
    name: "Tolani Adeyemi",
    text: "Biometric check-in felt secure without being invasive. Cast my vote, blockchain confirmed, done. I've voted three times on Baalot now and every experience is clean.",
    time: "3h",
    likes: 93,
    avatar: "TA",
    accent: "#14B8A6",
  },
  {
    handle: "@ibrahim_kwara_rector",
    name: "Rector Ibrahim Bello",
    text: "Six faculty elections in a single day. Every result published on-chain within seconds of each closing. We will never go back to manual counting.",
    time: "2d",
    likes: 412,
    avatar: "IB",
    accent: "#9B5DE5",
  },
  {
    handle: "@adaeze_uniport_med",
    name: "Adaeze Nwofor",
    text: "Was skeptical about blockchain voting but Baalot made it genuinely simple. My receipt links directly to the chain. I verified it myself with zero technical knowledge.",
    time: "4d",
    likes: 178,
    avatar: "AN",
    accent: "#14B8A6",
  },
  {
    handle: "@hakeem_sug_lasu",
    name: "Hakeem Yusuf",
    text: "Moved from paper voting to Baalot this year. Turnout jumped from 31% to 78%. Students participate when they believe their vote is safe.",
    time: "1w",
    likes: 592,
    avatar: "HY",
    accent: "#9B5DE5",
  },
  {
    handle: "@sarah_osagie_paya",
    name: "Sarah Osagie",
    text: "Running elections across 4 West African countries used to require weeks of coordination. Baalot turned it into a single dashboard and a confident result.",
    time: "1w",
    likes: 267,
    avatar: "SO",
    accent: "#14B8A6",
  },
  {
    handle: "@olumide_cto_fintech",
    name: "Olumide Adeyemi",
    text: "As a CTO I needed verifiable audit trails. Baalot's on-chain receipts are exactly that. Full integration took 3 days including testing. Solid engineering.",
    time: "2w",
    likes: 184,
    avatar: "OA",
    accent: "#9B5DE5",
  },
  {
    handle: "@fatima_admin_ss",
    name: "Fatima Idris",
    text: "Student welfare elections, hostel elections, faculty rep voting. All on Baalot now. Zero disputes across all three. Students stopped questioning results entirely.",
    time: "2w",
    likes: 323,
    avatar: "FI",
    accent: "#14B8A6",
  },
  {
    handle: "@emeka_law_calabar",
    name: "Emeka Nnamdi",
    text: "Voted remotely while on internship in Lagos. My campus election was in Calabar, my vote was counted, blockchain confirmed it. Distance is no longer a barrier.",
    time: "3w",
    likes: 441,
    avatar: "EN",
    accent: "#9B5DE5",
  },
  {
    handle: "@dr_bello_chancellor",
    name: "Dr. Musa Bello",
    text: "Board elections for a 50-member institution. Results sealed on-chain, immutable, no back-room politics possible. This is what governance infrastructure should look like.",
    time: "1mo",
    likes: 508,
    avatar: "MB",
    accent: "#14B8A6",
  },
  {
    handle: "@akin_dev_baalot",
    name: "Akinwale Olawale",
    text: "The Baalot API docs are surprisingly clean. Got our custom election flow running in 48 hours including BBC chain verification. That's rare for civic-tech infra.",
    time: "1mo",
    likes: 139,
    avatar: "AO",
    accent: "#9B5DE5",
  },
];

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div
      className="card-dark card-glow flex-shrink-0 w-[300px] md:w-[340px] p-5 flex flex-col gap-3 select-none"
      style={{ background: "#0A0E16" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-bold text-[11px] flex-shrink-0"
            style={{
              background: `${tweet.accent}18`,
              color: tweet.accent,
              border: `1px solid ${tweet.accent}28`,
            }}
          >
            {tweet.avatar}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-primary leading-tight">{tweet.name}</p>
            <p className="text-[11px] leading-tight" style={{ color: "#4B5563" }}>{tweet.handle}</p>
          </div>
        </div>
        {/* X mark */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#374151", flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      </div>

      {/* Tweet text */}
      <p
        className="text-[13px] leading-[1.6] flex-1"
        style={{ color: "#8B9AB0" }}
      >
        {tweet.text}
      </p>

      {/* Footer */}
      <div
        className="flex items-center gap-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[11px]" style={{ color: "#374151" }}>{tweet.time}</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <Heart size={12} style={{ color: "#EF4444" }} />
          <span className="text-[11px]" style={{ color: "#6B7280" }}>{tweet.likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ tweets, direction }: { tweets: Tweet[]; direction: "left" | "right" }) {
  const doubled = [...tweets, ...tweets];
  return (
    <div className="overflow-hidden relative">
      {/* Fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #080C10, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #080C10, transparent)" }}
        aria-hidden="true"
      />
      <div
        className={`flex gap-4 w-max py-2 ${direction === "left" ? "marquee-left" : "marquee-right"}`}
      >
        {doubled.map((tweet, i) => (
          <TweetCard key={`${tweet.handle}-${i}`} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}

export default function TweetWall() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: "#080C10" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="px-5 md:px-10 lg:px-16 max-w-6xl mx-auto mb-12"
      >
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#9B5DE5" }}>
          Testimonials
        </p>
        <h2
          className="font-syne font-bold text-primary max-w-xl"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          Trusted by people who can&apos;t afford to be wrong.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed max-w-lg" style={{ color: "#64748B" }}>
          Rectors, student union leaders, and developers across Africa share what running on-chain elections actually feels like.
        </p>
      </motion.div>

      {/* Row 1 - scrolls left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="mb-4"
      >
        <MarqueeRow tweets={ROW_A} direction="left" />
      </motion.div>

      {/* Row 2 - scrolls right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
      >
        <MarqueeRow tweets={ROW_B} direction="right" />
      </motion.div>
    </section>
  );
}
