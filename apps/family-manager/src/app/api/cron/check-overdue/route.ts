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
  const today = now.getDay(); // 0=Sun
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Find overdue entries for today that haven't been completed today
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const { data: entries } = await supabase
    .from("chore_schedule")
    .select("kid_name, chore_name, time_of_day, last_completed")
    .eq("day_of_week", today)
    .or(`last_completed.is.null,last_completed.lt.${todayStart.toISOString()}`);

  if (!entries || entries.length === 0) {
    return NextResponse.json({ message: "No overdue chores", sent: 0 });
  }

  // Filter by time_of_day (only nag if past the scheduled time)
  const overdueEntries = entries.filter((e) => {
    if (!e.time_of_day) return true; // No time set = always nag
    return e.time_of_day <= currentTime;
  });

  if (overdueEntries.length === 0) {
    return NextResponse.json({ message: "No overdue chores yet", sent: 0 });
  }

  // Group by kid (chore_schedule uses kid_name column)
  const byMember: Record<string, string[]> = {};
  for (const entry of overdueEntries) {
    const name = entry.kid_name;
    if (!byMember[name]) byMember[name] = [];
    byMember[name].push(entry.chore_name);
  }

  // Get parent names from family_members table
  const { data: parents } = await supabase
    .from("family_members")
    .select("name")
    .eq("role", "parent");
  const parentNames = (parents ?? []).map((p) => p.name);

  // Get all kid subscriptions in one query
  const kidNames = Object.keys(byMember);
  const { data: allSubs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth, member_name")
    .in("member_name", kidNames);

  let totalSent = 0;
  const allErrors: string[] = [];

  for (const [memberName, chores] of Object.entries(byMember)) {
    const subs = (allSubs ?? []).filter((s) => s.member_name === memberName);
    if (subs.length === 0) continue;

    const payload = JSON.stringify({
      title: `Hey ${memberName}!`,
      body:
        chores.length === 1
          ? `Time to: ${chores[0]}`
          : `You have ${chores.length} chores: ${chores.join(", ")}`,
      tag: `chore-${memberName}-${today}`,
      url: "/chores",
    });

    const { sent, errors } = await sendPushToSubscriptions(subs, payload, supabase);
    totalSent += sent;
    allErrors.push(...errors);
  }

  // Notify parents about kids' overdue chores
  const kidSummaries = Object.entries(byMember)
    .map(([kid, chores]) => `${kid}: ${chores.join(", ")}`)
    .join("\n");

  if (kidSummaries && parentNames.length > 0) {
    const { data: parentSubs } = await supabase
      .from("push_subscriptions")
      .select("*")
      .in("member_name", parentNames);

    if (parentSubs && parentSubs.length > 0) {
      const parentPayload = JSON.stringify({
        title: "Kids' chores not done yet",
        body: kidSummaries,
        tag: `parent-chore-summary-${today}`,
        url: "/chores",
      });

      const { sent, errors } = await sendPushToSubscriptions(parentSubs, parentPayload, supabase);
      totalSent += sent;
      allErrors.push(...errors);
    }
  }

  return NextResponse.json({
    message: "Done",
    sent: totalSent,
    overdueCount: overdueEntries.length,
    errors: allErrors.length > 0 ? allErrors : undefined,
  });
}
