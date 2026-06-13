// src/app/api/habits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listHabits, detectAndSaveHabits } from '@/db/queries/frequent-meals';
import type { MealType } from '@/types/nutrition';

// GET /api/habits?meal_type=breakfast
export async function GET(req: NextRequest) {
  const mealType = req.nextUrl.searchParams.get('meal_type') as MealType | null;
  try {
    const habits = await listHabits(mealType ?? undefined);
    return NextResponse.json({ habits });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/habits — trigger habit detection
export async function POST() {
  try {
    const habits = await detectAndSaveHabits();
    return NextResponse.json({ habits, detected: habits.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
