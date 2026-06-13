"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlB64ToUint8Array(b64: string) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

export function NotificationsButton() {
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission);
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => {});
  }, []);

  const enable = async () => {
    if (perm === "unsupported") return;
    if (!VAPID_PUBLIC_KEY) {
      alert("Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your env to enable push notifications.");
      return;
    }
    setBusy(true);
    try {
      const reg =
        (await navigator.serviceWorker.getRegistration()) ??
        (await navigator.serviceWorker.register("/sw.js"));
      const permission = await Notification.requestPermission();
      setPerm(permission);
      if (permission !== "granted") return;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setSubscribed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  };

  if (perm === "unsupported") return null;

  return (
    <button
      type="button"
      onClick={subscribed ? disable : enable}
      disabled={busy}
      className="w-full px-4 py-3 flex items-center gap-4 text-base hover:bg-white/5 disabled:opacity-50"
      aria-label={subscribed ? "Turn off push notifications" : "Turn on push notifications"}
    >
      {subscribed ? <Bell size={22} /> : <BellOff size={22} />}
      <span>{subscribed ? "Notifications on" : "Turn on notifications"}</span>
    </button>
  );
}
