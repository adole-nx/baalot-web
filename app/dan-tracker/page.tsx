"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

// Personal diet/training tracker. baalot-web is a static export with no auth or
// backend, so this uses a password gate + localStorage (with a JSON export as the
// off-browser backup). Only the SHA-256 of the password ships in the bundle.
const PASSWORD_SHA256 = "f8a603132cb4ad4ce8a06fb2e3fde460f969d8448ea4899a1143b15b9c39f830";

type Meal = { name: string; calories: number; protein: number };
type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";
type DayLog = {
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
  water: number;
  steps: number;
  sleepHours: number;
  gymSession: string;
  gymCompleted: boolean;
  absCompleted: boolean;
  creatineTaken: boolean;
  notes: string;
};
type Lift = "squat" | "bench" | "row" | "rdl" | "ohp" | "pullup";
type WeekLog = {
  weekStarting: string;
  weightKg: number;
  waistCm: number;
  photoTaken: boolean;
  prs: Record<Lift, boolean>;
  deloadWeek: boolean;
  notes: string;
};

const MEALS: [MealKey, string][] = [
  ["breakfast", "Breakfast"],
  ["lunch", "Lunch"],
  ["dinner", "Dinner"],
  ["snacks", "Snacks"],
];
const SESSIONS = ["Leg Day A", "Leg Day B", "Upper Day A", "Upper Day B", "Rest"];
const LIFTS: [Lift, string][] = [
  ["squat", "Squat"],
  ["bench", "Bench"],
  ["row", "Row"],
  ["rdl", "RDL"],
  ["ohp", "OHP"],
  ["pullup", "Pull-up/Pulldown"],
];
const TARGETS = [
  ["Calories", "~2,340 kcal/day (500 kcal deficit)"],
  ["Protein", "130-150g/day"],
  ["Steps", "8,000-10,000/day"],
  ["Water", "2.5-3L/day"],
  ["Sleep", "7-9 hrs/night"],
  ["Gym", "Mon (Leg A), Tue (Upper A), Wed (Leg B), Fri (Upper B)"],
  ["Abs", "Mon-Fri, weekend off"],
  ["Deload", "every 5-6 weeks"],
];

const DAYS_KEY = "tracker_days";
const WEEKS_KEY = "tracker_weeks";
const UNLOCK_KEY = "tracker_unlocked";

const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const emptyDay = (date: string): DayLog => ({
  date,
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
  water: 0,
  steps: 0,
  sleepHours: 0,
  gymSession: "Rest",
  gymCompleted: false,
  absCompleted: false,
  creatineTaken: false,
  notes: "",
});
const emptyWeek = (weekStarting: string): WeekLog => ({
  weekStarting,
  weightKg: 0,
  waistCm: 0,
  photoTaken: false,
  prs: { squat: false, bench: false, row: false, rdl: false, ohp: false, pullup: false },
  deloadWeek: false,
  notes: "",
});

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — export still works from memory */
  }
}
const totals = (d: DayLog) => {
  const all = [...d.breakfast, ...d.lunch, ...d.dinner, ...d.snacks];
  return {
    calories: all.reduce((s, m) => s + (m.calories || 0), 0),
    protein: all.reduce((s, m) => s + (m.protein || 0), 0),
  };
};
async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const input =
  "w-full rounded-lg border border-white/10 bg-void px-3 py-2 text-sm text-primary outline-none focus:border-amber-500";
const card = "rounded-2xl border border-white/10 bg-surface p-5";
const label = "mb-1 block text-xs uppercase tracking-wider text-secondary";

function Toggle({ on, onChange, text }: { on: boolean; onChange: (v: boolean) => void; text: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        on ? "border-teal-500 bg-teal-glow text-teal-500" : "border-white/10 text-secondary"
      }`}
    >
      {on ? "✓ " : ""}
      {text}
    </button>
  );
}

function NumField({ text, value, onChange, step = 1 }: { text: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className={label}>{text}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={0}
        className={input}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((await sha256(pw.trim())) === PASSWORD_SHA256) {
      try {
        localStorage.setItem(UNLOCK_KEY, "true");
      } catch {}
      onUnlock();
    } else setErr(true);
  };
  return (
    <form onSubmit={submit} className={`${card} mx-auto mt-10 max-w-sm space-y-3`}>
      <h1 className="font-syne text-xl font-bold text-primary">Private</h1>
      <input
        type="password"
        autoFocus
        className={input}
        placeholder="Password"
        value={pw}
        onChange={(e) => {
          setPw(e.target.value);
          setErr(false);
        }}
      />
      {err && <p className="text-sm text-vote-red">Wrong password.</p>}
      <button className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white">Unlock</button>
    </form>
  );
}

function Tracker() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const [days, setDays] = useState<DayLog[]>(() => load<DayLog>(DAYS_KEY));
  const [weeks, setWeeks] = useState<WeekLog[]>(() => load<WeekLog>(WEEKS_KEY));
  const [day, setDay] = useState<DayLog>(() => days.find((x) => x.date === today()) ?? emptyDay(today()));
  const [week, setWeek] = useState<WeekLog>(emptyWeek(today()));
  const [flash, setFlash] = useState("");

  const notify = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 1800);
  };

  const pickDate = (date: string) => setDay(days.find((x) => x.date === date) ?? emptyDay(date));
  const pickWeek = (date: string) => setWeek(weeks.find((x) => x.weekStarting === date) ?? emptyWeek(date));

  const setMeal = (key: MealKey, i: number, patch: Partial<Meal>) =>
    setDay((d) => ({ ...d, [key]: d[key].map((m, j) => (j === i ? { ...m, ...patch } : m)) }));

  const saveDay = () => {
    const cleaned = { ...day };
    for (const [k] of MEALS) cleaned[k] = day[k].filter((m) => m.name.trim() || m.calories || m.protein);
    const next = [...days.filter((x) => x.date !== day.date), cleaned].sort((a, b) => b.date.localeCompare(a.date));
    setDays(next);
    setDay(cleaned);
    save(DAYS_KEY, next);
    notify(`Saved ${day.date}`);
  };
  const saveWeek = () => {
    const next = [...weeks.filter((x) => x.weekStarting !== week.weekStarting), week].sort((a, b) =>
      b.weekStarting.localeCompare(a.weekStarting),
    );
    setWeeks(next);
    save(WEEKS_KEY, next);
    notify(`Saved week of ${week.weekStarting}`);
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ tracker_days: days, tracker_weeks: weeks }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dan-tracker-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const dayTotals = totals(day);
  const prevWeek = useMemo(
    () => weeks.filter((w) => w.weekStarting < week.weekStarting).sort((a, b) => b.weekStarting.localeCompare(a.weekStarting))[0],
    [weeks, week.weekStarting],
  );
  const delta = (now: number, before?: number) => {
    if (!now || !before) return "—";
    const d = +(now - before).toFixed(1);
    return `${d > 0 ? "+" : ""}${d}`;
  };

  return (
    <main className="min-h-screen bg-bg px-4 pb-24 pt-28 font-inter text-primary">
      {!unlocked ? (
        <Gate onUnlock={() => setUnlocked(true)} />
      ) : (
        <div className="mx-auto grid max-w-6xl animate-[fadeIn_0.4s_ease-out] gap-6 lg:grid-cols-[1fr_280px]">
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full border border-white/10 p-1">
                {(["daily", "weekly"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-4 py-1.5 text-sm capitalize ${
                      tab === t ? "bg-amber-500 text-white" : "text-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={exportJson} className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-secondary hover:text-primary">
                Download as JSON
              </button>
            </div>

            {tab === "daily" ? (
              <>
                <div className={`${card} flex flex-wrap items-end gap-6`}>
                  <label className="block">
                    <span className={label}>Date</span>
                    <input type="date" className={input} value={day.date} onChange={(e) => e.target.value && pickDate(e.target.value)} />
                  </label>
                  <div>
                    <span className={label}>Calories</span>
                    <p className="font-syne text-3xl font-bold text-amber-400">{dayTotals.calories.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={label}>Protein</span>
                    <p className="font-syne text-3xl font-bold text-teal-500">{dayTotals.protein}g</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {MEALS.map(([key, name]) => (
                    <div key={key} className={card}>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-syne font-semibold">{name}</h3>
                        <span className="text-xs text-secondary">
                          {day[key].reduce((s, m) => s + m.calories, 0)} kcal · {day[key].reduce((s, m) => s + m.protein, 0)}g
                        </span>
                      </div>
                      <div className="space-y-2">
                        {day[key].map((m, i) => (
                          <div key={i} className="grid grid-cols-[1fr_72px_64px_28px] gap-2">
                            <input className={input} placeholder="Food" value={m.name} onChange={(e) => setMeal(key, i, { name: e.target.value })} />
                            <input
                              className={input}
                              type="number"
                              inputMode="numeric"
                              placeholder="kcal"
                              value={m.calories || ""}
                              onChange={(e) => setMeal(key, i, { calories: Number(e.target.value) || 0 })}
                            />
                            <input
                              className={input}
                              type="number"
                              inputMode="numeric"
                              placeholder="P g"
                              value={m.protein || ""}
                              onChange={(e) => setMeal(key, i, { protein: Number(e.target.value) || 0 })}
                            />
                            <button
                              aria-label="Remove"
                              onClick={() => setDay((d) => ({ ...d, [key]: d[key].filter((_, j) => j !== i) }))}
                              className="text-secondary hover:text-vote-red"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setDay((d) => ({ ...d, [key]: [...d[key], { name: "", calories: 0, protein: 0 }] }))}
                        className="mt-3 text-sm text-amber-400 hover:text-amber-500"
                      >
                        + Add item
                      </button>
                    </div>
                  ))}
                </div>

                <div className={`${card} space-y-4`}>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <NumField text="Water (L)" step={0.1} value={day.water} onChange={(v) => setDay({ ...day, water: v })} />
                    <NumField text="Steps" value={day.steps} onChange={(v) => setDay({ ...day, steps: v })} />
                    <NumField text="Sleep (hrs)" step={0.5} value={day.sleepHours} onChange={(v) => setDay({ ...day, sleepHours: v })} />
                    <label className="block">
                      <span className={label}>Gym session</span>
                      <select className={input} value={day.gymSession} onChange={(e) => setDay({ ...day, gymSession: e.target.value })}>
                        {SESSIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Toggle text="Gym completed" on={day.gymCompleted} onChange={(v) => setDay({ ...day, gymCompleted: v })} />
                    <Toggle text="Abs completed" on={day.absCompleted} onChange={(v) => setDay({ ...day, absCompleted: v })} />
                    <Toggle text="Creatine taken" on={day.creatineTaken} onChange={(v) => setDay({ ...day, creatineTaken: v })} />
                  </div>
                  <textarea className={`${input} min-h-[80px]`} placeholder="Notes" value={day.notes} onChange={(e) => setDay({ ...day, notes: e.target.value })} />
                  <button onClick={saveDay} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-400">
                    Save Day
                  </button>
                </div>

                <div className={`${card} overflow-x-auto`}>
                  <h3 className="mb-3 font-syne font-semibold">Last 14 days</h3>
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-secondary">
                      <tr>
                        <th className="py-2 pr-4">Date</th>
                        <th className="pr-4">kcal</th>
                        <th className="pr-4">Protein</th>
                        <th className="pr-4">Steps</th>
                        <th>Gym</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.slice(0, 14).map((d) => {
                        const t = totals(d);
                        return (
                          <tr key={d.date} onClick={() => pickDate(d.date)} className="cursor-pointer border-t border-white/5 hover:bg-elevated">
                            <td className="py-2 pr-4 font-mono">{d.date}</td>
                            <td className="pr-4">{t.calories.toLocaleString()}</td>
                            <td className="pr-4">{t.protein}g</td>
                            <td className="pr-4">{d.steps.toLocaleString()}</td>
                            <td>
                              {d.gymSession}
                              {d.gymCompleted && d.gymSession !== "Rest" ? " ✓" : ""}
                            </td>
                          </tr>
                        );
                      })}
                      {!days.length && (
                        <tr>
                          <td colSpan={5} className="py-3 text-secondary">
                            No days saved yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className={`${card} space-y-4`}>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <label className="col-span-2 block md:col-span-1">
                      <span className={label}>Week starting</span>
                      <input type="date" className={input} value={week.weekStarting} onChange={(e) => e.target.value && pickWeek(e.target.value)} />
                    </label>
                    <NumField text="Weight (kg)" step={0.1} value={week.weightKg} onChange={(v) => setWeek({ ...week, weightKg: v })} />
                    <NumField text="Waist (cm)" step={0.5} value={week.waistCm} onChange={(v) => setWeek({ ...week, waistCm: v })} />
                    <div>
                      <span className={label}>vs prev week</span>
                      <p className="pt-2 text-sm">
                        <span className="text-amber-400">{delta(week.weightKg, prevWeek?.weightKg)} kg</span>
                        {" · "}
                        <span className="text-teal-500">{delta(week.waistCm, prevWeek?.waistCm)} cm</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={label}>PRs this week</span>
                    <div className="flex flex-wrap gap-2">
                      {LIFTS.map(([k, name]) => (
                        <Toggle key={k} text={name} on={week.prs[k]} onChange={(v) => setWeek({ ...week, prs: { ...week.prs, [k]: v } })} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Toggle text="Photo taken" on={week.photoTaken} onChange={(v) => setWeek({ ...week, photoTaken: v })} />
                    <Toggle text="Deload week" on={week.deloadWeek} onChange={(v) => setWeek({ ...week, deloadWeek: v })} />
                  </div>
                  <textarea className={`${input} min-h-[80px]`} placeholder="Notes" value={week.notes} onChange={(e) => setWeek({ ...week, notes: e.target.value })} />
                  <button onClick={saveWeek} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-400">
                    Save Week
                  </button>
                </div>

                <div className={`${card} overflow-x-auto`}>
                  <h3 className="mb-3 font-syne font-semibold">All weeks</h3>
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-secondary">
                      <tr>
                        <th className="py-2 pr-4">Week</th>
                        <th className="pr-4">Weight</th>
                        <th className="pr-4">Waist</th>
                        <th className="pr-4">PRs</th>
                        <th>Deload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map((w, i) => {
                        const prev = weeks[i + 1];
                        return (
                          <tr key={w.weekStarting} onClick={() => pickWeek(w.weekStarting)} className="cursor-pointer border-t border-white/5 hover:bg-elevated">
                            <td className="py-2 pr-4 font-mono">{w.weekStarting}</td>
                            <td className="pr-4">
                              {w.weightKg || "—"} <span className="text-xs text-secondary">({delta(w.weightKg, prev?.weightKg)})</span>
                            </td>
                            <td className="pr-4">
                              {w.waistCm || "—"} <span className="text-xs text-secondary">({delta(w.waistCm, prev?.waistCm)})</span>
                            </td>
                            <td className="pr-4">{Object.values(w.prs).filter(Boolean).length}</td>
                            <td>{w.deloadWeek ? "Yes" : ""}</td>
                          </tr>
                        );
                      })}
                      {!weeks.length && (
                        <tr>
                          <td colSpan={5} className="py-3 text-secondary">
                            No weeks saved yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <aside className={`${card} h-fit space-y-2 lg:sticky lg:top-28`}>
            <h3 className="mb-2 font-syne font-semibold text-amber-400">Targets</h3>
            {TARGETS.map(([k, v]) => (
              <div key={k} className="text-sm">
                <span className="text-secondary">{k}: </span>
                {v}
              </div>
            ))}
          </aside>
        </div>
      )}

      {flash && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-teal-500 px-4 py-2 text-sm font-medium text-void">{flash}</div>
      )}
    </main>
  );
}

// Client-only: everything lives in localStorage, so there is nothing to prerender.
export default dynamic(() => Promise.resolve(Tracker), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-bg" />,
});
