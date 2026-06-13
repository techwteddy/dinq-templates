"use client";
/**
 * hooks/usePushNotifications.ts
 *
 * Hook para gestionar el ciclo completo de Web Push:
 * - Detectar soporte
 * - Solicitar permiso
 * - Suscribir / desuscribir al servidor
 * - Persistir estado
 */
import { useCallback, useEffect, useState } from "react";

type PermissionStatus = "default" | "granted" | "denied" | "unsupported";

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const bytes = Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function usePushNotifications() {
  const [status, setStatus]       = useState<PermissionStatus>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // ── Detectar soporte ────────────────────────────────────
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (supported) {
      setStatus(Notification.permission as PermissionStatus);
      // Verificar si ya hay una suscripción activa
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
          if (sub) setStatus("granted");
        });
      });
    }
  }, []);

  // ── Suscribir ───────────────────────────────────────────
  const subscribe = useCallback(async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as PermissionStatus);

      if (permission !== "granted") return;

      const keyRes = await fetch("/api/push/subscribe");
      if (!keyRes.ok) return;
      const { publicKey } = await keyRes.json();
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(publicKey),
      });

      setSubscription(sub);

      // Enviar al servidor
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
    } catch (err) {
      console.error("[push] Error al suscribir:", err);
    }
  }, [isSupported]);

  // ── Desuscribir ─────────────────────────────────────────
  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      setSubscription(null);
      setStatus("default");

      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
      });
    } catch (err) {
      console.error("[push] Error al desuscribir:", err);
    }
  }, [subscription]);

  return { status, isSupported, subscription, subscribe, unsubscribe };
}
