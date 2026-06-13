// src/lib/nutrition/frequent-meals.ts
// ─────────────────────────────────────────────────────────────
// Detects and persists repeated meal combinations (habits).
// A habit is a (meal_type, items[]) combo seen >= MIN_OCCURRENCES times.
// ─────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase/server';
import type { Habit, HabitItem, MealType } from '@/types/nutrition';

const MIN_OCCURRENCES = 2;
const LOOKBACK_DAYS = 30;

// ── Key a meal combination deterministically ───────────────────

function mealKey(items: HabitItem[]): string {
  return items
    .map((i) => `${i.food_id}:${i.grams}`)
    .sort()
    .join('|');
}

// ── Detect habits from recent meal_logs ───────────────────────

export async function detectAndSaveHabits(): Promise<Habit[]> {
  const db = getSupabase();

  const since = new Date();
  since.setDate(since.getDate() - LOOKBACK_DAYS);

  // Fetch all food-based logs in the window
  const { data: logs, error } = await db
    .from('meal_logs')
    .select('meal_date, meal_type, food_id, grams, food:foods_master(id, name)')
    .not('food_id', 'is', null)
    .gte('meal_date', since.toISOString().slice(0, 10))
    .order('meal_date');

  if (error) throw new Error(error.message);

  // Group by (meal_date, meal_type)
  const dayMealMap = new Map<
    string,
    { meal_type: MealType; items: HabitItem[] }
  >();

  for (const log of logs ?? []) {
    const k = `${log.meal_date}__${log.meal_type}`;
    if (!dayMealMap.has(k)) {
      dayMealMap.set(k, { meal_type: log.meal_type as MealType, items: [] });
    }
    const food = Array.isArray(log.food) ? log.food[0] : log.food;
    dayMealMap.get(k)!.items.push({
      food_id: log.food_id,
      food_name: food?.name ?? 'Alimento desconocido',
      grams: log.grams,
    });
  }

  // Count occurrences of each canonical combo
  const comboCount = new Map<
    string,
    { meal_type: MealType; items: HabitItem[]; count: number; lastDate: string }
  >();

  for (const [dayMeal, { meal_type, items }] of dayMealMap) {
    const date = dayMeal.split('__')[0];
    const key = `${meal_type}:${mealKey(items)}`;
    if (!comboCount.has(key)) {
      comboCount.set(key, { meal_type, items, count: 0, lastDate: date });
    }
    const entry = comboCount.get(key)!;
    entry.count += 1;
    if (date > entry.lastDate) entry.lastDate = date;
  }

  // Filter to frequent combos
  const frequent = [...comboCount.values()].filter(
    (c) => c.count >= MIN_OCCURRENCES
  );

  const savedHabits: Habit[] = [];

  for (const combo of frequent) {
    const label = buildHabitLabel(combo.meal_type, combo.items);

    // Upsert based on label uniqueness (simple dedup strategy)
    const { data, error: upsertErr } = await db
      .from('habits')
      .upsert(
        {
          meal_type: combo.meal_type,
          label,
          occurrence_count: combo.count,
          last_used_at: combo.lastDate,
          items: combo.items,
        },
        {
          onConflict: 'label',  // label is the natural key for now
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (!upsertErr && data) savedHabits.push(data as Habit);
  }

  return savedHabits;
}

// ── List habits by meal type ───────────────────────────────────

export async function listHabits(mealType?: MealType): Promise<Habit[]> {
  const db = getSupabase();
  let query = db
    .from('habits')
    .select('*')
    .order('occurrence_count', { ascending: false });

  if (mealType) query = query.eq('meal_type', mealType);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Habit[];
}

// ── Apply a habit (bulk-add its items to meal_logs) ────────────

export async function applyHabit(
  habitId: string,
  targetDate: string
): Promise<void> {
  const db = getSupabase();

  const { data: habit, error } = await db
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();

  if (error || !habit) throw new Error(`Habit not found: ${habitId}`);
  const h = habit as Habit;

  // Import addMealLog lazily to avoid circular dependency
  const { addMealLog } = await import('./meal-logs');

  for (const item of h.items) {
    await addMealLog({
      meal_date: targetDate,
      meal_type: h.meal_type,
      food_id: item.food_id,
      grams: item.grams,
    });
  }

  // Mark habit as recently used
  await db
    .from('habits')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', habitId);
}

// ── Label builder ──────────────────────────────────────────────

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
};

function buildHabitLabel(mealType: MealType, items: HabitItem[]): string {
  const foodNames = items.slice(0, 2).map((i) => i.food_name).join(' + ');
  const suffix = items.length > 2 ? ` y ${items.length - 2} más` : '';
  return `${MEAL_LABELS[mealType]}: ${foodNames}${suffix}`;
}
