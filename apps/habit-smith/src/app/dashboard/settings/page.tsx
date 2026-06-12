"use client";

import { useEffect, useState } from "react";

import { services } from "@/services";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useSessionStore } from "@/stores/session-store";
import type { UserSubscription } from "@/types";

export default function SettingsPage() {
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";

  const { theme, notificationsEnabled, profilePublic, setTheme, toggleNotifications, toggleProfilePublic } = usePreferencesStore();

  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    if (!userId) return;

    void (async () => {
      const nextSubscription = await services.billing.getSubscription(userId);
      setSubscription(nextSubscription);
    })();
  }, [userId]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Settings</h1>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="mt-3 flex gap-2">
          <button className={`rounded-lg px-3 py-2 text-sm ${theme === "light" ? "bg-zinc-900 text-white" : "bg-zinc-100"}`} onClick={() => setTheme("light")}>
            Light
          </button>
          <button className={`rounded-lg px-3 py-2 text-sm ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-zinc-100"}`} onClick={() => setTheme("dark")}>
            Dark
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Privacy & Notifications</h2>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2">
            <span>Public profile visibility</span>
            <input type="checkbox" checked={profilePublic} onChange={() => toggleProfilePublic()} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2">
            <span>Notification preferences</span>
            <input type="checkbox" checked={notificationsEnabled} onChange={() => toggleNotifications()} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Plan: <span className="font-semibold uppercase">{subscription?.tier ?? "free"}</span> · Status: {subscription?.status ?? "active"}
        </p>
        <button className="mt-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm" onClick={() => void services.billing.cancelSubscription(userId)}>
          Cancel Subscription
        </button>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-2 text-sm text-red-600">Delete account and all associated habit history.</p>
        <button className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete Account</button>
      </section>
    </div>
  );
}
