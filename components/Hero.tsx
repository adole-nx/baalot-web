"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play, Shield, Zap, Globe, Lock } from "lucide-react";
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
// Real data: the 14 Nigerian states with the most institutions listed in the
// Baalot directory, derived from the seeded institution dataset (106 rows across
// 28 states). `count` is institutions listed, not voters — the previous version
// of this array carried invented live-voter totals for cities worldwide.
const DIRECTORY_HUBS = [
  { lat:   6.48, lon:   3.42, label: "Lagos",       count:  24, hot: true  },
  { lat:   9.05, lon:   7.45, label: "FCT",         count:  16, hot: true  },
  { lat:   6.91, lon:   3.45, label: "Ogun",        count:   7, hot: true  },
  { lat:    7.6, lon:   3.97, label: "Oyo",         count:   6, hot: true  },
  { lat:  10.71, lon:   7.51, label: "Kaduna",      count:   6, hot: true  },
  { lat:   6.66, lon:    5.8, label: "Edo",         count:   5, hot: true  },
  { lat:   7.74, lon:    4.4, label: "Osun",        count:   4, hot: true  },
  { lat:   4.91, lon:   6.93, label: "Rivers",      count:   4, hot: true  },
  { lat:   8.46, lon:    4.7, label: "Kwara",       count:   4, hot: true  },
  { lat:   6.57, lon:   7.48, label: "Enugu",       count:   3, hot: false },
  { lat:   5.44, lon:   7.02, label: "Imo",         count:   3, hot: false },
  { lat:   6.19, lon:   7.03, label: "Anambra",     count:   3, hot: false },
  { lat:   7.68, lon:   5.36, label: "Ekiti",       count:   3, hot: false },
  { lat:   7.39, lon:   5.44, label: "Ondo",        count:   2, hot: false },
];

// ── High-resolution continent polygons [lat°N, lon°E] ──────────
const CONT_AFRICA: [number,number][] = [
  [35.8,-5.9],[36.2,-3.5],[37.0,0.5],[37.2,3.5],[36.8,5.5],[37.1,7.5],[36.8,10.0],
  [33.5,11.5],[32.8,13.0],[32.2,15.5],[31.5,18.0],[30.5,22.0],[30.8,25.0],
  [31.5,27.5],[31.0,30.0],[30.5,32.5],[28.0,34.0],[22.5,37.0],[16.0,40.5],
  [13.0,43.5],[11.8,44.5],[11.5,48.0],[11.5,51.0],[10.5,51.5],
  [8.0,49.5],[3.5,45.5],[1.0,42.5],[0.0,42.5],[-2.5,41.0],
  [-5.0,39.5],[-8.0,39.5],[-10.5,40.5],[-14.5,38.0],[-16.5,37.0],
  [-18.5,36.5],[-22.0,35.5],[-25.5,33.5],[-28.5,33.0],[-30.5,31.5],
  [-32.5,29.0],[-34.0,27.5],[-34.8,23.5],[-34.5,20.0],[-33.5,18.5],
  [-31.0,17.5],[-28.0,16.5],[-26.0,15.0],[-22.5,14.5],[-18.5,12.5],
  [-15.5,12.0],[-12.0,13.5],[-8.0,12.5],[-5.5,11.5],[-2.5,9.5],
  [0.0,9.5],[2.5,9.0],[4.0,8.0],[5.5,5.5],[6.5,3.5],[6.5,2.5],
  [5.5,1.0],[5.5,-0.5],[5.0,-3.0],[4.5,-5.5],[4.5,-8.0],[5.0,-9.0],
  [6.5,-10.5],[8.0,-12.5],[8.5,-13.5],[10.5,-15.0],[12.5,-16.5],
  [15.0,-17.5],[16.0,-16.5],[18.5,-16.5],[21.0,-17.0],[24.5,-16.0],
  [27.5,-13.5],[29.0,-11.0],[31.5,-9.0],[33.0,-7.5],[35.0,-5.5],[35.8,-5.9],
];

const CONT_EUROPE: [number,number][] = [
  [37.0,-9.5],[36.0,-6.5],[36.0,-5.5],[36.0,-2.5],[37.5,0.0],
  [40.5,3.0],[42.5,3.5],[43.5,7.0],[44.0,9.0],[44.0,10.5],
  [44.5,13.5],[45.5,13.5],[44.5,14.5],[43.0,17.5],[41.5,20.0],
  [39.5,20.0],[39.0,22.0],[37.5,24.0],[36.5,23.0],[37.0,22.0],
  [38.0,22.0],[40.5,23.5],[41.5,26.5],[42.5,28.5],[44.5,29.5],
  [46.5,31.0],[47.5,32.0],[47.0,38.5],[46.0,40.5],[43.5,41.5],
  [42.0,43.5],[41.0,29.0],[41.5,26.5],[42.0,28.0],
  [50.5,18.5],[54.5,18.5],[55.5,21.0],[56.5,24.5],[58.5,25.5],
  [59.5,28.0],[60.0,25.0],[63.5,22.0],[65.5,24.0],
  [70.0,23.5],[71.0,28.0],[68.5,28.0],[65.0,14.0],
  [63.0,7.5],[61.5,5.0],[58.5,5.5],[58.0,7.5],[56.0,9.5],
  [55.5,11.0],[55.5,8.5],[57.0,9.5],[55.0,8.5],[53.5,7.0],
  [53.0,5.0],[51.5,3.5],[51.0,2.5],[50.0,1.5],
  [48.5,-5.0],[48.0,-4.5],[47.0,-2.0],
  [43.5,-2.0],[43.5,-8.0],[43.0,-9.0],[37.0,-9.5],
];

const CONT_MIDDLE_EAST: [number,number][] = [
  [37.0,36.5],[36.5,36.0],[36.0,35.5],[35.5,34.5],[33.5,35.5],
  [31.5,34.5],[29.5,35.0],[27.5,34.5],[22.5,37.5],[17.5,39.5],
  [14.5,41.5],[12.5,43.5],[11.8,44.5],[13.0,43.5],[16.0,40.5],
  [22.5,37.5],[26.0,38.0],[27.5,34.5],[28.5,34.5],[29.5,35.0],
  [30.0,36.5],[30.5,40.0],[31.5,44.5],[32.5,47.5],[30.0,49.5],
  [28.5,50.5],[26.5,52.5],[24.5,57.5],[22.5,59.5],[23.0,57.5],
  [24.5,54.5],[25.5,52.5],[24.0,52.0],[23.0,55.0],[22.5,59.5],
  [22.5,55.5],[21.5,52.5],[19.0,52.5],[14.5,51.5],[14.0,50.5],
  [15.0,48.5],[18.0,44.5],[21.5,41.0],[22.5,37.5],
  [28.5,34.5],[29.5,36.5],[33.5,36.5],[36.5,37.0],[37.0,36.5],
];

const CONT_S_ASIA: [number,number][] = [
  [29.0,62.5],[27.0,64.5],[25.5,66.0],[24.0,68.0],[22.5,70.0],[21.0,72.0],
  [19.5,72.5],[18.0,73.5],[16.5,74.0],[14.5,74.5],[11.5,76.5],
  [8.5,77.5],[8.0,78.0],[8.5,79.5],[10.5,80.0],[12.0,80.5],
  [14.0,81.0],[16.5,81.5],[18.0,83.5],[19.5,84.5],[20.5,86.5],
  [22.0,88.0],[22.5,88.5],[23.5,90.0],[24.0,91.5],[23.5,92.0],
  [22.5,92.5],[22.0,91.5],[23.0,90.5],[22.5,88.0],[21.0,86.0],
  [19.5,84.5],[17.5,83.0],[16.0,81.5],[15.0,80.0],[12.0,80.5],
  [10.0,80.5],[8.0,79.5],[7.5,78.5],[8.0,77.5],[9.0,77.5],
  [11.0,76.5],[13.0,76.0],[14.5,74.5],[17.5,73.5],[20.0,72.5],
  [21.5,72.5],[23.0,70.0],[24.5,68.0],[26.5,64.5],[27.5,63.5],[29.0,62.5],
];

const CONT_SE_ASIA: [number,number][] = [
  [22.5,99.5],[20.0,101.5],[18.0,102.5],[16.5,102.5],[15.5,102.5],
  [14.0,103.5],[12.5,102.0],[11.0,100.5],[8.5,100.0],[6.0,101.5],
  [4.5,101.5],[3.0,101.5],[1.5,103.0],[1.0,104.0],
  [2.5,106.0],[4.5,108.5],[7.0,107.0],[10.0,105.0],
  [11.5,107.5],[14.0,107.5],[17.0,107.5],[17.5,106.5],
  [16.5,107.5],[16.0,108.5],[18.0,106.5],[20.5,106.5],
  [21.5,107.0],[22.5,104.5],[23.5,102.5],[22.5,99.5],
];

const CONT_E_ASIA: [number,number][] = [
  [22.5,114.0],[22.5,113.0],[22.0,111.0],[21.5,110.5],[20.0,110.5],
  [18.5,110.5],[18.5,109.5],[20.0,109.5],[20.5,108.5],[21.5,108.5],
  [21.5,106.5],[22.5,104.5],[23.5,102.5],[22.5,99.5],[24.0,98.0],
  [26.5,98.5],[27.5,97.5],[28.5,96.5],[29.5,94.5],[29.5,91.0],
  [28.5,83.5],[30.5,81.5],[32.0,79.5],[34.5,78.5],[38.5,77.5],
  [40.5,79.5],[41.5,80.5],[42.5,80.5],[43.5,82.0],[44.5,87.0],
  [45.5,88.5],[46.5,90.5],[47.5,92.0],[47.5,95.0],[48.5,100.0],
  [50.0,104.0],[52.0,107.0],[52.5,110.0],[50.5,116.0],[48.5,119.5],
  [47.0,124.5],[45.5,130.5],[43.5,132.5],[42.5,131.0],[39.5,125.5],
  [38.5,121.5],[37.5,122.0],[35.5,120.0],[34.5,119.0],[33.5,120.5],
  [32.5,121.0],[30.5,122.0],[28.5,121.5],[26.5,121.0],[24.5,118.0],
  [23.5,116.5],[22.5,114.0],
];

const CONT_N_AMERICA: [number,number][] = [
  [70.5,-157.0],[68.5,-140.5],[60.0,-140.5],
  [57.5,-136.0],[55.0,-130.5],[52.0,-128.0],[50.5,-127.0],
  [48.5,-124.5],[46.5,-124.0],[44.0,-124.5],[40.0,-124.0],
  [37.5,-122.5],[36.5,-121.5],[34.5,-120.5],[32.5,-117.5],
  [30.0,-115.5],[28.0,-115.5],[26.0,-111.0],[24.0,-111.0],
  [22.5,-106.0],[20.5,-105.0],[18.0,-104.5],[16.0,-99.5],
  [15.5,-96.0],[15.0,-92.5],[16.0,-90.0],[15.5,-87.5],
  [14.0,-87.0],[13.0,-87.5],[12.0,-84.5],[11.0,-84.0],
  [10.0,-83.5],[9.5,-83.0],[8.5,-83.0],[8.0,-80.0],[9.5,-79.5],
  [9.0,-78.5],[10.5,-75.5],[11.5,-73.0],[12.0,-71.5],
  [11.5,-64.0],[10.5,-62.0],[11.0,-61.5],
  [18.5,-91.5],[19.5,-90.5],[20.0,-87.5],[21.5,-87.5],[21.0,-87.0],
  [20.5,-87.0],[18.5,-91.5],[17.5,-91.5],[17.0,-90.5],[16.0,-90.0],
  [18.0,-94.0],[19.5,-96.0],[21.0,-97.5],[23.5,-97.5],[25.5,-97.0],
  [27.5,-97.5],[28.5,-96.5],[29.5,-93.5],[29.0,-90.0],[30.0,-89.5],
  [29.5,-89.0],[29.5,-88.0],[30.5,-87.0],[30.0,-85.5],
  [29.0,-83.5],[26.5,-82.0],[25.0,-80.5],[25.5,-80.5],[26.5,-79.5],
  [30.5,-81.5],[31.5,-81.0],[33.0,-79.5],[34.5,-77.5],[35.5,-76.0],
  [37.5,-76.0],[38.5,-75.5],[39.5,-74.0],[40.5,-74.0],[41.0,-72.5],
  [42.0,-70.0],[43.5,-70.5],[44.5,-67.5],[47.0,-67.5],[47.5,-68.5],
  [48.0,-70.0],[49.5,-64.5],[49.5,-67.0],[50.5,-56.5],[51.5,-56.0],
  [53.0,-56.0],[54.5,-57.5],[55.5,-60.0],[57.5,-64.0],[59.5,-65.5],
  [60.5,-65.0],[63.0,-65.5],[64.5,-68.0],[66.5,-67.0],[68.5,-60.0],
  [70.0,-62.5],[71.0,-70.0],[73.0,-80.0],[74.5,-85.0],[73.5,-88.0],
  [72.0,-92.0],[70.0,-92.0],[68.5,-96.0],[66.5,-87.5],[64.5,-88.0],
  [62.0,-92.5],[58.5,-93.5],[57.0,-92.0],[56.0,-83.5],[55.0,-83.5],
  [58.0,-79.0],[60.0,-70.0],[62.0,-70.5],[65.0,-70.0],[66.5,-67.0],
  [68.5,-60.0],[70.0,-62.5],[71.0,-70.0],
  [72.0,-120.0],[74.0,-108.0],[74.5,-99.0],[73.5,-88.0],
  [71.5,-121.5],[70.5,-157.0],
];

const CONT_S_AMERICA: [number,number][] = [
  [12.0,-72.0],[11.5,-70.0],[11.5,-67.0],[11.5,-63.5],[10.5,-61.5],
  [8.5,-60.5],[7.0,-60.0],[6.5,-58.5],[5.0,-57.5],[4.5,-52.5],
  [3.5,-51.5],[2.5,-50.0],[1.5,-50.0],[0.5,-50.0],[0.0,-48.5],
  [-1.5,-44.5],[-3.0,-42.0],[-4.5,-37.5],[-7.5,-35.0],[-8.0,-35.0],
  [-9.0,-35.5],[-10.5,-37.0],[-12.5,-38.0],[-13.5,-39.0],[-15.5,-39.0],
  [-17.5,-39.5],[-19.5,-40.0],[-22.0,-42.5],[-23.0,-44.0],[-23.5,-46.0],
  [-25.5,-48.5],[-27.5,-48.5],[-29.0,-49.5],[-30.5,-51.5],[-31.5,-52.0],
  [-33.5,-53.5],[-34.5,-57.0],[-35.5,-57.5],[-38.0,-57.5],[-40.0,-61.0],
  [-42.5,-65.0],[-44.0,-65.5],[-46.0,-67.5],[-48.0,-66.5],[-50.0,-69.0],
  [-52.5,-68.5],[-54.0,-67.5],[-55.5,-66.5],[-55.5,-69.5],[-53.5,-70.5],
  [-52.0,-74.0],[-50.0,-75.0],[-47.0,-74.5],[-43.0,-73.5],[-40.5,-73.5],
  [-38.0,-73.5],[-35.0,-72.5],[-32.5,-71.5],[-30.0,-71.5],[-27.0,-71.0],
  [-24.5,-70.5],[-22.5,-70.5],[-20.0,-70.0],[-18.0,-70.0],[-16.0,-75.0],
  [-14.0,-76.0],[-12.0,-77.5],[-10.0,-78.5],[-5.0,-81.0],[-2.0,-80.5],
  [0.5,-80.0],[2.0,-78.5],[4.0,-77.5],[6.0,-77.5],[8.5,-77.0],
  [9.0,-79.5],[9.5,-79.5],[9.0,-80.0],[9.5,-82.0],[10.5,-75.5],
  [11.5,-73.0],[12.0,-71.5],[11.5,-64.0],[11.0,-63.5],[12.0,-72.0],
];

const CONT_AUSTRALIA: [number,number][] = [
  [-13.5,130.5],[-14.5,129.5],[-15.5,128.5],[-17.0,126.5],[-18.5,122.0],
  [-20.5,119.0],[-22.0,114.5],[-24.0,114.0],[-26.5,114.5],[-28.5,114.5],
  [-30.0,115.0],[-31.5,115.5],[-33.5,115.0],[-34.5,116.5],[-35.0,118.0],
  [-33.5,121.5],[-33.5,124.0],[-32.0,126.0],[-31.5,129.0],[-31.5,132.5],
  [-32.0,134.0],[-33.0,136.5],[-34.5,138.5],[-36.0,138.5],[-37.5,140.0],
  [-38.5,140.5],[-38.0,143.5],[-37.5,145.0],[-38.0,147.5],[-37.5,148.5],
  [-36.5,150.0],[-35.5,150.5],[-33.5,151.5],[-31.5,153.0],[-28.5,153.5],
  [-25.0,152.5],[-23.0,150.5],[-20.5,149.0],[-18.5,147.5],[-17.5,146.0],
  [-16.5,145.5],[-15.5,145.5],[-14.5,145.0],[-13.5,143.5],[-13.0,141.5],
  [-13.0,136.5],[-12.5,135.5],[-12.0,134.0],[-13.0,132.5],[-13.5,130.5],
];

const CONTINENT_SHAPES: [number,number][][] = [
  CONT_AFRICA, CONT_EUROPE, CONT_MIDDLE_EAST, CONT_S_ASIA,
  CONT_SE_ASIA, CONT_E_ASIA, CONT_N_AMERICA, CONT_S_AMERICA, CONT_AUSTRALIA,
];

const ARC_PAIRS = [[0,1],[1,4],[0,2],[2,7],[4,5],[0,11],[7,11]];

// ── Per-hub directory breakdown ─────────────────────────────────
// What kinds of institutions are listed in each state. This replaced a table of
// invented "live elections" at named real universities and government bodies.
const HUB_BREAKDOWN: Record<string, { label: string; n: number }[]> = {
  Lagos: [{ label: "Companies", n: 15 }, { label: "Universities & polytechnics", n: 5 }, { label: "Communities", n: 4 }],
  FCT: [{ label: "Communities", n: 6 }, { label: "Universities & polytechnics", n: 5 }, { label: "Government bodies", n: 4 }, { label: "Companies", n: 1 }],
  Ogun: [{ label: "Universities & polytechnics", n: 6 }, { label: "Government bodies", n: 1 }],
  Oyo: [{ label: "Universities & polytechnics", n: 5 }, { label: "Government bodies", n: 1 }],
  Kaduna: [{ label: "Universities & polytechnics", n: 5 }, { label: "Government bodies", n: 1 }],
  Edo: [{ label: "Universities & polytechnics", n: 4 }, { label: "Government bodies", n: 1 }],
  Osun: [{ label: "Universities & polytechnics", n: 4 }],
  Rivers: [{ label: "Universities & polytechnics", n: 3 }, { label: "Government bodies", n: 1 }],
  Kwara: [{ label: "Universities & polytechnics", n: 4 }],
  Enugu: [{ label: "Universities & polytechnics", n: 2 }, { label: "Government bodies", n: 1 }],
  Imo: [{ label: "Universities & polytechnics", n: 3 }],
  Anambra: [{ label: "Universities & polytechnics", n: 2 }, { label: "Government bodies", n: 1 }],
  Ekiti: [{ label: "Universities & polytechnics", n: 3 }],
  Ondo: [{ label: "Universities & polytechnics", n: 2 }],
};

// ── Globe Visual ────────────────────────────────────────────────
function GlobeVisual({ size = 460 }: { size?: number }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  // Interaction state — all refs, zero re-renders
  const dragging  = useRef(false);
  const lastPt    = useRef({ x: 0, y: 0 });
  const lonOff    = useRef(0);
  const latOff    = useRef(0);
  const velLon    = useRef(0);
  const velLat    = useRef(0);
  const hoverIdx  = useRef(-1);
  const mousePt   = useRef({ x: -1, y: -1 });
  const dragMoved = useRef(false);   // distinguishes tap from drag
  // Zoom state
  const isZoomed    = useRef(false);
  const zoomLevel   = useRef(1);     // current animated zoom
  const zoomTarget  = useRef(1);     // target zoom
  const lon0Ref     = useRef(0);     // last computed lon0 (for unproject)
  const lat0Ref     = useRef(8);     // last computed lat0
  // Zoom overlay React state
  const [zoomedCity, setZoomedCity] = useState<typeof DIRECTORY_HUBS[0] | null>(null);

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
      const φ0 = lat0 * DEG;
      const λ0 = lon0 * DEG;
      const cosC =
        Math.sin(φ0) * Math.sin(φ) +
        Math.cos(φ0) * Math.cos(φ) * Math.cos(λ - λ0);
      const x = R * Math.cos(φ) * Math.sin(λ - λ0);
      const y = R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ - λ0));
      return { x: CX + x, y: CY - y, visible: cosC >= 0 };
    };

    // Inverse orthographic — canvas pixel → {lat, lon} (null if outside globe)
    const unproject = (px: number, py: number) => {
      const zz = Math.max(zoomLevel.current, 1);
      const nx = (px - CX) / (R * zz);
      const ny = -(py - CY) / (R * zz);
      const rho = Math.sqrt(nx * nx + ny * ny);
      if (rho > 1) return null;
      const sinC = rho;
      const cosC = Math.sqrt(1 - rho * rho);
      const phi0 = lat0Ref.current * DEG;
      const phi = Math.asin(cosC * Math.sin(phi0) + (rho > 1e-6 ? (ny / rho) * sinC * Math.cos(phi0) : 0));
      const lam0 = lon0Ref.current * DEG;
      const lam  = lam0 + Math.atan2(nx * sinC, rho * Math.cos(phi0) * cosC - ny * Math.sin(phi0) * sinC);
      return { lat: phi / DEG, lon: ((lam / DEG + 540) % 360) - 180 };
    };

    // Snap globe rotation to center a lat/lon
    const snapTo = (targetLat: number, targetLonRaw: number) => {
      const targetLon = ((targetLonRaw + 360) % 360);
      const currLon0  = lon0Ref.current;
      let diff = targetLon - currLon0;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      lonOff.current += diff;
      latOff.current  = Math.max(-55, Math.min(55, targetLat - 8));
      velLon.current  = 0;
      velLat.current  = 0;
    };

    // Click handler — tap = zoom in/out
    const handleClick = (px: number, py: number) => {
      if (isZoomed.current) {
        isZoomed.current = false;
        zoomTarget.current = 1;
        setZoomedCity(null);
        return;
      }
      const geo = unproject(px, py);
      if (!geo) return;
      // Find nearest LIVE city
      let nearest = DIRECTORY_HUBS[0], minD = Infinity;
      for (const city of DIRECTORY_HUBS) {
        const d = Math.hypot(city.lat - geo.lat, city.lon - geo.lon);
        if (d < minD) { minD = d; nearest = city; }
      }
      snapTo(nearest.lat, nearest.lon);
      isZoomed.current = true;
      zoomTarget.current = 5.5;
      setZoomedCity(nearest);
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
      dragging.current  = true;
      dragMoved.current = false;
      lastPt.current    = canvasPt(e.clientX, e.clientY);
      velLon.current    = 0;
      velLat.current    = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      const pt = canvasPt(e.clientX, e.clientY);
      mousePt.current = pt;
      if (dragging.current) {
        const dx = pt.x - lastPt.current.x;
        const dy = pt.y - lastPt.current.y;
        if (Math.hypot(dx, dy) > 3) dragMoved.current = true;
        const dLon = -(dx) / SIZE * 220;
        const dLat =  (dy) / SIZE * 130;
        lonOff.current += dLon;
        latOff.current  = Math.max(-55, Math.min(55, latOff.current + dLat));
        velLon.current  = dLon * 0.75;
        velLat.current  = dLat * 0.75;
        lastPt.current  = pt;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      const wasDrag = dragMoved.current;
      dragging.current = false;
      canvas.style.cursor = "grab";
      if (!wasDrag) {
        const pt = canvasPt(e.clientX, e.clientY);
        handleClick(pt.x, pt.y);
      }
    };
    const onMouseLeave = () => {
      dragging.current  = false;
      dragMoved.current = false;
      mousePt.current   = { x: -1, y: -1 };
      canvas.style.cursor = "grab";
      tooltip.style.opacity = "0";
      hoverIdx.current = -1;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      dragging.current  = true;
      dragMoved.current = false;
      const t0 = e.touches[0];
      lastPt.current = canvasPt(t0.clientX, t0.clientY);
      velLon.current = 0;
      velLat.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      dragMoved.current = true;
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
    const onTouchEnd = (e: TouchEvent) => {
      dragging.current = false;
      if (!dragMoved.current && e.changedTouches.length > 0) {
        const t0 = e.changedTouches[0];
        const pt = canvasPt(t0.clientX, t0.clientY);
        handleClick(pt.x, pt.y);
      }
    };

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
      const pts = coords.map(([lat, lon]) => project(lat, lon, lon0));
      const visCount = pts.filter(p => p.visible).length;
      if (visCount < 3) return;

      ctx.save();
      // Main filled path — break into visible runs
      ctx.beginPath();
      let inPath = false;
      for (const p of pts) {
        if (p.visible) {
          if (!inPath) { ctx.moveTo(p.x, p.y); inPath = true; }
          else ctx.lineTo(p.x, p.y);
        } else { inPath = false; }
      }
      ctx.closePath();

      // Directional gradient fill — lit from upper-left
      const grad = ctx.createLinearGradient(CX - R * 0.55, CY - R * 0.55, CX + R * 0.35, CY + R * 0.35);
      grad.addColorStop(0, "rgba(178,127,240,0.28)");
      grad.addColorStop(0.5, "rgba(155,93,229,0.18)");
      grad.addColorStop(1, "rgba(107,45,185,0.10)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Primary edge stroke
      ctx.strokeStyle = "rgba(178,127,240,0.32)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Soft inner glow along the edge
      ctx.strokeStyle = "rgba(200,160,255,0.07)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      // Physics — inertia decays; auto-rotate pauses while zoomed
      if (!dragging.current) {
        lonOff.current += velLon.current;
        latOff.current  = Math.max(-55, Math.min(55, latOff.current + velLat.current));
        velLon.current *= 0.93;
        velLat.current *= 0.93;
        if (!isZoomed.current) t += 0.012;
      }
      const lon0 = ((t * 5) + lonOff.current + 3600) % 360;
      lat0 = 8 + latOff.current;
      lon0Ref.current = lon0;
      lat0Ref.current = lat0;

      // Smooth zoom interpolation
      const zDiff = zoomTarget.current - zoomLevel.current;
      if (Math.abs(zDiff) > 0.003) zoomLevel.current += zDiff * 0.055;
      else zoomLevel.current = zoomTarget.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Clip to globe circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      // Apply zoom scale transform (everything inside clip is zoomed)
      ctx.save();
      if (zoomLevel.current > 1.002) {
        ctx.translate(CX, CY);
        ctx.scale(zoomLevel.current, zoomLevel.current);
        ctx.translate(-CX, -CY);
      }

      // Deep ocean base
      ctx.fillStyle = "rgba(2,3,8,1)";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Depth gradient — subtle blue-purple tint in centre
      const oceanDepth = ctx.createRadialGradient(CX - R * 0.1, CY - R * 0.1, 0, CX, CY, R);
      oceanDepth.addColorStop(0,   "rgba(14,22,50,0.65)");
      oceanDepth.addColorStop(0.5, "rgba(8,12,30,0.35)");
      oceanDepth.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = oceanDepth;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Edge vignette — darker rim gives the sphere a 3D feel
      const vignette = ctx.createRadialGradient(CX, CY, R * 0.58, CX, CY, R);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0,1,5,0.72)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Upper-left lit hemisphere glint
      const glint = ctx.createRadialGradient(CX - R * 0.42, CY - R * 0.42, 0, CX - R * 0.2, CY - R * 0.2, R * 0.7);
      glint.addColorStop(0, "rgba(155,93,229,0.09)");
      glint.addColorStop(1, "transparent");
      ctx.fillStyle = glint;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Grid
      drawGrid(lon0);

      // Continents
      for (const shape of CONTINENT_SHAPES) {
        drawContinent(shape, lon0);
      }

      // Arcs between cities
      for (const [ai, bi] of ARC_PAIRS) {
        const pA = project(DIRECTORY_HUBS[ai].lat, DIRECTORY_HUBS[ai].lon, lon0);
        const pB = project(DIRECTORY_HUBS[bi].lat, DIRECTORY_HUBS[bi].lon, lon0);
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

      ctx.restore(); // end zoom transform
      ctx.restore(); // end globe clip

      // Atmosphere rim — soft outer glow (no clip, drawn after restore)
      ctx.beginPath();
      ctx.arc(CX, CY, R + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(155,93,229,0.14)";
      ctx.lineWidth   = 8;
      ctx.stroke();

      // Globe hard border
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(178,127,240,0.48)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();

      // Inner specular arc — top-left highlight
      ctx.beginPath();
      ctx.arc(CX, CY, R - 1, Math.PI * 1.2, Math.PI * 1.75);
      ctx.strokeStyle = "rgba(220,190,255,0.18)";
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // Voter city dots + labels
      for (const city of DIRECTORY_HUBS) {
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

      // ── Hover detection (adjust mouse for zoom) ─────────────
      let newHover = -1;
      if (mousePt.current.x >= 0 && !dragging.current) {
        const zz = Math.max(zoomLevel.current, 1);
        const mx = (mousePt.current.x - CX) / zz + CX;
        const my = (mousePt.current.y - CY) / zz + CY;
        const hitR = 14 / zz;
        for (let i = 0; i < DIRECTORY_HUBS.length; i++) {
          const city = DIRECTORY_HUBS[i];
          const p = project(city.lat, city.lon, lon0);
          if (!p.visible) continue;
          if (Math.hypot(p.x - mx, p.y - my) < hitR) {
            newHover = i;
            break;
          }
        }
      }
      if (newHover !== hoverIdx.current) {
        hoverIdx.current = newHover;
        if (newHover >= 0) {
          const city = DIRECTORY_HUBS[newHover];
          const p    = project(city.lat, city.lon, lon0);
          const rect = canvas.getBoundingClientRect();
          const sx   = rect.width  / SIZE;
          const sy   = rect.height / SIZE;
          tooltip.style.opacity = "1";
          tooltip.style.left    = `${p.x * sx}px`;
          tooltip.style.top     = `${(p.y - 14) * sy}px`;
          tooltip.innerHTML     = `<div style="font-size:11px;font-weight:700;color:#E2D4F8;margin-bottom:2px">${city.label}</div><div style="font-size:10px;color:#B27FF0">${city.count} institution${city.count > 1 ? "s" : ""} listed</div>`;
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

  const totalListed = DIRECTORY_HUBS.reduce((s, c) => s + c.count, 0);

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
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#B27FF0" }}>DIRECTORY</span>
        </div>
        <p className="font-mono text-[11px] font-bold mt-0.5" style={{ color: "#E2D4F8" }}>
          {totalListed.toLocaleString()}
        </p>
        <p className="font-mono text-[8px] mt-0.5" style={{ color: "#475569" }}>institutions in these states</p>
      </div>

      {/* Elections live — bottom-left (hidden when zoomed) */}
      <AnimatePresence>
        {!zoomedCity && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 pointer-events-none"
          >
            <div className="flex items-center gap-1.5">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-teal-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
              />
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#14B8A6" }}>
                {DIRECTORY_HUBS.filter(c => c.hot).length} states with 4+ institutions
              </p>
            </div>
            <p className="font-mono text-[8px] mt-0.5" style={{ color: "#475569" }}>14 states · 28 covered nationwide</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zoom info card ───────────────────────────────────────── */}
      <AnimatePresence>
        {zoomedCity && (() => {
          const breakdown = HUB_BREAKDOWN[zoomedCity.label] ?? [];
          const kinds = breakdown.length;
          return (
            <motion.div
              key="zoom-card"
              initial={{ opacity: 0, y: 18, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "absolute",
                bottom: "6%",
                left: "50%",
                transform: "translateX(-50%)",
                width: Math.min(size * 0.84, 320),
                background: "rgba(4,6,14,0.97)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(155,93,229,0.32)",
                borderRadius: 14,
                padding: "14px 16px 12px",
                zIndex: 30,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(155,93,229,0.18), 0 20px 60px rgba(0,0,0,0.7)",
                pointerEvents: "none",
              }}
            >
              {/* City header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: "linear-gradient(135deg, #9B5DE5 0%, #14B8A6 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: "var(--font-syne)",
                  }}>
                    {zoomedCity.label.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#EDE9FE", fontFamily: "var(--font-syne)", lineHeight: 1 }}>
                      {zoomedCity.label}
                    </p>
                    <p style={{ fontSize: 10, color: kinds > 0 ? "#B27FF0" : "#64748B", marginTop: 2, lineHeight: 1, fontWeight: 600 }}>
                      {kinds > 0 ? `${kinds} kind${kinds > 1 ? "s" : ""} of institution` : "Not yet in the directory"}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#E2D4F8", fontFamily: "var(--font-syne)", lineHeight: 1 }}>
                    {zoomedCity.count.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>listed</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(155,93,229,0.14)", marginBottom: 10 }} />

              {/* Directory breakdown */}
              {breakdown.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {breakdown.map((row, i) => (
                    <div key={i} style={{
                      padding: "8px 10px",
                      background: "rgba(155,93,229,0.08)",
                      border: "1px solid rgba(155,93,229,0.18)",
                      borderRadius: 9,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#CBD5E1", lineHeight: 1.35, flex: 1 }}>
                          {row.label}
                        </p>
                        <span style={{
                          fontSize: 10, fontWeight: 800, flexShrink: 0,
                          color: "#B27FF0", fontFamily: "var(--font-syne)",
                        }}>
                          {row.n}
                        </span>
                      </div>
                      <div style={{ marginTop: 6, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((row.n / zoomedCity.count) * 100)}%` }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                          style={{ height: "100%", background: "linear-gradient(90deg, #9B5DE5, #14B8A6)", borderRadius: 2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "10px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 9, border: "1px dashed rgba(255,255,255,0.07)" }}>
                  <p style={{ fontSize: 11, color: "#475569" }}>No institutions listed here yet</p>
                  <p style={{ fontSize: 10, color: "#9B5DE5", marginTop: 4, fontWeight: 600 }}>Add yours free →</p>
                </div>
              )}

              <p style={{ fontSize: 9, color: "#334155", textAlign: "center", marginTop: 10 }}>
                Tap globe to zoom out
              </p>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero phases — cycling headline word, subtitle, and globe tint ──────────
const PHASES = [
  {
    word: "Democratic",
    color: "#9B5DE5",
    hue: 0,
    label: "BUILT FOR ELECTIONS",
    subtitle:
      "Encrypted ballots, verified voters, live tallies. Run your institution's next election on Baalot — free to start.",
  },
  {
    word: "Verifiable",
    color: "#14B8A6",
    hue: 260,
    label: "TAMPER-EVIDENT",
    subtitle:
      "Every ballot is sealed into a hash chain as it is cast, and every voter keeps a receipt they can check afterwards.",
  },
  {
    word: "Private",
    color: "#F59E0B",
    hue: 120,
    label: "ENCRYPTED BY DESIGN",
    subtitle:
      "Your choice is encrypted before it is stored and recorded under a pseudonymous anchor, not your name. One verified identity, one vote.",
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
    // Floor keeps the canvas radius positive — ctx.arc() throws below ~48px viewports
    const calc = () => setGlobeSize(Math.max(120, Math.min(460, window.innerWidth - 48)));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Auto-advance phase every 7.5s — plenty of time to read each word
  useEffect(() => {
    const id = setInterval(() => {
      hasCycledRef.current = true;
      setPhase((p) => (p + 1) % PHASES.length);
    }, 7500);
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
            Now in early access
          </span>
        </motion.div>

        {/* Headline — word cycles through phases */}
        <motion.h1
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="font-syne font-bold text-primary"
          style={{
            fontSize: "clamp(2.1rem, 8vw, 6rem)",
            letterSpacing: "-0.03em",
            lineHeight: 0.94,
            textWrap: "balance",
          }}
        >
          <motion.span variants={fadeUp} className="block">The Future of</motion.span>

          {/* Cycling word — slot-machine slide */}
          <motion.div variants={fadeUp} style={{ display: "block", clipPath: "inset(-4px -200px)" }}>
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
          <StatPill value="AES-256" label="Encrypted ballots"  icon={Lock}   />
          <StatPill value="Free"   label="To start"            icon={Zap}    />
          <StatPill value="1 vote" label="Per verified identity" icon={Shield} />
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
