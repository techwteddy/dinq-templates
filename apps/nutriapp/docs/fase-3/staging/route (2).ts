/**
 * src/app/api/analytics/month/route.ts
 * GET ?date=YYYY-MM-DD  →  MonthAnalytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { buildMonthAnalytics } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dateParam = req.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const ref  = parseISO(dateParam);
  const from = startOfMonth(ref).toISOString().slice(0, 10);
  const to   = endOfMonth(ref).toISOString().slice(0, 10);

  const [{ data: summaries }, { data: weightLogs }, { data: profile }] = await Promise.all([
    supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('summary_date', from)
      .lte('summary_date', to),
    supabase
      .from('weight_logs')
      .select('logged_at, weight_kg')
      .eq('user_id', session.user.id)
      .gte('logged_at', from)
      .lte('logged_at', to)
      .order('logged_at'),
    supabase
      .from('profiles')
      .select('goal_kcal')
      .eq('user_id', session.user.id)
      .single(),
  ]);

  const goal_kcal = profile?.goal_kcal ?? 2000;
  const analytics = buildMonthAnalytics(ref, summaries ?? [], weightLogs ?? [], goal_kcal);

  return NextResponse.json(analytics);
}
