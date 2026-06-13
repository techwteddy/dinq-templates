import { NextRequest, NextResponse } from "next/server";
import { parseISO, startOfWeek, endOfWeek } from "date-fns";
import { buildWeekAnalytics } from "@/lib/analytics";
import { getDaySummariesRange } from "@/db/queries/day-summary";
import { getTargetCalories } from "@/lib/profile-targets";

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const reference = parseISO(dateParam);
  const from = startOfWeek(reference, { weekStartsOn: 1 }).toISOString().slice(0, 10);
  const to = endOfWeek(reference, { weekStartsOn: 1 }).toISOString().slice(0, 10);
  const [summaries, goal] = await Promise.all([
    getDaySummariesRange(from, to),
    getTargetCalories(),
  ]);
  return NextResponse.json(buildWeekAnalytics(reference, summaries, goal));
}
