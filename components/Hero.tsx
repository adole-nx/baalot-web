"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play, Shield, Zap, Globe } from "lucide-react";
import { EASE, staggerContainer, fadeUp } from "@/lib/animations";
import VideoModal from "@/components/VideoModal";

// ─── Ambient particle canvas ───────────────────────────────────
function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      da: number;
    }

    const particles: Particle[] = [];
    const COUNT = 80;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.12 - 0.06,
          r: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.6 + 0.1,
          da: (Math.random() - 0.5) * 0.006,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        p.alpha = Math.max(0.05, Math.min(0.75, p.alpha + p.da));
        if (p.alpha <= 0.06 || p.alpha >= 0.74) p.da *= -1;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,93,229,${p.alpha * 0.7})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(155,93,229,${(1 - dist / 120) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}

// ─── Globe Visual ───────────────────────────────────────────────
const ELECTION_CITIES = [
  { lat: 6.5,   lon: 3.4,   active: true  },
  { lat: 9.1,   lon: 7.4,   active: true  },
  { lat: -1.3,  lon: 36.8,  active: true  },
  { lat: 5.6,   lon: -0.2,  active: false },
  { lat: 12.0,  lon: 8.5,   active: true  },
  { lat: 30.1,  lon: 31.2,  active: false },
  { lat: 14.7,  lon: -17.4, active: false },
  { lat: -26.2, lon: 28.0,  active: false },
];

const AFRICA_COORDS: [number,number][] = [
  [36,-6],[37,10],[33,25],[31,32],
  [22,37],[16,40],[12,44],[11,51],
  [1,42],[-3,40],[-10,40],
  [-17,36],[-26,33],[-34,26],
  [-34,20],[-30,17],[-22,14],
  [-12,13],[-5,12],[0,9],
  [4,8],[6,2],[5,-1],
  [5,-5],[8,-12],[14,-17],
  [22,-17],[28,-14],[36,-6],
];

const ARC_PAIRS = [[0,1],[1,4],[0,2],[2,7],[4,5]];

function GlobeVisual({ size = 460 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = size;
    const CX   = SIZE / 2;
    const CY   = SIZE / 2;
    const R    = SIZE * 0.41;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width         = SIZE * dpr;
    canvas.height        = SIZE * dpr;
    canvas.style.width   = `${SIZE}px`;
    canvas.style.height  = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const DEG = Math.PI / 180;
    let t = 0;
    let animId: number;

    const project = (lat: number, lon: number, lon0: number) => {
      const φ  = lat  * DEG;
      const λ  = lon  * DEG;
      const φ0 = 8    * DEG;
      const λ0 = lon0 * DEG;
      const cosC =
        Math.sin(φ0)*Math.sin(φ) +
        Math.cos(φ0)*Math.cos(φ)*Math.cos(λ - λ0);
      const x = R * Math.cos(φ) * Math.sin(λ - λ0);
      const y = R * (Math.cos(φ0)*Math.sin(φ) - Math.sin(φ0)*Math.cos(φ)*Math.cos(λ - λ0));
      return { x: CX + x, y: CY - y, visible: cosC >= 0 };
    };

    const drawGrid = (lon0: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(155,93,229,0.07)";
      ctx.lineWidth   = 0.6;
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, lon0);
          if (!p.visible) { started = false; continue; }
          if (started) { ctx.lineTo(p.x, p.y); } else { ctx.moveTo(p.x, p.y); started = true; }
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = project(lat, lon, lon0);
          if (!p.visible) { started = false; continue; }
          if (started) { ctx.lineTo(p.x, p.y); } else { ctx.moveTo(p.x, p.y); started = true; }
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawAfrica = (lon0: number) => {
      ctx.save();
      ctx.beginPath();
      let started = false;
      for (const [lat, lon] of AFRICA_COORDS) {
        const p = project(lat, lon, lon0);
        if (!p.visible) { started = false; continue; }
        if (started) { ctx.lineTo(p.x, p.y); } else { ctx.moveTo(p.x, p.y); started = true; }
      }
      ctx.closePath();
      ctx.fillStyle   = "rgba(155,93,229,0.07)";
      ctx.strokeStyle = "rgba(155,93,229,0.22)";
      ctx.lineWidth   = 1;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      t += 0.012;
      const lon0 = (t * 5) % 360;

      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = "#030507";
      ctx.fillRect(0, 0, SIZE, SIZE);

      const bg = ctx.createRadialGradient(CX - 50, CY - 50, 0, CX, CY, R);
      bg.addColorStop(0, "rgba(155,93,229,0.06)");
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      drawGrid(lon0);
      drawAfrica(lon0);

      for (const [ai, bi] of ARC_PAIRS) {
        const pA = project(ELECTION_CITIES[ai].lat, ELECTION_CITIES[ai].lon, lon0);
        const pB = project(ELECTION_CITIES[bi].lat, ELECTION_CITIES[bi].lon, lon0);
        if (!pA.visible || !pB.visible) continue;
        ctx.save();
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = "rgba(155,93,229,0.18)";
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
        ctx.setLineDash([]);
        const prog = ((t * 0.8 + ai * 1.3) % (Math.PI * 2)) / (Math.PI * 2);
        const dotX = pA.x + (pB.x - pA.x) * prog;
        const dotY = pA.y + (pB.y - pA.y) * prog;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#14B8A6";
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // Globe border
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(155,93,229,0.25)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // City dots
      for (const city of ELECTION_CITIES) {
        const p = project(city.lat, city.lon, lon0);
        if (!p.visible) continue;
        if (Math.hypot(p.x - CX, p.y - CY) > R) continue;
        const pulse = (Math.sin(t * 1.8 + city.lat * 0.3) + 1) * 0.5;
        if (city.active) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 + pulse * 9, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(155,93,229,${0.4 - pulse * 0.35})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, city.active ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = city.active ? "#9B5DE5" : "rgba(155,93,229,0.4)";
        ctx.fill();
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
        grd.addColorStop(0, city.active ? "rgba(155,93,229,0.35)" : "rgba(155,93,229,0.12)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(p.x - 12, p.y - 12, 24, 24);
      }

      // Rotating tick ring
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(t * 0.08);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const big   = i % 3 === 0;
        const r1    = R + 10;
        const r2    = r1 + (big ? 8 : 4);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.strokeStyle = `rgba(155,93,229,${big ? 0.5 : 0.2})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Outer dashed ring
      ctx.beginPath();
      ctx.arc(CX, CY, R + 22, 0, Math.PI * 2);
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = "rgba(155,93,229,0.08)";
      ctx.lineWidth   = 0.6;
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${size * 1.15}px`,
          height: `${size * 1.15}px`,
          background: "radial-gradient(ellipse, rgba(155,93,229,0.18) 0%, transparent 65%)",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          filter: "blur(20px)",
        }}
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        aria-label="Globe showing Baalot election activity across Africa"
        style={{ maxWidth: "100%", imageRendering: "auto" }}
      />

      {/* Live stat — top-right */}
      <div className="absolute top-4 right-4 text-right pointer-events-none">
        <div className="flex items-center gap-1.5 justify-end">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="font-mono text-[9px]" style={{ color: "#9B5DE5" }}>4 ELECTIONS LIVE</span>
        </div>
        <p className="font-mono text-[8px] mt-0.5" style={{ color: "#334155" }}>32 institutions</p>
      </div>

      {/* Coverage — bottom-left */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <p className="font-mono text-[8px]" style={{ color: "#14B8A6" }}>6 COUNTRIES</p>
        <p className="font-mono text-[8px] mt-0.5" style={{ color: "#334155" }}>200K+ votes secured</p>
      </div>
    </div>
  );
}

// ─── Hero phases — cycling headline word, subtitle, and globe tint ──────────
const PHASES = [
  {
    word: "Democratic",
    color: "#9B5DE5",
    hue: 0,
    label: "ELECTIONS LIVE",
    subtitle:
      "Blockchain-secured. AI-verified. Run your next election on Baalot — the platform Africa's institutions trust when it matters most.",
  },
  {
    word: "Transparent",
    color: "#14B8A6",
    hue: 260,
    label: "FULLY AUDITABLE",
    subtitle:
      "Every vote is a public blockchain transaction. Every result is independently auditable by anyone. No black boxes, ever.",
  },
  {
    word: "Tamper-Proof",
    color: "#F59E0B",
    hue: 120,
    label: "ZK VERIFIED",
    subtitle:
      "Zero-knowledge proofs mean no one — not even Baalot — can alter a single ballot after it has been cast.",
  },
] as const;

// ─── Stat pill ──────────────────────────────────────────────────
function StatPill({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Shield }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Icon size={14} style={{ color: "#9B5DE5", flexShrink: 0 }} />
      <div>
        <p className="font-syne font-bold text-[18px] leading-none text-primary">{value}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>{label}</p>
      </div>
    </div>
  );
}

// ─── Main Hero ──────────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [phase, setPhase] = useState(0);
  const hasCycledRef = useRef(false);

  // Auto-advance phase every 3.2s
  useEffect(() => {
    const id = setInterval(() => {
      hasCycledRef.current = true;
      setPhase((p) => (p + 1) % PHASES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Text fades and lifts as user scrolls
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.5],  [0, -50]);

  // Globe follows scroll — moves up, shrinks, and fades out
  const globeY       = useTransform(scrollYProgress, [0, 1],    [0, -200]);
  const globeScale   = useTransform(scrollYProgress, [0, 0.75], [1, 0.82]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      data-levi-stop="0"
      className="relative min-h-screen flex flex-col items-center overflow-hidden"
      style={{ background: "var(--bg-void)" }}
    >
      {/* Ambient particles */}
      <AmbientParticles />

      {/* Background glows */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(155,93,229,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(20,184,166,0.06) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Hex grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpolygon fill='none' stroke='rgba(155,93,229,0.04)' stroke-width='0.8' points='30,1 58,16 58,36 30,51 2,36 2,16'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 52px",
          opacity: 0.8,
        }}
        aria-hidden="true"
      />

      {/* ── Text block — centered ── */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-5 md:px-10 pt-32 pb-6 flex flex-col items-center text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
          style={{
            background: "rgba(155,93,229,0.08)",
            border: "1px solid rgba(155,93,229,0.2)",
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold tracking-wide" style={{ color: "#9B5DE5" }}>
            Trusted by 200,000+ voters across Africa
          </span>
        </motion.div>

        {/* Headline — word cycles through phases */}
        <motion.h1
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="font-syne font-bold text-primary"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            letterSpacing: "-0.035em",
            lineHeight: 0.92,
            textWrap: "balance",
          }}
        >
          <motion.span variants={fadeUp} className="block">The Future of</motion.span>

          {/* Cycling word — slot-machine slide */}
          <motion.div variants={fadeUp} style={{ display: "block", overflow: "hidden" }}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={phase}
                initial={hasCycledRef.current ? { y: 32, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -32, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "block", color: PHASES[phase].color }}
              >
                {PHASES[phase].word}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.span variants={fadeUp} className="block gradient-text">
            Elections
          </motion.span>
        </motion.h1>

        {/* Sub-headline — crossfades with phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          className="mt-7 max-w-[540px]"
          style={{ minHeight: "4rem" }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={hasCycledRef.current ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="text-[16px] leading-relaxed"
              style={{ color: "#64748B" }}
            >
              {PHASES[phase].subtitle}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#contact"
            className="btn-shimmer group inline-flex items-center gap-0 pl-6 pr-1.5 py-1.5 rounded-full font-semibold text-[14px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
              color: "#FFFFFF",
              boxShadow: "0 6px 24px rgba(155,93,229,0.35), 0 1px 0 rgba(255,255,255,0.3) inset",
            }}
          >
            Get Early Access
            <span
              className="ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </Link>

          {/* Watch Demo → opens YouTube demo modal */}
          <motion.button
            onClick={() => setVideoOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2.5 pl-5 pr-5 py-3 rounded-full font-semibold text-[14px] transition-colors duration-200 hover:bg-white/[0.06]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F0F4F8",
              cursor: "pointer",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.18, 1], boxShadow: ["0 0 0px rgba(155,93,229,0.3)", "0 0 14px rgba(155,93,229,0.65)", "0 0 0px rgba(155,93,229,0.3)"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(155,93,229,0.14)", border: "1px solid rgba(155,93,229,0.3)" }}
            >
              <Play size={11} fill="#9B5DE5" style={{ color: "#9B5DE5", marginLeft: 1 }} />
            </motion.span>
            Watch Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Globe — scroll-driven + phase-tinted ── */}
      <motion.div
        className="relative z-5 flex flex-col items-center w-full px-4"
        style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
      >
        {/* Phase hue layer — dim + scale on switch, tint via hue-rotate */}
        <motion.div
          key={phase}
          initial={{ opacity: 0.55, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: `hue-rotate(${PHASES[phase].hue}deg)`,
          }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlobeVisual size={460} />
        </motion.div>

        {/* Phase indicator — label + dot pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}
        >
          {/* Cycling label */}
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: PHASES[phase].color,
                letterSpacing: "0.11em",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
              }}
            >
              {PHASES[phase].label}
            </motion.span>
          </AnimatePresence>

          {/* Dot pills */}
          <div style={{ display: "flex", gap: 5 }}>
            {PHASES.map((p, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  hasCycledRef.current = true;
                  setPhase(i);
                }}
                animate={{
                  width: i === phase ? 22 : 7,
                  background:
                    i === phase ? PHASES[phase].color : "rgba(255,255,255,0.18)",
                }}
                whileHover={{ opacity: 0.8 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                style={{
                  height: 5,
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
                title={p.word}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Stats row — centered below globe ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 w-full max-w-3xl mx-auto px-5 pb-16 grid grid-cols-3 gap-3"
      >
        <StatPill value="200K+" label="Votes secured"     icon={Shield} />
        <StatPill value="1,200+" label="Elections run"    icon={Zap}    />
        <StatPill value="0"      label="Disputed results" icon={Globe}  />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8"
          style={{ background: "linear-gradient(to bottom, rgba(155,93,229,0.5), transparent)" }}
        />
        <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: "#334155" }}>
          Scroll
        </span>
      </motion.div>

      {/* Demo video modal */}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
