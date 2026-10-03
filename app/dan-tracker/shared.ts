export type Meal = { name: string; calories: number; protein: number };
export type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";
export type DayLog = {
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
  updatedAt?: number;
};
export type Lift = "squat" | "bench" | "row" | "rdl" | "ohp" | "pullup";
export type WeekLog = {
  weekStarting: string;
  weightKg: number;
  waistCm: number;
  photoTaken: boolean;
  prs: Record<Lift, boolean>;
  deloadWeek: boolean;
  notes: string;
  updatedAt?: number;
};

// Numeric floors of the targets panel, used for progress bars and hit-rates.
export const GOAL = { calories: 2340, protein: 130, steps: 8000, water: 2.5, sleep: 7, gymPerWeek: 4 };

export const isoDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const today = () => isoDate(new Date());
export const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + n);
  return isoDate(d);
};

export const totals = (d: DayLog) => {
  const all = [...d.breakfast, ...d.lunch, ...d.dinner, ...d.snacks];
  return {
    calories: all.reduce((s, m) => s + (m.calories || 0), 0),
    protein: all.reduce((s, m) => s + (m.protein || 0), 0),
  };
};
