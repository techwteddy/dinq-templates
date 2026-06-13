/**
 * src/app/api/analytics/week/route.ts
 * GET ?date=YYYY-MM-DD  →  WeekAnalytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { buildWeekAnalytics } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dateParam = req.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const ref = parseISO(dateParam);
  const weekStart = startOfWeek(ref, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(ref,   { weekStartsOn: 1 });

  // Traer summaries + perfil (para goal_kcal)
  const [{ data: summaries }, { data: profile }] = await Promise.all([
    supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('summary_date', weekStart.toISOString().slice(0, 10))
      .lte('summary_date', weekEnd.toISOString().slice(0, 10)),
    supabase
      .from('profiles')
      .select('goal_kcal')
      .eq('user_id', session.user.id)
      .single(),
  ]);

  const goal_kcal = profile?.goal_kcal ?? 2000;
  const analytics = buildWeekAnalytics(ref, summaries ?? [], goal_kcal);

  return NextResponse.json(analytics);
}
