"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { getSettings } from "@/db/queries/settings";
import { PushSettingsToggle } from "@/components/push/PushNotificationManager";
import type { UserSettings } from "@/db/types";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-dvh px-5 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-input bg-surface-raised border border-surface-border text-ink-secondary hover:text-ink-primary transition-colors"
          aria-label="Volver"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Configuración</h1>
          <p className="text-xs text-ink-muted">Unidades, macros y límites</p>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-card border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          Error cargando configuración: {error}
        </div>
      ) : settings ? (
        <div className="space-y-4">
          <SettingsForm initialSettings={settings} />
          <section className="rounded-card border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-3 text-sm font-semibold text-ink-primary">Notificaciones</h2>
            <PushSettingsToggle />
          </section>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
