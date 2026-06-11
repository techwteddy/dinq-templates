import { createClient, SupabaseClient } from "@supabase/supabase-js";
import webpush from "web-push";

// Query parents dynamically from the family_members table
async function getParentNames(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase
    .from("family_members")
    .select("name")
    .eq("role", "parent");
  return data?.map((m) => m.name) ?? [];
}

// Query all member names dynamically
async function getAllMemberNames(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase
    .from("family_members")
    .select("name");
  return data?.map((m) => m.name) ?? [];
}

let vapidInitialized = false;

export function initVapid() {
  if (vapidInitialized) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  vapidInitialized = true;
}

export function getServiceClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function sendPushToSubscriptions(
  subs: { id: number; endpoint: string; p256dh: string; auth: string; member_name: string }[],
  payload: string,
  supabase: SupabaseClient
): Promise<{ sent: number; errors: string[] }> {
  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      ).then(() => ({ sub, ok: true as const }))
       .catch((err) => ({ sub, ok: false as const, err }))
    )
  );

  let sent = 0;
  const errors: string[] = [];
  const expiredIds: number[] = [];

  for (const result of results) {
    const val = result.status === "fulfilled" ? result.value : result.reason;
    if (val.ok) {
      sent++;
    } else {
      const message = val.err instanceof Error ? val.err.message : String(val.err);
      errors.push(`${val.sub.member_name}: ${message}`);
      const statusCode = (val.err as { statusCode?: number })?.statusCode;
      if (statusCode === 410 || message.includes("expired")) {
        expiredIds.push(val.sub.id);
      }
    }
  }

  // Batch-delete expired subscriptions
  if (expiredIds.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", expiredIds);
  }

  return { sent, errors };
}

async function sendToMembers(memberNames: string[], payload: string) {
  initVapid();
  const supabase = getServiceClient();

  const { data: subs, error: queryError } = await supabase
    .from("push_subscriptions")
    .select("*")
    .in("member_name", memberNames);

  if (queryError) {
    console.error("[push] query error:", queryError.message);
    return;
  }

  if (!subs || subs.length === 0) {
    console.log("[push] no subscriptions found for:", memberNames);
    return;
  }

  console.log(`[push] sending to ${subs.length} subscription(s)`);
  await sendPushToSubscriptions(subs, payload, supabase);
}

export async function notifyParents(childName: string, choreName: string) {
  try {
    const supabase = getServiceClient();
    const parents = await getParentNames(supabase);
    const payload = JSON.stringify({
      title: `${childName} completed a chore!`,
      body: choreName,
      tag: `completed-${childName}-${Date.now()}`,
      url: "/chores",
    });
    await sendToMembers(parents, payload);
  } catch (err) {
    console.error("[push] notifyParents error:", err);
  }
}

export async function notifyFamilyExcept(excludeName: string, title: string, body: string, url: string) {
  try {
    const supabase = getServiceClient();
    const allMembers = await getAllMemberNames(supabase);
    const recipients = allMembers.filter((m) => m !== excludeName);
    const payload = JSON.stringify({
      title,
      body,
      tag: `board-${Date.now()}`,
      url,
    });
    await sendToMembers(recipients, payload);
  } catch (err) {
    console.error("[push] notifyFamilyExcept error:", err);
  }
}

export async function notifyParentsExcept(excludeName: string, title: string, body: string, url: string) {
  try {
    const supabase = getServiceClient();
    const parents = await getParentNames(supabase);
    const recipients = parents.filter((m) => m !== excludeName);
    const payload = JSON.stringify({
      title,
      body,
      tag: `parents-${Date.now()}`,
      url,
    });
    await sendToMembers(recipients, payload);
  } catch (err) {
    console.error("[push] notifyParentsExcept error:", err);
  }
}

export async function notifyEventInvite(
  invitees: string[],
  excludeName: string,
  eventTitle: string,
  eventDate: string
) {
  try {
    const recipients = invitees.filter((m) => m !== excludeName);
    if (recipients.length === 0) return;
    const payload = JSON.stringify({
      title: `Event invite: ${eventTitle}`,
      body: `${excludeName} invited you — ${eventDate}`,
      tag: `event-invite-${Date.now()}`,
      url: "/calendar",
    });
    await sendToMembers(recipients, payload);
  } catch (err) {
    console.error("[push] notifyEventInvite error:", err);
  }
}

export async function notifyParents_mealRequest(memberName: string, meal: string, day: string) {
  try {
    const supabase = getServiceClient();
    const parents = await getParentNames(supabase);
    const payload = JSON.stringify({
      title: `Meal request from ${memberName}`,
      body: `${memberName} wants to eat ${meal} on ${day}`,
      tag: `meal-${memberName}-${Date.now()}`,
      url: "/supermarket",
    });
    await sendToMembers(parents, payload);
  } catch (err) {
    console.error("[push] notifyParents_mealRequest error:", err);
  }
}
