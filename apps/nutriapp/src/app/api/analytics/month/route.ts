import { NextRequest, NextResponse } from "next/server";
import { parseISO, startOfMonth, endOfMonth } from "date-fns";
import { buildMonthAnalytics } from "@/lib/analytics";
import { getDaySummariesRange } from "@/db/queries/day-summary";
import { getSupabase } from "@/lib/supabase/server";
import { getTargetCalories } from "@/lib/profile-targets";

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const reference = parseISO(dateParam);
  const from = startOfMonth(reference).toISOString().slice(0, 10);
  const to = endOfMonth(reference).toISOString().slice(0, 10);
  const db = getSupabase();
  const [{ data: weights }, summaries, goal] = await Promise.all([
    db.from("weight_logs").select("logged_at,weight_kg").gte("logged_at", from).lte("logged_at", to).order("logged_at"),
    getDaySummariesRange(from, to),
    getTargetCalories(),
  ]);
  return NextResponse.json(buildMonthAnalytics(reference, summaries, weights ?? [], goal));
}
