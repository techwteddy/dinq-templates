"use client";

import { useState } from "react";
import { subscribeToPush } from "@/app/actions";

export default function PushSubscribeButton({ members }: { members: string[] }) {
  const [status, setStatus] = useState<"idle" | "picking" | "subscribing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe(memberName: string) {
    setStatus("subscribing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setErrorMsg("Notification permission denied");
        setStatus("error");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

      // Convert VAPID key to Uint8Array
      const padding = "=".repeat((4 - (vapidPublicKey.length % 4)) % 4);
      const base64 = (vapidPublicKey + padding).replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(base64);
      const array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) array[i] = raw.charCodeAt(i);

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: array,
      });

      const json = subscription.toJSON();
      const fd = new FormData();
      fd.set("member_name", memberName);
      fd.set("endpoint", json.endpoint!);
      fd.set("p256dh", json.keys!.p256dh!);
      fd.set("auth", json.keys!.auth!);
      await subscribeToPush(fd);

      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to subscribe");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-sage font-medium">
        Notifications enabled!
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-sm text-rose font-medium">
        {errorMsg}
      </p>
    );
  }

  if (status === "subscribing") {
    return <p className="text-sm text-muted">Subscribing...</p>;
  }

  if (status === "picking") {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-sm text-muted">Who are you?</span>
        {members.map((member) => (
          <button
            key={member}
            onClick={() => handleSubscribe(member)}
            className="px-3 py-1.5 text-xs rounded-xl bg-lavender text-white font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            {member}
          </button>
        ))}
        <button
          onClick={() => setStatus("idle")}
          className="px-3 py-1.5 text-xs rounded-xl border-2 border-card-border hover:bg-lavender/10 transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setStatus("picking")}
      className="px-4 py-2 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
    >
      Enable Notifications
    </button>
  );
}
