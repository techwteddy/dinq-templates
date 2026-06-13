"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { getSettings } from "@/db/queries/settings";
import type { UserSettings } from "@/db/types";
import { DEFAULT_SETTINGS } from "@/db/queries/settings";
import { SETTINGS_ID } from "@/db/queries/settings";

export default function OnboardingPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() =>
        setSettings({ id: SETTINGS_ID, ...DEFAULT_SETTINGS })
      );
  }, []);

  const handleSaved = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-dvh px-5 py-8">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center text-sm">
            ◎
          </div>
          <span className="text-xs text-ink-muted tracking-widest uppercase font-semibold">
            NutriApp
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-primary mt-4">
          Configura tu perfil
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Estos datos alimentan el motor nutricional. Se guardan localmente en tu base de datos.
        </p>
      </div>

      {/* Pasos visuales */}
      <div
        className="flex gap-1.5 mb-8 opacity-0 animate-fade-up-delay-1"
        style={{ animationFillMode: "forwards" }}
      >
        {["Biométricos", "Actividad", "Salud"].map((step, i) => (
          <div key={step} className="flex-1 space-y-1">
            <div className={`h-0.5 rounded-full ${i === 0 ? "bg-accent" : "bg-surface-muted"}`} />
            <p className="text-[10px] text-ink-muted">{step}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div
        className="opacity-0 animate-fade-up-delay-2"
        style={{ animationFillMode: "forwards" }}
      >
        {settings ? (
          <ProfileForm
            settings={settings}
            onSaved={handleSaved}
          />
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
