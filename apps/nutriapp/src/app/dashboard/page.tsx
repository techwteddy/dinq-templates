"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cx, fmtWeight, fmtHeight } from "@/lib/utils";
import { computeTargets, ACTIVITY_LABELS } from "@/lib/nutrition";
import { getProfile } from "@/db/queries/profile";
import { getSettings } from "@/db/queries/settings";
import type { UserProfile, UserSettings, NutritionTargets } from "@/db/types";

const GOAL_LABELS = {
  cut: "↓ Déficit",
  maintain: "→ Mantenimiento",
  bulk: "↑ Superávit",
};

const MACRO_CONFIG = [
  { key: "protein" as const, label: "Proteína", color: "bg-macro-protein", text: "text-macro-protein" },
  { key: "fat" as const, label: "Grasa", color: "bg-macro-fat", text: "text-macro-fat" },
  { key: "carbs" as const, label: "Carbos", color: "bg-macro-carbs", text: "text-macro-carbs" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getSettings()])
      .then(([p, s]) => {
        if (!p) {
          router.push("/onboarding");
          return;
        }
        setProfile(p);
        setSettings(s);
        setTargets(computeTargets(p, s));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile || !settings || !targets) return null;

  return (
    <div className="min-h-dvh px-5 py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="text-xs text-ink-muted uppercase tracking-widest mb-1">Hoy</div>
          <h1 className="text-xl font-semibold">Tu plan nutricional</h1>
        </div>
        <button
          onClick={() => router.push("/settings")}
          className="w-9 h-9 flex items-center justify-center rounded-input bg-surface-raised border border-surface-border text-ink-secondary hover:text-accent transition-colors text-sm"
          aria-label="Configuración"
        >
          ⚙
        </button>
      </div>

      {/* Meta calórica principal */}
      <Card
        glow
        className="opacity-0 animate-fade-up-delay-1 text-center py-6"
        style={{ animationFillMode: "forwards" } as React.CSSProperties}
      >
        <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-2">
          Meta calórica · {GOAL_LABELS[profile.goal]}
        </p>
        <p className="text-5xl font-mono font-semibold text-accent tabular-nums">
          {targets.targetCalories.toLocaleString("es-PE")}
        </p>
        <p className="text-sm text-ink-secondary mt-1">kcal / día</p>

        <div className="flex justify-center gap-6 mt-5">
          <div className="text-center">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide">BMR</p>
            <p className="text-sm font-mono text-ink-primary">{targets.bmr}</p>
          </div>
          <div className="w-px bg-surface-border" />
          <div className="text-center">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide">TDEE</p>
            <p className="text-sm font-mono text-ink-primary">{targets.tdee}</p>
          </div>
          <div className="w-px bg-surface-border" />
          <div className="text-center">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide">
              {targets.deficit < 0 ? "Déficit" : "Superávit"}
            </p>
            <p className={cx(
              "text-sm font-mono",
              targets.deficit < 0 ? "text-macro-protein" : "text-macro-fat"
            )}>
              {Math.abs(targets.deficit)}
            </p>
          </div>
        </div>
      </Card>

      {/* Macros */}
      <Card
        className="opacity-0 animate-fade-up-delay-2"
        style={{ animationFillMode: "forwards" } as React.CSSProperties}
      >
        <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-4">
          Distribución de macros
        </p>

        {/* Barra apilada */}
        <div className="h-2 rounded-full overflow-hidden flex mb-4">
          {MACRO_CONFIG.map(({ key, color }) => {
            const kcal = targets.macros[`${key}Kcal` as "proteinKcal" | "fatKcal" | "carbsKcal"];
            const pct = (kcal / targets.targetCalories) * 100;
            return (
              <div
                key={key}
                className={cx("h-full transition-all", color)}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {MACRO_CONFIG.map(({ key, label, color, text }) => {
            const g = targets.macros[`${key}G` as "proteinG" | "fatG" | "carbsG"];
            const kcal = targets.macros[`${key}Kcal` as "proteinKcal" | "fatKcal" | "carbsKcal"];
            const pct = Math.round((kcal / targets.targetCalories) * 100);
            return (
              <div key={key} className="space-y-1">
                <div className={cx("w-2 h-2 rounded-full", color)} />
                <p className="text-[10px] text-ink-muted">{label}</p>
                <p className={cx("text-lg font-mono font-semibold", text)}>
                  {g}g
                </p>
                <p className="text-[10px] text-ink-muted">{pct}%</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Perfil resumen */}
      <Card
        className="opacity-0 animate-fade-up-delay-3"
        style={{ animationFillMode: "forwards" } as React.CSSProperties}
      >
        <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-3">Tu perfil</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Edad", value: `${profile.age} años` },
            { label: "Peso", value: fmtWeight(profile.weightKg, settings.weightUnit) },
            { label: "Talla", value: fmtHeight(profile.heightCm, settings.heightUnit) },
            { label: "Actividad", value: ACTIVITY_LABELS[profile.activityLevel] },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-ink-muted uppercase tracking-wide">{label}</p>
              <p className="text-ink-primary font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          onClick={() => router.push("/diary")}
        >
          Diario
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/recipes")}
        >
          Recetas
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        <Button
          variant="secondary"
          onClick={() => router.push("/onboarding")}
        >
          Editar perfil
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/settings")}
        >
          Configuración
        </Button>
      </div>

    </div>
  );
}
