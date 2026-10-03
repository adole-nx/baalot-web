"use client";

import { useState } from "react";
import { addDays, GOAL, today, totals, type DayLog, type WeekLog } from "./shared";

const card = "rounded-2xl border border-white/10 bg-surface p-5";
const label = "text-xs uppercase tracking-wider text-secondary";
const fmt = (n: number, dp = 0) => n.toLocaleString(undefined, { maximumFractionDigits: dp, minimumFractionDigits: dp });

type Point = { x: string; y: number };

// Single-series line with a crosshair + tooltip. Weight and waist each get their own
// chart (never a shared dual axis).
function LineChart({ title, unit, data, color }: { title: string; unit: string; data: Point[]; color: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 180;
  const pad = { l: 40, r: 12, t: 12, b: 24 };
  if (data.length < 2) {
    return (
      <div className={card}>
        <h3 className="font-syne font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-secondary">Log at least two weeks to see the trend.</p>
      </div>
    );
  }
  const ys = data.map((d) => d.y);
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const span = hi - lo || 1;
  const min = lo - span * 0.15;
  const max = hi + span * 0.15;
  const px = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const py = (y: number) => pad.t + (1 - (y - min) / (max - min)) * (H - pad.t - pad.b);
  const path = data.map((d, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(d.y).toFixed(1)}`).join("");
  const change = data[data.length - 1].y - data[0].y;
  const ticks = [min + (max - min) * 0.2, min + (max - min) * 0.5, min + (max - min) * 0.8];
  const h = hover !== null ? data[hover] : null;

  return (
    <div className={card}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-syne font-semibold">{title}</h3>
        <span className="text-sm text-secondary">
          {change > 0 ? "+" : ""}
          {fmt(change, 1)} {unit} since {data[0].x}
        </span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round(((x - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, i)));
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={py(t)} y2={py(t)} stroke="rgba(255,255,255,0.06)" />
              <text x={pad.l - 6} y={py(t) + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.45)">
                {fmt(t, 1)}
              </text>
            </g>
          ))}
          <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {data.map((d, i) => (
            <circle key={d.x} cx={px(i)} cy={py(d.y)} r={hover === i ? 5 : 3} fill={color} stroke="#0D1117" strokeWidth="2" />
          ))}
          {hover !== null && <line x1={px(hover)} x2={px(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(255,255,255,0.2)" />}
          <text x={pad.l} y={H - 6} fontSize="11" fill="rgba(255,255,255,0.45)">
            {data[0].x}
          </text>
          <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.45)">
            {data[data.length - 1].x}
          </text>
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-white/10 bg-elevated px-2.5 py-1.5 text-xs text-primary shadow-lg"
            style={{ left: `${(px(hover) / W) * 100}%` }}
          >
            <div className="text-secondary">{h.x}</div>
            <div className="font-semibold">
              {fmt(h.y, 1)} {unit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Daily bars against a target line; unlogged days show as a gap, not a zero.
function TargetBars({
  title,
  unit,
  data,
  target,
  color,
  ceiling = false,
}: {
  title: string;
  unit: string;
  data: (Point | null)[];
  target: number;
  color: string;
  ceiling?: boolean; // target is a cap (calories), not a floor
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 160;
  const pad = { l: 40, r: 12, t: 12, b: 20 };
  const vals = data.map((d) => d?.y ?? 0);
  const max = Math.max(target * 1.3, ...vals);
  const slot = (W - pad.l - pad.r) / data.length;
  const bw = Math.max(2, slot - 2);
  const py = (y: number) => pad.t + (1 - y / max) * (H - pad.t - pad.b);
  const logged = data.filter(Boolean) as Point[];
  const hits = logged.filter((d) => (ceiling ? d.y > 0 && d.y <= target * 1.05 : d.y >= target)).length;
  const h = hover !== null ? data[hover] : null;

  return (
    <div className={card}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-syne font-semibold">{title}</h3>
        <span className="text-sm text-secondary">
          {logged.length ? `${hits}/${logged.length} days ${ceiling ? "at or under" : "at"} ${fmt(target)} ${unit}${ceiling ? "" : "+"}` : "No days logged yet"}
        </span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => {
            const x = pad.l + i * slot + 1;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={x - 1} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
                {d && d.y > 0 && (
                  <rect
                    x={x}
                    y={py(d.y)}
                    width={bw}
                    height={H - pad.b - py(d.y)}
                    rx={Math.min(4, bw / 2)}
                    fill={color}
                    opacity={hover === null || hover === i ? 1 : 0.5}
                  />
                )}
              </g>
            );
          })}
          <line x1={pad.l} x2={W - pad.r} y1={py(target)} y2={py(target)} stroke="rgba(255,255,255,0.5)" strokeDasharray="4 4" />
          <text x={pad.l - 6} y={py(target) + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.6)">
            {fmt(target)}
          </text>
          <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgba(255,255,255,0.1)" />
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-white/10 bg-elevated px-2.5 py-1.5 text-xs text-primary shadow-lg"
            style={{ left: `${((pad.l + (hover + 0.5) * slot) / W) * 100}%` }}
          >
            <div className="text-secondary">{h?.x ?? addDays(today(), hover - data.length + 1)}</div>
            <div className="font-semibold">{h ? `${fmt(h.y)} ${unit}` : "not logged"}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export default function Progress({ days, weeks }: { days: DayLog[]; weeks: WeekLog[] }) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const t = today();
  const range = (from: number, to: number) => {
    const out: DayLog[] = [];
    for (let i = from; i < to; i++) {
      const d = byDate.get(addDays(t, -i));
      if (d) out.push(d);
    }
    return out;
  };
  const cur = range(0, 7);
  const prev = range(7, 14);

  type Metric = { name: string; unit: string; dp: number; goal: number; pick: (d: DayLog) => number; lowerIsBetter?: boolean };
  const metrics: Metric[] = [
    { name: "Calories", unit: "kcal", dp: 0, goal: GOAL.calories, pick: (d) => totals(d).calories, lowerIsBetter: true },
    { name: "Protein", unit: "g", dp: 0, goal: GOAL.protein, pick: (d) => totals(d).protein },
    { name: "Steps", unit: "", dp: 0, goal: GOAL.steps, pick: (d) => d.steps },
    { name: "Sleep", unit: "h", dp: 1, goal: GOAL.sleep, pick: (d) => d.sleepHours },
    { name: "Water", unit: "L", dp: 1, goal: GOAL.water, pick: (d) => d.water },
  ];

  // Streak: consecutive days ending today (or yesterday, so an unlogged morning doesn't zero it).
  const streak = (ok: (d: DayLog) => boolean) => {
    const td = byDate.get(t);
    let n = 0;
    for (let i = td && ok(td) ? 0 : 1; ; i++) {
      const d = byDate.get(addDays(t, -i));
      if (!d || !ok(d)) break;
      n++;
    }
    return n;
  };
  const gymDone = cur.filter((d) => d.gymCompleted && d.gymSession !== "Rest").length;
  const absDone = cur.filter((d) => d.absCompleted).length;

  const last28 = Array.from({ length: 28 }, (_, i) => byDate.get(addDays(t, i - 27)) ?? null);
  const wk = [...weeks].sort((a, b) => a.weekStarting.localeCompare(b.weekStarting));
  const weight = wk.filter((w) => w.weightKg).map((w) => ({ x: w.weekStarting, y: w.weightKg }));
  const waist = wk.filter((w) => w.waistCm).map((w) => ({ x: w.weekStarting, y: w.waistCm }));
  const sinceLastDeload = (() => {
    const i = [...wk].reverse().findIndex((w) => w.deloadWeek);
    return i === -1 ? wk.length : i;
  })();

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className="mb-1 font-syne font-semibold">Last 7 days vs the 7 before</h3>
        <p className="mb-4 text-sm text-secondary">
          Averages over logged days only ({cur.length} this week, {prev.length} before).
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {metrics.map((m) => {
            const a = avg(cur.map(m.pick));
            const b = avg(prev.map(m.pick));
            const d = cur.length && prev.length ? a - b : null;
            const onTarget = m.lowerIsBetter ? a > 0 && a <= m.goal * 1.05 : a >= m.goal;
            const better = d === null || d === 0 ? null : m.lowerIsBetter ? (a > m.goal ? d < 0 : null) : d > 0;
            const pct = Math.min(100, (a / m.goal) * 100);
            return (
              <div key={m.name}>
                <span className={label}>{m.name}</span>
                <p className="font-syne text-2xl font-bold">
                  {cur.length ? fmt(a, m.dp) : "—"}
                  <span className="ml-1 text-sm font-normal text-secondary">{m.unit}</span>
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${onTarget ? "bg-teal-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-secondary">
                  {d === null ? `goal ${fmt(m.goal, m.dp)}` : (
                    <>
                      <span className={better === null ? "" : better ? "text-teal-500" : "text-vote-red"}>
                        {d > 0 ? "▲" : d < 0 ? "▼" : "•"} {fmt(Math.abs(d), m.dp)}
                      </span>{" "}
                      vs prior · goal {fmt(m.goal, m.dp)}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Logging streak", `${streak(() => true)}d`],
          ["Protein streak", `${streak((d) => totals(d).protein >= GOAL.protein)}d`],
          ["Creatine streak", `${streak((d) => d.creatineTaken)}d`],
          ["Gym, last 7 days", `${gymDone}/${GOAL.gymPerWeek}`],
          ["Abs, last 7 days", `${absDone}/5`],
          ["Weeks since deload", wk.length ? `${sinceLastDeload}` : "—"],
          ["Weight change", weight.length > 1 ? `${weight[weight.length - 1].y - weight[0].y > 0 ? "+" : ""}${fmt(weight[weight.length - 1].y - weight[0].y, 1)} kg` : "—"],
          ["Waist change", waist.length > 1 ? `${waist[waist.length - 1].y - waist[0].y > 0 ? "+" : ""}${fmt(waist[waist.length - 1].y - waist[0].y, 1)} cm` : "—"],
        ].map(([k, v]) => (
          <div key={k} className={card}>
            <span className={label}>{k}</span>
            <p className="font-syne text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      {sinceLastDeload >= 5 && wk.length >= 5 && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm">
          {sinceLastDeload} weeks since the last deload. The plan calls for one every 5-6 weeks.
        </p>
      )}

      <LineChart title="Weight" unit="kg" data={weight} color="#9B5DE5" />
      <LineChart title="Waist" unit="cm" data={waist} color="#14B8A6" />
      <TargetBars
        title="Calories, last 28 days"
        unit="kcal"
        target={GOAL.calories}
        ceiling
        color="#9B5DE5"
        data={last28.map((d) => (d ? { x: d.date, y: totals(d).calories } : null))}
      />
      <TargetBars
        title="Protein, last 28 days"
        unit="g"
        target={GOAL.protein}
        color="#14B8A6"
        data={last28.map((d) => (d ? { x: d.date, y: totals(d).protein } : null))}
      />
    </div>
  );
}
