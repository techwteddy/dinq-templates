import { NextResponse } from "next/server";
import { initVapid, getServiceClient, sendPushToSubscriptions } from "@/lib/notify-parents";
import { verifyCronSecret } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = verifyCronSecret(request);
  if (authError) return authError;

  initVapid();
  const supabase = getServiceClient();

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().slice(0, 10);

  // Get kids and parents from DB
  const { data: members } = await supabase
    .from("family_members")
    .select("name, role");

  const kids = (members ?? []).filter((m) => m.role === "kid").map((m) => m.name);
  const parents = (members ?? []).filter((m) => m.role === "parent").map((m) => m.name);

  // Fetch upcoming data for next 7 days
  const [{ data: tests }, { data: schedule }, { data: events }] = await Promise.all([
    supabase
      .from("school_tests")
      .select("kid_name, subject, test_date")
      .gte("test_date", todayStr)
      .lte("test_date", nextWeekStr),
    supabase.from("chore_schedule").select("kid_name"),
    supabase
      .from("events")
      .select("id")
      .gte("start_date", todayStr)
      .lte("start_date", nextWeekStr),
  ]);

  let totalSent = 0;
  const allErrors: string[] = [];

  // Fetch all subscriptions for kids and parents in one query
  const allMemberNames = [...kids, ...parents];
  const { data: allSubs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth, member_name")
    .in("member_name", allMemberNames);

  // Build per-kid summaries
  for (const kid of kids) {
    const kidTests = (tests ?? []).filter((t) => t.kid_name === kid);
    const kidChoreCount = (schedule ?? []).filter((s) => s.kid_name === kid).length;

    const lines: string[] = [];
    if (kidTests.length > 0) {
      lines.push(`Tests: ${kidTests.map((t) => `${t.subject} (${t.test_date})`).join(", ")}`);
    }
    if (kidChoreCount > 0) {
      lines.push(`${kidChoreCount} chores scheduled this week`);
    }

    if (lines.length === 0) continue;

    const subs = (allSubs ?? []).filter((s) => s.member_name === kid);
    if (subs.length > 0) {
      const payload = JSON.stringify({
        title: "Weekly summary",
        body: lines.join("\n"),
        tag: `weekly-${kid}`,
        url: "/",
      });
      const { sent, errors } = await sendPushToSubscriptions(subs, payload, supabase);
      totalSent += sent;
      allErrors.push(...errors);
    }
  }

  // Build parent summary (full family)
  const eventCount = (events ?? []).length;
  const testCount = (tests ?? []).length;
  const parentLines: string[] = [];

  if (eventCount > 0) {
    parentLines.push(`${eventCount} event${eventCount > 1 ? "s" : ""} this week`);
  }
  if (testCount > 0) {
    const testDetails = (tests ?? []).map(
      (t) => `${t.kid_name}: ${t.subject} (${t.test_date})`
    );
    parentLines.push(`Tests: ${testDetails.join(", ")}`);
  }

  for (const kid of kids) {
    const choreCount = (schedule ?? []).filter((s) => s.kid_name === kid).length;
    if (choreCount > 0) {
      parentLines.push(`${kid}: ${choreCount} chores/week`);
    }
  }

  if (parentLines.length > 0) {
    const parentSubs = (allSubs ?? []).filter((s) => parents.includes(s.member_name));

    if (parentSubs.length > 0) {
      const payload = JSON.stringify({
        title: "Family weekly summary",
        body: parentLines.join("\n"),
        tag: "weekly-parents",
        url: "/",
      });
      const { sent, errors } = await sendPushToSubscriptions(parentSubs, payload, supabase);
      totalSent += sent;
      allErrors.push(...errors);
    }
  }

  return NextResponse.json({
    message: "Weekly summary sent",
    sent: totalSent,
    errors: allErrors.length > 0 ? allErrors : undefined,
  });
}
