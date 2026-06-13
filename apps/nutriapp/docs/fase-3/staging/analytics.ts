/**
 * src/lib/analytics.ts
 * Utilidades de cálculo para analytics de semana y mes.
 */

import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { es } from 'date-fns/locale';

// ─── Tipos base ───────────────────────────────────────────────────────────────

export interface DailySummary {
  summary_date: string;   // 'YYYY-MM-DD'
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  total_sodium_mg: number;
  total_calcium_mg: number;
  total_iron_mg: number;
  total_potassium_mg: number;
  total_vitamin_d_mcg: number;
  is_reliable: boolean;
  goal_kcal: number;
}

export interface WeightLog {
  logged_at: string;
  weight_kg: number;
}

export interface UserGoals {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  // DRI targets (valores USDA por defecto, personalizables)
  fiber_g: number;
  sodium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  potassium_mg: number;
  vitamin_d_mcg: number;
}

// ─── DRI por defecto (adulto ~30a, sexo neutro) — ajustar desde perfil ───────

export const DEFAULT_DRI: Omit<UserGoals, 'kcal' | 'protein_g' | 'carbs_g' | 'fat_g'> = {
  fiber_g:       28,
  sodium_mg:    2300,
  calcium_mg:   1000,
  iron_mg:        18,
  potassium_mg: 3500,
  vitamin_d_mcg:  20,
};

// ─── Semana ───────────────────────────────────────────────────────────────────

export interface DayPoint {
  date: string;
  label: string;       // 'lun', 'mar', …
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
  // DRI promedio de la semana
  avg_calcium_mg: number;
  avg_iron_mg: number;
  avg_potassium_mg: number;
  avg_vitamin_d_mcg: number;
  avg_fiber_g: number;
}

export function buildWeekAnalytics(
  referenceDate: Date,
  summaries: DailySummary[],
  goal_kcal: number
): WeekAnalytics {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(referenceDate,   { weekStartsOn: 1 });
  const allDays   = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const byDate = Object.fromEntries(summaries.map(s => [s.summary_date, s]));

  const days: DayPoint[] = allDays.map(d => {
    const key = format(d, 'yyyy-MM-dd');
    const s   = byDate[key];
    return {
      date:       key,
      label:      format(d, 'EEE', { locale: es }).slice(0, 3),
      kcal:       s?.total_kcal ?? null,
      goal_kcal,
      protein_g:  s?.total_protein_g ?? 0,
      carbs_g:    s?.total_carbs_g ?? 0,
      fat_g:      s?.total_fat_g ?? 0,
      is_reliable: s?.is_reliable ?? false,
      has_data:   !!s,
    };
  });

  const logged = days.filter(d => d.has_data);
  const avg = (fn: (d: DailySummary) => number) =>
    logged.length > 0
      ? logged.reduce((acc, d) => {
          const s = byDate[d.date];
          return acc + (s ? fn(s) : 0);
        }, 0) / logged.length
      : 0;

  return {
    week_start:      format(weekStart, 'yyyy-MM-dd'),
    week_end:        format(weekEnd,   'yyyy-MM-dd'),
    days,
    avg_kcal:        avg(s => s.total_kcal),
    avg_protein_g:   avg(s => s.total_protein_g),
    avg_carbs_g:     avg(s => s.total_carbs_g),
    avg_fat_g:       avg(s => s.total_fat_g),
    reliable_days:   logged.filter(d => d.is_reliable).length,
    total_logged_days: logged.length,
    goal_kcal,
    avg_calcium_mg:    avg(s => s.total_calcium_mg),
    avg_iron_mg:       avg(s => s.total_iron_mg),
    avg_potassium_mg:  avg(s => s.total_potassium_mg),
    avg_vitamin_d_mcg: avg(s => s.total_vitamin_d_mcg),
    avg_fiber_g:       avg(s => s.total_fiber_g),
  };
}

// ─── Mes ──────────────────────────────────────────────────────────────────────

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
  summaries: DailySummary[],
  weightLogs: WeightLog[],
  goal_kcal: number
): MonthAnalytics {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd   = endOfMonth(referenceDate);
  const allDays    = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const byDate   = Object.fromEntries(summaries.map(s => [s.summary_date, s]));
  const weightMap = Object.fromEntries(weightLogs.map(w => [w.logged_at, w.weight_kg]));

  const days: MonthDayPoint[] = allDays.map(d => {
    const key = format(d, 'yyyy-MM-dd');
    const s   = byDate[key];
    return {
      date:        key,
      kcal:        s?.total_kcal ?? null,
      weight_kg:   weightMap[key] ?? null,
      is_reliable: s?.is_reliable ?? false,
    };
  });

  const loggedDays  = days.filter(d => d.kcal !== null);
  const weightDays  = days.filter(d => d.weight_kg !== null);

  const avg_kcal = loggedDays.length > 0
    ? loggedDays.reduce((a, d) => a + (d.kcal ?? 0), 0) / loggedDays.length
    : 0;

  const avg_weight = weightDays.length > 0
    ? weightDays.reduce((a, d) => a + (d.weight_kg ?? 0), 0) / weightDays.length
    : null;

  const firstWeight = weightDays[0]?.weight_kg ?? null;
  const lastWeight  = weightDays[weightDays.length - 1]?.weight_kg ?? null;
  const weight_change =
    firstWeight !== null && lastWeight !== null
      ? parseFloat((lastWeight - firstWeight).toFixed(2))
      : null;

  return {
    month_start:      format(monthStart, 'yyyy-MM-dd'),
    month_end:        format(monthEnd,   'yyyy-MM-dd'),
    days,
    avg_kcal:         parseFloat(avg_kcal.toFixed(1)),
    avg_weight_kg:    avg_weight !== null ? parseFloat(avg_weight.toFixed(2)) : null,
    weight_change_kg: weight_change,
    reliable_days:    loggedDays.filter(d => d.is_reliable).length,
    total_logged_days: loggedDays.length,
    goal_kcal,
  };
}

// ─── DRI helpers ─────────────────────────────────────────────────────────────

export interface DRIEntry {
  key: string;
  label: string;
  unit: string;
  intake: number;
  target: number;
  pct: number;         // 0-100
  status: 'ok' | 'low' | 'high';
}

export function buildDRIEntries(
  summary: Partial<DailySummary>,
  goals: UserGoals
): DRIEntry[] {
  const entries: Array<{
    key: keyof DailySummary;
    label: string;
    unit: string;
    target: number;
    highThreshold?: number;
  }> = [
    { key: 'total_calcium_mg',    label: 'Calcio',     unit: 'mg',  target: goals.calcium_mg },
    { key: 'total_iron_mg',       label: 'Hierro',     unit: 'mg',  target: goals.iron_mg },
    { key: 'total_potassium_mg',  label: 'Potasio',    unit: 'mg',  target: goals.potassium_mg },
    { key: 'total_vitamin_d_mcg', label: 'Vitamina D', unit: 'mcg', target: goals.vitamin_d_mcg },
    { key: 'total_fiber_g',       label: 'Fibra',      unit: 'g',   target: goals.fiber_g },
    { key: 'total_sodium_mg',     label: 'Sodio',      unit: 'mg',  target: goals.sodium_mg, highThreshold: goals.sodium_mg },
  ];

  return entries.map(e => {
    const intake = (summary[e.key] as number | undefined) ?? 0;
    const pct    = e.target > 0 ? Math.min(Math.round((intake / e.target) * 100), 150) : 0;
    const status: DRIEntry['status'] =
      e.highThreshold && intake > e.highThreshold ? 'high' :
      pct < 70 ? 'low' : 'ok';

    return { key: e.key, label: e.label, unit: e.unit, intake, target: e.target, pct, status };
  });
}
