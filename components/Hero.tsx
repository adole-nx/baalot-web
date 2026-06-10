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
    let frameCount = 0;

    // Fewer particles on mobile — no connections on mobile (O(n²) cost)
    const isMobile = window.innerWidth < 768;
    const COUNT     = isMobile ? 26 : 42;
    const CONN_DIST = isMobile ? 0  : 88;   // 0 = skip connection drawing

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      da: number;
    }

    const particles: Particle[] = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
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
      frameCount++;
      ctx.clearRect(0, 0, W, H);

      // Update + draw particles
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

      // Connections — only on desktop, every other frame to halve the cost
      if (CONN_DIST > 0 && frameCount % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONN_DIST) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(155,93,229,${(1 - dist / CONN_DIST) * 0.08})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
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
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}

// ─── Globe Visual ───────────────────────────────────────────────
const LIVE_VOTERS = [
  { lat:  6.5,  lon:  3.4,  label: "Lagos",     count: 12847, hot: true  },
  { lat:  9.1,  lon:  7.4,  label: "Abuja",     count:  8923, hot: true  },
  { lat: -1.3,  lon: 36.8,  label: "Nairobi",   count:  6210, hot: true  },
  { lat:  5.6,  lon: -0.2,  label: "Accra",     count:  4102, hot: false },
  { lat: 12.0,  lon:  8.5,  label: "Kano",      count:  3780, hot: true  },
  { lat: 30.1,  lon: 31.2,  label: "Cairo",     count:  2940, hot: false },
  { lat: 14.7,  lon:-17.4,  label: "Dakar",     count:  1830, hot: false },
  { lat:-26.2,  lon: 28.0,  label: "Joburg",    count:  5100, hot: true  },
  { lat: 51.5,  lon: -0.1,  label: "London",    count:  1240, hot: false },
  { lat: 48.9,  lon:  2.3,  label: "Paris",     count:   980, hot: false },
  { lat:  1.3,  lon:103.8,  label: "Singapore", count:  4560, hot: true  },
  { lat: 19.1,  lon: 72.9,  label: "Mumbai",    count:  7280, hot: true  },
  { lat: 40.7,  lon:-74.0,  label: "New York",  count:  1120, hot: false },
  { lat:-23.5,  lon:-46.6,  label: "São Paulo", count:  3800, hot: true  },
];

// Simplified continent outlines [lat, lon]
const CONT_AFRICA: [number,number][] = [
  [35,-6],[37,10],[33,25],[31,32],[22,37],[12,44],[1,42],
  [-10,40],[-17,36],[-26,33],[-34,26],[-34,20],[-22,14],
  [-5,12],[0,9],[5,-1],[8,-12],[14,-17],[22,-17],[28,-14],[35,-6],
];
const CONT_EUROPE: [number,number][] = [
  [36,-9],[44,-8],[43,-3],[44,8],[47,8],[50,18],[54,22],
  [56,22],[60,24],[68,14],[70,30],[62,28],[58,22],[52,14],
  [50,14],[46,8],[44,3],[43,-5],[36,-9],
];
const CONT_MIDDLE_EAST: [number,number][] = [
  [37,36],[32,34],[28,34],[22,38],[14,44],[12,44],[16,40],
  [22,38],[28,48],[32,46],[34,38],[37,36],
];
const CONT_S_ASIA: [number,number][] = [
  [28,62],[24,68],[20,72],[16,74],[12,76],[8,77],[8,78],
  [10,80],[14,80],[16,82],[20,86],[22,88],[24,92],[25,87],
  [22,88],[20,86],[16,80],[12,80],[10,79],[8,77],[12,76],
  [16,74],[20,72],[24,68],[28,66],[28,62],
];
const CONT_SE_ASIA: [number,number][] = [
  [22,100],[18,102],[14,102],[8,100],[5,102],[1,104],
  [4,108],[10,104],[14,108],[18,106],[22,104],[24,100],[22,100],
];
const CONT_E_ASIA: [number,number][] = [
  [22,114],[28,120],[34,120],[38,122],[42,130],[46,138],
  [50,140],[55,132],[48,136],[44,130],[38,122],[34,116],
  [30,120],[26,120],[22,114],[20,110],[24,102],[28,104],
  [36,104],[40,116],[44,126],
];
const CONT_N_AMERICA: [number,number][] = [
  [72,-140],[72,-80],[60,-75],[50,-64],[44,-66],[42,-70],
  [38,-76],[30,-81],[24,-80],[14,-88],[8,-82],[14,-88],
  [24,-80],[30,-81],[38,-76],[44,-76],[52,-56],[60,-64],
  [68,-66],[72,-80],[72,-100],[72,-140],[60,-164],[54,-164],
  [50,-125],[44,-124],[36,-122],[24,-110],[22,-98],[25,-100],
  [30,-88],[25,-100],[22,-98],[22,-106],[24,-110],[36,-122],
  [44,-124],[50,-125],[54,-164],[60,-164],[72,-140],
];
const CONT_S_AMERICA: [number,number][] = [
  [12,-72],[8,-60],[4,-52],[0,-50],[-4,-36],[-8,-34],
  [-16,-38],[-22,-42],[-30,-50],[-34,-54],[-38,-60],
  [-42,-64],[-52,-68],[-54,-66],[-50,-74],[-44,-72],
  [-38,-72],[-32,-70],[-24,-70],[-18,-70],[-12,-76],
  [-4,-80],[2,-78],[8,-78],[12,-72],
];
const CONT_AUSTRALIA: [number,number][] = [
  [-14,130],[-16,128],[-18,122],[-22,114],[-28,126],
  [-32,132],[-36,138],[-38,140],[-38,148],[-34,150],
  [-28,154],[-24,152],[-20,148],[-18,140],[-14,136],[-14,130],
];

const CONTINENT_SHAPES: [number,number][][] = [
  CONT_AFRICA, CONT_EUROPE, CONT_MIDDLE_EAST, CONT_S_ASIA,
  CONT_SE_ASIA, CONT_E_ASIA, CONT_N_AMERICA, CONT_S_AMERICA, CONT_AUSTRALIA,
];

const ARC_PAIRS = [[0,1],[1,4],[0,2],[2,7],[4,5],[0,11],[7,11]];

function GlobeVisual({ size = 460 }: { size?: number }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const liveCountRef = useRef<HTMLSpanElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  // Interaction state — all refs, zero re-renders
  const dragging = useRef(false);
  const lastPt   = useRef({ x: 0, y: 0 });
  const lonOff   = useRef(0);   // user-driven longitude offset (degrees)
  const latOff   = useRef(0);   // user-driven latitude offset (degrees)
  const velLon   = useRef(0);   // inertia
  const velLat   = useRef(0);
  const hoverIdx = useRef(-1);
  const mousePt  = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas  = canvasRef.current;
    const tooltip = tooltipRef.current;
    if (!canvas || !tooltip) return;
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
    canvas.style.cursor  = "grab";
    ctx.scale(dpr, dpr);

    const DEG = Math.PI / 180;
    let t = 0;
    let animId: number;
    let lat0 = 8; // dynamic centre latitude (changes with vertical drag)

    const project = (lat: number, lon: number, lon0: number) => {
      const φ  = lat  * DEG;
      const λ  = lon  * DEG;
      const φ0 = lat0 * DEG;   // ← uses closure variable
      const λ0 = lon0 * DEG;
      const cosC =
        Math.sin(φ0) * Math.sin(φ) +
        Math.cos(φ0) * Math.cos(φ) * Math.cos(λ - λ0);
      const x = R * Math.cos(φ) * Math.sin(λ - λ0);
      const y = R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ - λ0));
      return { x: CX + x, y: CY - y, visible: cosC >= 0 };
    };

    // ── Pointer helpers ─────────────────────────────────────────
    const canvasPt = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (SIZE / rect.width),
        y: (clientY - rect.top)  * (SIZE / rect.height),
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      lastPt.current   = canvasPt(e.clientX, e.clientY);
      velLon.current   = 0;
      velLat.current   = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      const pt = canvasPt(e.clientX, e.clientY);
      mousePt.current  = pt;
      if (dragging.current) {
        const dLon = -(pt.x - lastPt.current.x) / SIZE * 220;
        const dLat =  (pt.y - lastPt.current.y) / SIZE * 130;
        lonOff.current += dLon;
        latOff.current  = Math.max(-55, Math.min(55, latOff.current + dLat));
        velLon.current  = dLon * 0.75;
        velLat.current  = dLat * 0.75;
        lastPt.current  = pt;
      }
    };
    const onMouseUp    = () => { dragging.current = false; canvas.style.cursor = "grab"; };
    const onMouseLeave = () => {
      dragging.current = false;
      mousePt.current  = { x: -1, y: -1 };
      canvas.style.cursor = "grab";
      tooltip.style.opacity = "0";
      hoverIdx.current = -1;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      dragging.current = true;
      const t0 = e.touches[0];
      lastPt.current = canvasPt(t0.clientX, t0.clientY);
      velLon.current = 0;
      velLat.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t0 = e.touches[0];
      const pt = canvasPt(t0.clientX, t0.clientY);
      if (dragging.current) {
        const dLon = -(pt.x - lastPt.current.x) / SIZE * 220;
        const dLat =  (pt.y - lastPt.current.y) / SIZE * 130;
        lonOff.current += dLon;
        latOff.current  = Math.max(-55, Math.min(55, latOff.current + dLat));
        velLon.current  = dLon * 0.75;
        velLat.current  = dLat * 0.75;
        lastPt.current  = pt;
      }
    };
    const onTouchEnd = () => { dragging.current = false; };

    canvas.addEventListener("mousedown",  onMouseDown);
    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseup",    onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd);

    const drawGrid = (lon0: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(155,93,229,0.06)";
      ctx.lineWidth   = 0.5;
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, lon0);
          if (!p.visible) { started = false; continue; }
          if (started) ctx.lineTo(p.x, p.y); else { ctx.moveTo(p.x, p.y); started = true; }
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = project(lat, lon, lon0);
          if (!p.visible) { started = false; continue; }
          if (started) ctx.lineTo(p.x, p.y); else { ctx.moveTo(p.x, p.y); started = true; }
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawContinent = (coords: [number,number][], lon0: number) => {
      ctx.save();
      ctx.beginPath();
      let started = false;
      for (const [lat, lon] of coords) {
        const p = project(lat, lon, lon0);
        if (!p.visible) { started = false; continue; }
        if (started) ctx.lineTo(p.x, p.y); else { ctx.moveTo(p.x, p.y); started = true; }
      }
      ctx.closePath();
      ctx.fillStyle   = "rgba(155,93,229,0.13)";
      ctx.strokeStyle = "rgba(155,93,229,0.42)";
      ctx.lineWidth   = 1;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      // Physics — inertia decays, auto-rotate resumes
      if (!dragging.current) {
        lonOff.current += velLon.current;
        latOff.current  = Math.max(-55, Math.min(55, latOff.current + velLat.current));
        velLon.current *= 0.93;
        velLat.current *= 0.93;
        t += 0.012;
      }
      const lon0 = ((t * 5) + lonOff.current + 3600) % 360;
      lat0 = 8 + latOff.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Clip to globe circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      // Ocean fill
      ctx.fillStyle = "#030507";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Subtle radial glow inside globe
      const bg = ctx.createRadialGradient(CX - 40, CY - 40, 0, CX, CY, R);
      bg.addColorStop(0, "rgba(155,93,229,0.07)");
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Grid
      drawGrid(lon0);

      // Continents
      for (const shape of CONTINENT_SHAPES) {
        drawContinent(shape, lon0);
      }

      // Arcs between cities
      for (const [ai, bi] of ARC_PAIRS) {
        const pA = project(LIVE_VOTERS[ai].lat, LIVE_VOTERS[ai].lon, lon0);
        const pB = project(LIVE_VOTERS[bi].lat, LIVE_VOTERS[bi].lon, lon0);
        if (!pA.visible || !pB.visible) continue;
        ctx.save();
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = "rgba(155,93,229,0.22)";
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
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#14B8A6";
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // end globe clip

      // Globe border
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(155,93,229,0.28)";
      ctx.lineWidth   = 1.2;
      ctx.stroke();

      // Voter city dots + labels
      for (const city of LIVE_VOTERS) {
        const p = project(city.lat, city.lon, lon0);
        if (!p.visible) continue;
        if (Math.hypot(p.x - CX, p.y - CY) > R - 2) continue;

        const pulse = (Math.sin(t * 1.8 + city.lat * 0.3) + 1) * 0.5;

        // Outer glow halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
        grd.addColorStop(0, city.hot ? "rgba(155,93,229,0.45)" : "rgba(20,184,166,0.25)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(p.x - 14, p.y - 14, 28, 28);

        if (city.hot) {
          // Pulsing ring for hot cities
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5 + pulse * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(155,93,229,${0.45 - pulse * 0.38})`;
          ctx.lineWidth   = 1;
          ctx.stroke();

          // Second tighter ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5 + pulse * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(155,93,229,${0.3 - pulse * 0.2})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, city.hot ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = city.hot ? "#B27FF0" : "rgba(20,184,166,0.7)";
        ctx.fill();

        // City label
        ctx.save();
        ctx.font = `${Math.max(8, SIZE * 0.019)}px monospace`;
        ctx.fillStyle = city.hot ? "rgba(178,127,240,0.85)" : "rgba(100,180,170,0.7)";
        ctx.fillText(city.label, p.x + 6, p.y - 4);

        // Voter count
        const countStr = city.count.toLocaleString();
        ctx.font = `${Math.max(7, SIZE * 0.016)}px monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.38)";
        ctx.fillText(countStr, p.x + 6, p.y + 7);
        ctx.restore();
      }

      // Update live count display
      if (liveCountRef.current) {
        const total = LIVE_VOTERS.reduce((s, c) => s + c.count, 0);
        const live = Math.floor(total + t * 3.7) % 100000 + total;
        liveCountRef.current.textContent = live.toLocaleString();
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
        ctx.strokeStyle = `rgba(155,93,229,${big ? 0.5 : 0.18})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Outer dashed ring
      ctx.beginPath();
      ctx.arc(CX, CY, R + 22, 0, Math.PI * 2);
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = "rgba(155,93,229,0.07)";
      ctx.lineWidth   = 0.6;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Hover detection ──────────────────────────────────────
      let newHover = -1;
      if (mousePt.current.x >= 0 && !dragging.current) {
        for (let i = 0; i < LIVE_VOTERS.length; i++) {
          const city = LIVE_VOTERS[i];
          const p = project(city.lat, city.lon, lon0);
          if (!p.visible) continue;
          if (Math.hypot(p.x - mousePt.current.x, p.y - mousePt.current.y) < 14) {
            newHover = i;
            break;
          }
        }
      }
      if (newHover !== hoverIdx.current) {
        hoverIdx.current = newHover;
        if (newHover >= 0) {
          const city = LIVE_VOTERS[newHover];
          const p    = project(city.lat, city.lon, lon0);
          const rect = canvas.getBoundingClientRect();
          const sx   = rect.width  / SIZE;
          const sy   = rect.height / SIZE;
          tooltip.style.opacity = "1";
          tooltip.style.left    = `${p.x * sx}px`;
          tooltip.style.top     = `${(p.y - 14) * sy}px`;
          tooltip.innerHTML     = `<div style="font-size:11px;font-weight:700;color:#E2D4F8;margin-bottom:2px">${city.label}</div><div style="font-size:10px;color:#B27FF0">${city.count.toLocaleString()} live voters</div>`;
          canvas.style.cursor   = "pointer";
        } else {
          tooltip.style.opacity = "0";
          canvas.style.cursor   = "grab";
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown",  onMouseDown);
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseup",    onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
    };
  }, [size]);

  const totalVoters = LIVE_VOTERS.reduce((s, c) => s + c.count, 0);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          background: "radial-gradient(ellipse, rgba(155,93,229,0.2) 0%, transparent 65%)",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          filter: "blur(24px)",
        }}
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        aria-label="Interactive globe — drag to rotate and explore Baalot election activity worldwide"
        style={{ maxWidth: "100%", imageRendering: "auto" }}
      />

      {/* Hover tooltip */}
      <div
        ref={tooltipRef}
        className="absolute z-10 pointer-events-none"
        style={{
          transform: "translate(-50%, -100%)",
          padding: "6px 10px",
          borderRadius: 8,
          background: "rgba(6,9,14,0.92)",
          border: "1px solid rgba(155,93,229,0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: 0,
          transition: "opacity 0.12s ease",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,93,229,0.08)",
        }}
      />

      {/* Live voters — top-right */}
      <div className="absolute top-4 right-4 text-right pointer-events-none">
        <div className="flex items-center gap-1.5 justify-end">
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#9B5DE5" }}
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#B27FF0" }}>LIVE</span>
        </div>
        <p className="font-mono text-[11px] font-bold mt-0.5" style={{ color: "#E2D4F8" }}>
          <span ref={liveCountRef}>{totalVoters.toLocaleString()}</span>
        </p>
        <p className="font-mono text-[8px] mt-0.5" style={{ color: "#475569" }}>voters casting now</p>
      </div>

      {/* Elections live — bottom-left */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
          />
          <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#14B8A6" }}>
            {LIVE_VOTERS.filter(c => c.hot).length} elections active
          </p>
        </div>
        <p className="font-mono text-[8px] mt-0.5" style={{ color: "#475569" }}>14 cities · 9 countries</p>
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
  const [globeSize, setGlobeSize] = useState(460);

  // Responsive globe size
  useEffect(() => {
    const calc = () => setGlobeSize(Math.min(460, window.innerWidth - 48));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Auto-advance phase every 5.5s — slow enough to read, fast enough to feel alive
  useEffect(() => {
    const id = setInterval(() => {
      hasCycledRef.current = true;
      setPhase((p) => (p + 1) % PHASES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Text fades and lifts as user scrolls
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.5],  [0, -50]);

  // Globe: visible on load, parallax up + fade as user scrolls
  const globeOpacity = useTransform(scrollYProgress, [0, 0.68, 0.82], [1, 1, 0]);
  const globeY       = useTransform(scrollYProgress, [0, 1],           [0, -200]);
  const globeScale   = useTransform(scrollYProgress, [0, 0.75],        [1, 0.82]);

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
                initial={hasCycledRef.current ? { y: 28, opacity: 0, filter: "blur(6px)" } : false}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            className="btn-shimmer group inline-flex items-center gap-0 pl-6 pr-3 py-3 rounded-full font-semibold text-[14px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #9B5DE5, #B27FF0)",
              color: "#FFFFFF",
              boxShadow: "0 6px 24px rgba(155,93,229,0.35), 0 1px 0 rgba(255,255,255,0.3) inset",
            }}
          >
            Get Early Access
            <span
              className="ml-3 w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <ArrowUpRight size={13} strokeWidth={2.5} />
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

      {/* ── Globe — entrance animation wraps the scroll-parallax layer ── */}
      <motion.div
        className="relative z-5 flex flex-col items-center w-full px-4"
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
      >
        {/* Scroll parallax — independent from entrance */}
        <motion.div
          className="flex flex-col items-center w-full"
          style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
        >
          {/* Hue tint layer — no key, no remount, rotation stays continuous */}
          <div className="relative" style={{ willChange: "transform, opacity" }}>
            <motion.div
              animate={{ filter: `hue-rotate(${PHASES[phase].hue}deg)` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlobeVisual size={globeSize} />
            </motion.div>
          </div>

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
      </motion.div>

      {/* ── Stats row — entrance animation wraps the scroll-fade layer ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
        className="relative z-10 w-full"
      >
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="w-full max-w-3xl mx-auto px-5 pb-16 grid grid-cols-3 gap-3"
        >
          <StatPill value="200K+" label="Votes secured"     icon={Shield} />
          <StatPill value="1,200+" label="Elections run"    icon={Zap}    />
          <StatPill value="0"      label="Disputed results" icon={Globe}  />
        </motion.div>
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
