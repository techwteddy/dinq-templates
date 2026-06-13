import "server-only";
import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:hello@trendly.app";

let configured = false;
function ensureVapid() {
  if (configured) return true;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
  image?: string;
  tag?: string;
};

/**
 * Send a notification to every subscription belonging to a user.
 * Silently no-ops if VAPID is not configured.
 */
export async function sendPushToUser(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
  payload: PushPayload,
) {
  if (!ensureVapid()) return { ok: false, reason: "vapid-missing" as const };
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);
  if (!subs?.length) return { ok: true, sent: 0 };
  const json = JSON.stringify(payload);
  const dead: string[] = [];
  await Promise.all(
    (subs as { endpoint: string; p256dh: string; auth: string }[]).map(async (s) => {
      const sub: WebPushSubscription = {
        endpoint: s.endpoint,
        keys: { p256dh: s.p256dh, auth: s.auth },
      };
      try {
        await webpush.sendNotification(sub, json);
      } catch (e: unknown) {
        const err = e as { statusCode?: number };
        // Subscription is gone — clean up so we don't keep retrying.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          dead.push(s.endpoint);
        }
      }
    }),
  );
  if (dead.length) {
    await supabase.from("push_subscriptions").delete().in("endpoint", dead);
  }
  return { ok: true, sent: subs.length - dead.length };
}
