// src/lib/nutrition/confidence.ts
// ─────────────────────────────────────────────────────────────
// Confidence level rules as defined in Phase 2 spec.
// ─────────────────────────────────────────────────────────────

import type { ConfidenceLevel, FoodSource, MealLog, ReliabilityFlag } from '@/types/nutrition';

// ── Confidence classification ──────────────────────────────────

/**
 * HIGH  : FDC food with weighed grams (or well-defined recipe).
 * MEDIUM: Complete product data or generic food estimated in grams.
 * LOW   : Approximations, incomplete data, loosely defined recipes.
 */
export function classifyConfidence(
  source: FoodSource,
  hasCompleteNutrients: boolean
): ConfidenceLevel {
  if (source === 'FDC' && hasCompleteNutrients) return 'HIGH';
  if (source === 'OFF' && hasCompleteNutrients) return 'MEDIUM';
  if (source === 'RECIPE' && hasCompleteNutrients) return 'MEDIUM';
  if (source === 'MANUAL' && hasCompleteNutrients) return 'MEDIUM';
  return 'LOW';
}

// ── Day reliability from meal logs ─────────────────────────────

/**
 * Computes the day reliability flag.
 *
 * RELIABLE   : >= 75% of total kcal come from HIGH or MEDIUM logs.
 * PARTIAL    : 40–74%.
 * UNRELIABLE : < 40%.
 */
export function computeDayReliability(logs: Pick<MealLog, 'kcal' | 'confidence'>[]): {
  flag: ReliabilityFlag;
  highConfidencePct: number;
} {
  const totalKcal = logs.reduce((acc, l) => acc + (l.kcal ?? 0), 0);
  const reliableKcal = logs
    .filter((l) => l.confidence === 'HIGH' || l.confidence === 'MEDIUM')
    .reduce((acc, l) => acc + (l.kcal ?? 0), 0);

  const pct = totalKcal > 0 ? (reliableKcal / totalKcal) * 100 : 0;

  let flag: ReliabilityFlag = 'UNRELIABLE';
  if (pct >= 75) flag = 'RELIABLE';
  else if (pct >= 40) flag = 'PARTIAL';

  return { flag, highConfidencePct: +pct.toFixed(1) };
}
