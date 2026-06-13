// src/app/api/day-summary/[date]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDaySummary, computeAndSaveDaySummary } from '@/db/queries/day-summary';

// GET /api/day-summary/YYYY-MM-DD
export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  const { date } = params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  try {
    // Try cached summary first; compute on miss
    let summary = await getDaySummary(date);
    if (!summary) summary = await computeAndSaveDaySummary(date);
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/day-summary/YYYY-MM-DD — force recompute
export async function POST(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  const { date } = params;
  try {
    const summary = await computeAndSaveDaySummary(date);
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
