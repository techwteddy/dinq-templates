"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/utils";
import type {
  UserProfile,
  UserSettings,
  ActivityLevel,
  Goal,
  Sex,
} from "@/db/types";
import {
  PROFILE_CONSTRAINTS,
  lbToKg,
  inToCm,
  kgToLb,
  cmToIn,
} from "@/db/types";
import {
  ACTIVITY_LABELS,
  ACTIVITY_DESCRIPTIONS,
  computeTargets,
} from "@/lib/nutrition";
import { upsertProfile } from "@/db/queries/profile";

// ─── Options ──────────────────────────────────────────────────────────────────

const SEX_OPTIONS: Array<{ value: Sex; label: string }> = [
  { value: "male", label: "Hombre" },
  { value: "female", label: "Mujer" },
];

const GOAL_OPTIONS: Array<{ value: Goal; label: string; description?: string }> = [
  { value: "cut", label: "Bajar de peso", description: "Déficit calórico" },
  { value: "maintain", label: "Mantener peso", description: "Balance calórico" },
  { value: "bulk", label: "Ganar masa", description: "Superávit calórico" },
];

const ACTIVITY_OPTIONS = (
  Object.entries(ACTIVITY_LABELS) as Array<[ActivityLevel, string]>
).map(([value, label]) => ({
  value,
  label,
  description: ACTIVITY_DESCRIPTIONS[value],
}));

// ─── Tipos de formulario ──────────────────────────────────────────────────────

interface FormData {
  age: string;
  sex: Sex;
  weightDisplay: string; // en la unidad del usuario
  heightDisplay: string; // en la unidad del usuario
  activityLevel: ActivityLevel;
  goal: Goal;
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isDiabetic: boolean;
  hasKidneyDisease: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Validación ───────────────────────────────────────────────────────────────

function validate(data: FormData, weightUnit: "kg" | "lb", heightUnit: "cm" | "in"): FormErrors {
  const errors: FormErrors = {};
  const age = parseInt(data.age, 10);
  if (isNaN(age) || age < PROFILE_CONSTRAINTS.AGE.min || age > PROFILE_CONSTRAINTS.AGE.max) {
    errors.age = `Edad entre ${PROFILE_CONSTRAINTS.AGE.min} y ${PROFILE_CONSTRAINTS.AGE.max} años`;
  }

  const weightDisplay = parseFloat(data.weightDisplay);
  if (isNaN(weightDisplay) || weightDisplay <= 0) {
    errors.weightDisplay = "Introduce un peso válido";
  } else {
    const weightKg = weightUnit === "lb" ? lbToKg(weightDisplay) : weightDisplay;
    if (weightKg < PROFILE_CONSTRAINTS.WEIGHT_KG.min || weightKg > PROFILE_CONSTRAINTS.WEIGHT_KG.max) {
      errors.weightDisplay = `Peso entre ${PROFILE_CONSTRAINTS.WEIGHT_KG.min}–${PROFILE_CONSTRAINTS.WEIGHT_KG.max} kg`;
    }
  }

  const heightDisplay = parseFloat(data.heightDisplay);
  if (isNaN(heightDisplay) || heightDisplay <= 0) {
    errors.heightDisplay = "Introduce una talla válida";
  } else {
    const heightCm = heightUnit === "in" ? inToCm(heightDisplay) : heightDisplay;
    if (heightCm < PROFILE_CONSTRAINTS.HEIGHT_CM.min || heightCm > PROFILE_CONSTRAINTS.HEIGHT_CM.max) {
      errors.heightDisplay = `Talla entre ${PROFILE_CONSTRAINTS.HEIGHT_CM.min}–${PROFILE_CONSTRAINTS.HEIGHT_CM.max} cm`;
    }
  }

  return errors;
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface ProfileFormProps {
  initialProfile?: UserProfile | null;
  settings: UserSettings;
  onSaved?: (profile: UserProfile) => void;
}

export function ProfileForm({ initialProfile, settings, onSaved }: ProfileFormProps) {
  const weightUnit = settings.weightUnit;
  const heightUnit = settings.heightUnit;

  const [form, setForm] = useState<FormData>({
    age: initialProfile?.age.toString() ?? "",
    sex: initialProfile?.sex ?? "male",
    weightDisplay: initialProfile
      ? weightUnit === "lb"
        ? kgToLb(initialProfile.weightKg).toString()
        : initialProfile.weightKg.toString()
      : "",
    heightDisplay: initialProfile
      ? heightUnit === "in"
        ? cmToIn(initialProfile.heightCm).toString()
        : initialProfile.heightCm.toString()
      : "",
    activityLevel: initialProfile?.activityLevel ?? "moderate",
    goal: initialProfile?.goal ?? "maintain",
    isPregnant: initialProfile?.healthFlags.isPregnant ?? false,
    isBreastfeeding: initialProfile?.healthFlags.isBreastfeeding ?? false,
    isDiabetic: initialProfile?.healthFlags.isDiabetic ?? false,
    hasKidneyDisease: initialProfile?.healthFlags.hasKidneyDisease ?? false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const handleSubmit = async () => {
    const validationErrors = validate(form, weightUnit, heightUnit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSaveError(null);
    try {
      const weightKg = weightUnit === "lb"
        ? lbToKg(parseFloat(form.weightDisplay))
        : parseFloat(form.weightDisplay);

      const heightCm = heightUnit === "in"
        ? inToCm(parseFloat(form.heightDisplay))
        : parseFloat(form.heightDisplay);

      const profileData: Omit<UserProfile, "id"> = {
        age: parseInt(form.age, 10),
        sex: form.sex,
        weightKg,
        heightCm,
        activityLevel: form.activityLevel,
        goal: form.goal,
        healthFlags: {
          isPregnant: form.isPregnant,
          isBreastfeeding: form.isBreastfeeding,
          isDiabetic: form.isDiabetic,
          hasKidneyDisease: form.hasKidneyDisease,
        },
      };

      const saved = await upsertProfile(profileData);
      setSavedProfile(saved);
      onSaved?.(saved);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar el perfil";
      setSaveError(message);
      console.error("[onboarding] save failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Preview de targets (sin guardar)
  const previewProfile: UserProfile | null = (() => {
    const w = parseFloat(form.weightDisplay);
    const h = parseFloat(form.heightDisplay);
    const a = parseInt(form.age, 10);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return null;
    return {
      id: "preview",
      age: a,
      sex: form.sex,
      weightKg: weightUnit === "lb" ? lbToKg(w) : w,
      heightCm: heightUnit === "in" ? inToCm(h) : h,
      activityLevel: form.activityLevel,
      goal: form.goal,
      healthFlags: {
        isPregnant: form.isPregnant,
        isBreastfeeding: form.isBreastfeeding,
        isDiabetic: form.isDiabetic,
        hasKidneyDisease: form.hasKidneyDisease,
      },
    };
  })();

  const preview = previewProfile ? computeTargets(previewProfile, settings) : null;

  return (
    <div className="space-y-6">
      {/* ── Bloque 1: datos biométricos ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
          Datos biométricos
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Edad"
            type="number"
            inputMode="numeric"
            min={PROFILE_CONSTRAINTS.AGE.min}
            max={PROFILE_CONSTRAINTS.AGE.max}
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
            error={errors.age}
            suffix="años"
          />

          <Select
            label="Sexo"
            value={form.sex}
            onChange={(e) => set("sex", e.target.value as Sex)}
            options={SEX_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Peso"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={form.weightDisplay}
            onChange={(e) => set("weightDisplay", e.target.value)}
            error={errors.weightDisplay}
            suffix={weightUnit}
          />

          <Input
            label={`Talla (${heightUnit})`}
            type="number"
            inputMode="decimal"
            step={heightUnit === "cm" ? "1" : "0.1"}
            value={form.heightDisplay}
            onChange={(e) => set("heightDisplay", e.target.value)}
            error={errors.heightDisplay}
            suffix={heightUnit}
          />
        </div>
      </section>

      {/* ── Bloque 2: actividad y objetivo ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
          Actividad y objetivo
        </h2>

        <Select
          label="Nivel de actividad"
          value={form.activityLevel}
          onChange={(e) => set("activityLevel", e.target.value as ActivityLevel)}
          options={ACTIVITY_OPTIONS}
          hint={ACTIVITY_DESCRIPTIONS[form.activityLevel]}
        />

        <div className="grid grid-cols-3 gap-2">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("goal", opt.value)}
              className={cx(
                "flex flex-col items-center gap-1 p-3 rounded-card border text-center transition-all duration-150",
                form.goal === opt.value
                  ? "border-accent bg-accent-muted text-accent shadow-accent-glow"
                  : "border-surface-border bg-surface-overlay text-ink-secondary hover:border-accent/40"
              )}
            >
              <span className="text-lg">
                {opt.value === "cut" ? "↓" : opt.value === "maintain" ? "→" : "↑"}
              </span>
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className="text-[10px] text-ink-muted">{opt.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Bloque 3: flags de salud ── */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
          Condiciones de salud
        </h2>
        <p className="text-xs text-ink-muted">
          Afectan el cálculo de requerimientos calóricos. Solo para referencia — no reemplaza consejo médico.
        </p>

        {[
          { key: "isPregnant" as const, label: "Embarazo", hidden: form.sex !== "female" },
          { key: "isBreastfeeding" as const, label: "Lactancia", hidden: form.sex !== "female" },
          { key: "isDiabetic" as const, label: "Diabetes" },
          { key: "hasKidneyDisease" as const, label: "Enfermedad renal" },
        ]
          .filter((f) => !f.hidden)
          .map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 rounded-card border border-surface-border hover:border-accent/30 cursor-pointer transition-all"
            >
              <div
                className={cx(
                  "w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0",
                  form[key]
                    ? "border-accent bg-accent"
                    : "border-surface-muted bg-transparent"
                )}
              >
                {form[key] && (
                  <svg className="w-3 h-3 text-surface-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={form[key] as boolean}
                onChange={(e) => set(key, e.target.checked)}
              />
              <span className="text-sm text-ink-primary">{label}</span>
            </label>
          ))}
      </section>

      {/* ── Preview en tiempo real ── */}
      {preview && (
        <Card glow>
          <p className="text-xs text-ink-muted mb-3 uppercase tracking-wide font-semibold">
            Estimación en tiempo real
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "BMR", value: `${preview.bmr} kcal` },
              { label: "TDEE", value: `${preview.tdee} kcal` },
              { label: "Meta calórica", value: `${preview.targetCalories} kcal` },
              {
                label: preview.deficit < 0 ? "Déficit" : "Superávit",
                value: `${Math.abs(preview.deficit)} kcal`,
                color: preview.deficit < 0 ? "text-macro-protein" : "text-macro-fat",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-[10px] text-ink-muted uppercase tracking-wide">{label}</p>
                <p className={cx("text-lg font-mono font-semibold", color ?? "text-accent")}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Barras de macros */}
          <div className="mt-4 space-y-2">
            {[
              { label: "Proteína", g: preview.macros.proteinG, kcal: preview.macros.proteinKcal, color: "bg-macro-protein" },
              { label: "Grasa", g: preview.macros.fatG, kcal: preview.macros.fatKcal, color: "bg-macro-fat" },
              { label: "Carbos", g: preview.macros.carbsG, kcal: preview.macros.carbsKcal, color: "bg-macro-carbs" },
            ].map(({ label, g, kcal, color }) => {
              const pct = Math.round((kcal / preview.targetCalories) * 100);
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-secondary">{label}</span>
                    <span className="text-ink-primary font-mono">{g}g · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={cx("h-full rounded-full transition-all duration-500", color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Submit ── */}
      <Button
        onClick={handleSubmit}
        loading={loading}
        fullWidth
        size="lg"
      >
        {savedProfile ? "✓ Guardado" : "Guardar perfil"}
      </Button>

      {savedProfile && (
        <p className="text-center text-xs text-ok animate-fade-up">
          Perfil guardado correctamente
        </p>
      )}

      {saveError && (
        <p className="text-center text-xs text-danger">
          {saveError}
        </p>
      )}
    </div>
  );
}
