// src/app/api/meal-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addMealLog, getMealLogsByDate } from '@/db/queries/meal-logs';
import { computeAndSaveDaySummary } from '@/db/queries/day-summary';
import { detectAndSaveHabits } from '@/db/queries/frequent-meals';
import type { MealLogInsert } from '@/types/nutrition';

// GET /api/meal-logs?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 });
  }

  try {
    const logs = await getMealLogsByDate(date);
    return NextResponse.json({ logs, date });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/meal-logs
export async function POST(req: NextRequest) {
  let body: MealLogInsert;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { meal_date, meal_type, grams } = body;
  if (!meal_date || !meal_type || !grams) {
    return NextResponse.json(
      { error: 'meal_date, meal_type and grams are required' },
      { status: 400 }
    );
  }

  if (!body.food_id && !body.recipe_id) {
    return NextResponse.json(
      { error: 'Either food_id or recipe_id is required' },
      { status: 400 }
    );
  }

  try {
    const log = await addMealLog(body);

    // Recompute day summary asynchronously (don't block response)
    computeAndSaveDaySummary(meal_date).catch(console.error);
    // Re-detect habits in background
    detectAndSaveHabits().catch(console.error);

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
