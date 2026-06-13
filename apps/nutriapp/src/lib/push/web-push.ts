import webpush from "web-push";

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return null;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return { publicKey };
}

export function getVapidPublicKey() {
  return configureWebPush()?.publicKey ?? null;
}

export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: PushPayload
): Promise<{ ok: boolean; error?: string; status?: number }> {
  if (!configureWebPush()) {
    return { ok: false, error: "VAPID no configurado", status: 501 };
  }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      urgency: "normal",
      TTL: 60 * 60 * 24,
    });
    return { ok: true };
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    return { ok: false, error: err.message ?? "Error desconocido", status: err.statusCode };
  }
}
