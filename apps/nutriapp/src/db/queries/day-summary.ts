// src/lib/nutrition/day-summary.ts
// ─────────────────────────────────────────────────────────────
// Computes and persists day_summary from meal_logs.
// Should be called after any meal log mutation for the day.
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase/server';
import { computeDayReliability } from '@/lib/nutrition/confidence';
import type { DaySummary, MealLog } from '@/types/nutrition';

// ── Compute and upsert day summary ────────────────────────────

export async function computeAndSaveDaySummary(date: string): Promise<DaySummary> {
  const db = getSupabase();

  // Fetch all logs for the day
  const { data: logs, error } = await db
    .from('meal_logs')
    .select('kcal, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, confidence')
    .eq('meal_date', date);

  if (error) throw new Error(`Failed to fetch logs for ${date}: ${error.message}`);

  const entries = (logs ?? []) as Pick<
    MealLog,
    'kcal' | 'protein_g' | 'carbs_g' | 'fat_g' | 'fiber_g' | 'sugar_g' | 'sodium_mg' | 'confidence'
  >[];

  // Aggregate
  const agg = entries.reduce(
    (acc, l) => {
      acc.total_kcal += l.kcal ?? 0;
      acc.total_protein_g += l.protein_g ?? 0;
      acc.total_carbs_g += l.carbs_g ?? 0;
      acc.total_fat_g += l.fat_g ?? 0;
      acc.total_fiber_g += l.fiber_g ?? 0;
      acc.total_sugar_g += l.sugar_g ?? 0;
      acc.total_sodium_mg += l.sodium_mg ?? 0;
      return acc;
    },
    {
      total_kcal: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fat_g: 0,
      total_fiber_g: 0,
      total_sugar_g: 0,
      total_sodium_mg: 0,
    }
  );

  // Round
  const rounded = Object.fromEntries(
    Object.entries(agg).map(([k, v]) => [k, +v.toFixed(2)])
  );

  const { flag, highConfidencePct } = computeDayReliability(
    entries.map((l) => ({ kcal: l.kcal, confidence: l.confidence }))
  );

  const summary = {
    summary_date: date,
    ...rounded,
    reliability: flag,
    high_confidence_pct: highConfidencePct,
    log_count: entries.length,
    computed_at: new Date().toISOString(),
  };

  const { data, error: upsertError } = await db
    .from('day_summary')
    .upsert(summary, { onConflict: 'summary_date' })
    .select()
    .single();

  if (upsertError) throw new Error(`Failed to upsert day summary: ${upsertError.message}`);
  return data as DaySummary;
}

// ── Get day summary ────────────────────────────────────────────

export async function getDaySummary(date: string): Promise<DaySummary | null> {
  const db = getSupabase();
  const { data } = await db
    .from('day_summary')
    .select('*')
    .eq('summary_date', date)
    .maybeSingle();
  return data as DaySummary | null;
}

// ── Get summaries for a date range ────────────────────────────

export async function getDaySummariesRange(
  from: string,
  to: string
): Promise<DaySummary[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from('day_summary')
    .select('*')
    .gte('summary_date', from)
    .lte('summary_date', to)
    .order('summary_date');

  if (error) throw new Error(error.message);
  return (data ?? []) as DaySummary[];
}
