// src/app/api/habits/[id]/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { applyHabit } from '@/db/queries/frequent-meals';
import { computeAndSaveDaySummary } from '@/db/queries/day-summary';

// POST /api/habits/:id/apply  body: { date: "YYYY-MM-DD" }
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  const date: string = body?.date;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
  }

  try {
    await applyHabit(params.id, date);
    computeAndSaveDaySummary(date).catch(console.error);
    return NextResponse.json({ success: true, date });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
