/**
 * lib/push/web-push.ts
 *
 * Utilidades servidor para Web Push.
 * Dependencia: npm install web-push
 * Tipos: npm install -D @types/web-push
 */
import webpush from "web-push";

// ── Validar variables de entorno ────────────────────────────
const publicKey  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject    = process.env.VAPID_SUBJECT; // "mailto:you@example.com"

if (!publicKey || !privateKey || !subject) {
  throw new Error(
    "Faltan variables de entorno VAPID. " +
    "Ejecuta: node scripts/generate-vapid-keys.mjs"
  );
}

webpush.setVapidDetails(subject, publicKey, privateKey);

// ── Tipos ───────────────────────────────────────────────────
export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  /** Tag para agrupar notificaciones del mismo tipo */
  tag?: string;
}

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// ── Función principal ────────────────────────────────────────
/**
 * Envía una notificación push a una suscripción.
 * Retorna { ok: true } o { ok: false, error, status }.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: PushPayload
): Promise<{ ok: boolean; error?: string; status?: number }> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload),
      {
        urgency: "normal",
        TTL: 60 * 60 * 24, // 24 horas máximo en cola VAPID
      }
    );
    return { ok: true };
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return {
      ok: false,
      error: error.message ?? "Error desconocido",
      status: error.statusCode,
    };
  }
}

/** Convierte el objeto PushSubscription del navegador al formato de la BD */
export function subscriptionToRecord(
  sub: PushSubscription
): PushSubscriptionRecord {
  const json = sub.toJSON();
  return {
    endpoint: json.endpoint!,
    keys: {
      p256dh: json.keys?.p256dh ?? "",
      auth:   json.keys?.auth   ?? "",
    },
  };
}

/** Clave pública VAPID para el cliente */
export const VAPID_PUBLIC_KEY = publicKey;
