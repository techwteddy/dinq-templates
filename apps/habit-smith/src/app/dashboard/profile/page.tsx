"use client";

import { useEffect, useState } from "react";

import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    void (async () => {
      const nextProfile = await services.profile.getProfile(userId);
      setProfile(nextProfile);
    })();
  }, [userId]);

  const updateField = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = async () => {
    if (!profile || !userId) return;

    setSaving(true);
    await services.profile.updateProfile(userId, profile);
    setSaving(false);
  };

  if (!profile) {
    return <div className="rounded-2xl border border-white/60 bg-white/90 p-6">Loading profile...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Profile</h1>
      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <div className="mb-4 h-20 w-20 rounded-full bg-zinc-200" />
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-zinc-600">
            Display Name
            <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" value={profile.displayName} onChange={(e) => updateField("displayName", e.target.value)} />
          </label>
          <label className="text-sm text-zinc-600">
            Username
            <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" value={profile.username} onChange={(e) => updateField("username", e.target.value)} />
          </label>
          <label className="text-sm text-zinc-600 md:col-span-2">
            Bio
            <textarea className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" rows={3} value={profile.bio} onChange={(e) => updateField("bio", e.target.value)} />
          </label>
          <label className="text-sm text-zinc-600">
            Timezone
            <input className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" value={profile.timezone} onChange={(e) => updateField("timezone", e.target.value)} />
          </label>
        </div>
        <button className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => void save()}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </section>
    </div>
  );
}
