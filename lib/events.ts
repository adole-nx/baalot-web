/**
 * Baalot Event Themes — lib/events.ts
 *
 * Catalog of holidays, festivals, and global moments the site celebrates
 * with a themed floating banner (see components/EventBanner.tsx).
 *
 * Kept in sync with the mobile app's `baalot/constants/events.ts` — same
 * events, same windows, same accents. If you edit one, mirror the other.
 *
 * Date windows:
 *   { month, day, span? }       — recurs every year (span = number of days, default 1)
 *   { from: 'YYYY-MM-DD', to }  — explicit one-off range (inclusive)
 */

type AnnualWindow = { month: number; day: number; span?: number };
type RangeWindow  = { from: string; to: string };
export type EventWindow = AnnualWindow | RangeWindow;

export interface AppEvent {
  id: string;
  name: string;
  emoji: string;
  /** Banner title, e.g. "Happy Democracy Day!" */
  headline: string;
  /** Banner body copy. */
  message: string;
  /** Short greeting variant (used by the mobile app's hero card). */
  greeting: string;
  /** Solid accent for text/border. */
  accent: string;
  /** Translucent background wash for the banner card. */
  tint: string;
  /** When two events overlap, the higher priority wins. */
  priority: number;
  windows: EventWindow[];
}

export const EVENTS: AppEvent[] = [
  // ── Nigeria national days ─────────────────────────────────────────────
  {
    id: 'democracy-day-ng',
    name: 'Democracy Day (Nigeria)',
    emoji: '🇳🇬',
    headline: 'Happy Democracy Day!',
    message: 'June 12 — honouring Nigeria’s democratic journey. Your vote is your voice, today and every day.',
    greeting: 'Happy Democracy Day',
    accent: '#22C55E',
    tint: 'rgba(34,197,94,0.12)',
    priority: 90,
    windows: [{ month: 6, day: 12 }],
  },
  {
    id: 'independence-day-ng',
    name: 'Independence Day (Nigeria)',
    emoji: '🇳🇬',
    headline: 'Happy Independence Day!',
    message: 'October 1st — celebrating Nigeria. One nation, bound in freedom, peace and unity.',
    greeting: 'Happy Independence Day',
    accent: '#22C55E',
    tint: 'rgba(34,197,94,0.12)',
    priority: 90,
    windows: [{ month: 10, day: 1 }],
  },
  {
    id: 'workers-day',
    name: "Workers' Day",
    emoji: '🛠️',
    headline: "Happy Workers' Day!",
    message: 'Celebrating everyone who builds, teaches, heals and serves. Enjoy the break — you earned it.',
    greeting: "Happy Workers' Day",
    accent: '#F59E0B',
    tint: 'rgba(245,158,11,0.12)',
    priority: 60,
    windows: [{ month: 5, day: 1 }],
  },
  {
    id: 'childrens-day-ng',
    name: "Children's Day (Nigeria)",
    emoji: '🎈',
    headline: "Happy Children's Day!",
    message: 'May 27 — to the leaders of tomorrow. The future of every vote starts with you.',
    greeting: "Happy Children's Day",
    accent: '#EC4899',
    tint: 'rgba(236,72,153,0.12)',
    priority: 60,
    windows: [{ month: 5, day: 27 }],
  },

  // ── Global democracy moments ──────────────────────────────────────────
  {
    id: 'intl-democracy-day',
    name: 'International Day of Democracy',
    emoji: '🗳️',
    headline: 'International Day of Democracy',
    message: 'September 15 — the world celebrates the power of the ballot. So do we, every single day.',
    greeting: 'Happy Democracy Day',
    accent: '#3B82F6',
    tint: 'rgba(59,130,246,0.12)',
    priority: 70,
    windows: [{ month: 9, day: 15 }],
  },

  // ── Religious & seasonal holidays ─────────────────────────────────────
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    headline: 'Merry Christmas!',
    message: 'Wishing you joy, peace and time with the people who matter. From all of us at Baalot.',
    greeting: 'Merry Christmas',
    accent: '#EF4444',
    tint: 'rgba(239,68,68,0.12)',
    priority: 80,
    windows: [{ month: 12, day: 24, span: 3 }],
  },
  {
    id: 'new-year',
    name: 'New Year',
    emoji: '🎉',
    headline: 'Happy New Year!',
    message: 'A fresh year, a fresh ballot. Here’s to new beginnings — thank you for being with us.',
    greeting: 'Happy New Year',
    accent: '#FACC15',
    tint: 'rgba(250,204,21,0.12)',
    priority: 85,
    windows: [{ month: 12, day: 31 }, { month: 1, day: 1 }],
  },
  // Eid dates depend on moon sighting — windows below are the expected
  // dates; refresh them yearly (one-line edits).
  {
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    emoji: '🌙',
    headline: 'Eid Mubarak!',
    message: 'Wishing you and your loved ones a joyful Eid al-Fitr, full of peace and celebration.',
    greeting: 'Eid Mubarak',
    accent: '#14B8A6',
    tint: 'rgba(20,184,166,0.12)',
    priority: 80,
    windows: [
      { from: '2027-03-09', to: '2027-03-10' },
      { from: '2028-02-26', to: '2028-02-27' },
    ],
  },
  {
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    emoji: '🌙',
    headline: 'Eid Mubarak!',
    message: 'A blessed Eid al-Adha to you and yours, from everyone at Baalot.',
    greeting: 'Eid Mubarak',
    accent: '#14B8A6',
    tint: 'rgba(20,184,166,0.12)',
    priority: 80,
    windows: [
      { from: '2027-05-16', to: '2027-05-17' },
      { from: '2028-05-04', to: '2028-05-05' },
    ],
  },
  {
    id: 'easter',
    name: 'Easter',
    emoji: '🐣',
    headline: 'Happy Easter!',
    message: 'Wishing you a season of renewal and hope. Enjoy the long weekend!',
    greeting: 'Happy Easter',
    accent: '#FB7185',
    tint: 'rgba(251,113,133,0.12)',
    priority: 80,
    windows: [
      { from: '2027-03-26', to: '2027-03-29' },   // Good Friday → Easter Monday
      { from: '2028-04-14', to: '2028-04-17' },
    ],
  },

  // ── Sporting moments ──────────────────────────────────────────────────
  {
    id: 'world-cup-2026',
    name: 'FIFA World Cup 2026',
    emoji: '⚽',
    headline: 'The World Cup is on!',
    message: 'USA · Canada · Mexico 2026 — 48 teams, one trophy. May the best XI win. Up Super Eagles!',
    greeting: 'It’s World Cup season',
    accent: '#38BDF8',
    tint: 'rgba(56,189,248,0.12)',
    priority: 75,
    windows: [{ from: '2026-06-11', to: '2026-07-19' }],
  },
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Local-date key, e.g. '2026-06-12' — avoids UTC off-by-one near midnight. */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function windowMatches(w: EventWindow, now: Date): boolean {
  if ('from' in w) {
    const key = dateKey(now);
    return key >= w.from && key <= w.to;
  }
  const start = new Date(now.getFullYear(), w.month - 1, w.day);
  const end   = new Date(start);
  end.setDate(end.getDate() + (w.span ?? 1));
  return now >= start && now < end;
}

/**
 * Returns the highest-priority event active right now, or null.
 * Pass a date to test a specific day, e.g. getActiveEvent(new Date(2026, 11, 25)).
 */
export function getActiveEvent(now: Date = new Date()): AppEvent | null {
  let best: AppEvent | null = null;
  for (const ev of EVENTS) {
    if (best && ev.priority <= best.priority) continue;
    if (ev.windows.some(w => windowMatches(w, now))) best = ev;
  }
  return best;
}
