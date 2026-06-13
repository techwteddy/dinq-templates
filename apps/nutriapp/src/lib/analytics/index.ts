import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import type { DaySummary } from "@/types/nutrition";

export interface WeightLog {
  logged_at: string;
  weight_kg: number;
}

export interface UserGoals {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sodium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  potassium_mg: number;
  vitamin_d_mcg: number;
}

export const DEFAULT_DRI: Omit<UserGoals, "kcal" | "protein_g" | "carbs_g" | "fat_g"> = {
  fiber_g: 28,
  sodium_mg: 2300,
  calcium_mg: 1000,
  iron_mg: 18,
  potassium_mg: 3500,
  vitamin_d_mcg: 20,
};

export interface DayPoint {
  date: string;
  label: string;
  kcal: number | null;
  goal_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_reliable: boolean;
  has_data: boolean;
}

export interface WeekAnalytics {
  week_start: string;
  week_end: string;
  days: DayPoint[];
  avg_kcal: number;
  avg_protein_g: number;
  avg_carbs_g: number;
  avg_fat_g: number;
  reliable_days: number;
  total_logged_days: number;
  goal_kcal: number;
  avg_calcium_mg: number;
  avg_iron_mg: number;
  avg_potassium_mg: number;
  avg_vitamin_d_mcg: number;
  avg_fiber_g: number;
}

export function buildWeekAnalytics(
  referenceDate: Date,
  summaries: DaySummary[],
  goalKcal: number
): WeekAnalytics {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const byDate = Object.fromEntries(summaries.map((s) => [s.summary_date, s]));

  const days = allDays.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const summary = byDate[key];
    return {
      date: key,
      label: format(day, "EEE", { locale: es }).slice(0, 3),
      kcal: summary?.total_kcal ?? null,
      goal_kcal: goalKcal,
      protein_g: summary?.total_protein_g ?? 0,
      carbs_g: summary?.total_carbs_g ?? 0,
      fat_g: summary?.total_fat_g ?? 0,
      is_reliable: summary?.reliability === "RELIABLE",
      has_data: Boolean(summary),
    };
  });

  const logged = days.filter((day) => day.has_data);
  const avg = (pick: (summary: DaySummary) => number | null) =>
    logged.length
      ? logged.reduce((sum, day) => sum + (pick(byDate[day.date]) ?? 0), 0) / logged.length
      : 0;

  return {
    week_start: format(weekStart, "yyyy-MM-dd"),
    week_end: format(weekEnd, "yyyy-MM-dd"),
    days,
    avg_kcal: avg((s) => s.total_kcal),
    avg_protein_g: avg((s) => s.total_protein_g),
    avg_carbs_g: avg((s) => s.total_carbs_g),
    avg_fat_g: avg((s) => s.total_fat_g),
    reliable_days: logged.filter((day) => day.is_reliable).length,
    total_logged_days: logged.length,
    goal_kcal: goalKcal,
    avg_calcium_mg: avg((s) => s.total_calcium_mg),
    avg_iron_mg: avg((s) => s.total_iron_mg),
    avg_potassium_mg: avg((s) => s.total_potassium_mg),
    avg_vitamin_d_mcg: 0,
    avg_fiber_g: avg((s) => s.total_fiber_g),
  };
}

export interface MonthDayPoint {
  date: string;
  kcal: number | null;
  weight_kg: number | null;
  is_reliable: boolean;
}

export interface MonthAnalytics {
  month_start: string;
  month_end: string;
  days: MonthDayPoint[];
  avg_kcal: number;
  avg_weight_kg: number | null;
  weight_change_kg: number | null;
  reliable_days: number;
  total_logged_days: number;
  goal_kcal: number;
}

export function buildMonthAnalytics(
  referenceDate: Date,
  summaries: DaySummary[],
  weightLogs: WeightLog[],
  goalKcal: number
): MonthAnalytics {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const byDate = Object.fromEntries(summaries.map((s) => [s.summary_date, s]));
  const weights = Object.fromEntries(weightLogs.map((w) => [w.logged_at, w.weight_kg]));

  const days = allDays.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const summary = byDate[key];
    return {
      date: key,
      kcal: summary?.total_kcal ?? null,
      weight_kg: weights[key] ?? null,
      is_reliable: summary?.reliability === "RELIABLE",
    };
  });

  const loggedDays = days.filter((day) => day.kcal !== null);
  const weightDays = days.filter((day) => day.weight_kg !== null);
  const avgKcal = loggedDays.length
    ? loggedDays.reduce((sum, day) => sum + (day.kcal ?? 0), 0) / loggedDays.length
    : 0;
  const avgWeight = weightDays.length
    ? weightDays.reduce((sum, day) => sum + (day.weight_kg ?? 0), 0) / weightDays.length
    : null;
  const firstWeight = weightDays[0]?.weight_kg ?? null;
  const lastWeight = weightDays[weightDays.length - 1]?.weight_kg ?? null;

  return {
    month_start: format(monthStart, "yyyy-MM-dd"),
    month_end: format(monthEnd, "yyyy-MM-dd"),
    days,
    avg_kcal: +avgKcal.toFixed(1),
    avg_weight_kg: avgWeight !== null ? +avgWeight.toFixed(2) : null,
    weight_change_kg:
      firstWeight !== null && lastWeight !== null ? +(lastWeight - firstWeight).toFixed(2) : null,
    reliable_days: loggedDays.filter((day) => day.is_reliable).length,
    total_logged_days: loggedDays.length,
    goal_kcal: goalKcal,
  };
}

export interface DRIEntry {
  key: string;
  label: string;
  unit: string;
  intake: number;
  target: number;
  pct: number;
  status: "ok" | "low" | "high";
}

export function buildDRIEntries(
  summary: Partial<Record<string, number>>,
  goals: UserGoals
): DRIEntry[] {
  const entries = [
    ["total_calcium_mg", "Calcio", "mg", goals.calcium_mg],
    ["total_iron_mg", "Hierro", "mg", goals.iron_mg],
    ["total_potassium_mg", "Potasio", "mg", goals.potassium_mg],
    ["total_vitamin_d_mcg", "Vitamina D", "mcg", goals.vitamin_d_mcg],
    ["total_fiber_g", "Fibra", "g", goals.fiber_g],
    ["total_sodium_mg", "Sodio", "mg", goals.sodium_mg],
  ] as const;

  return entries.map(([key, label, unit, target]) => {
    const intake = summary[key] ?? 0;
    const pct = target > 0 ? Math.min(Math.round((intake / target) * 100), 150) : 0;
    const status = key === "total_sodium_mg" && intake > target ? "high" : pct < 70 ? "low" : "ok";
    return { key, label, unit, intake, target, pct, status };
  });
}
