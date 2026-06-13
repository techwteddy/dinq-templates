"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { cx } from "@/lib/utils";
import type { UserSettings, WeightUnit, HeightUnit } from "@/db/types";
import { SETTINGS_CONSTRAINTS } from "@/db/types";
import { upsertSettings } from "@/db/queries/settings";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FormErrors = Partial<{
  protein: string;
  fat: string;
  carbs: string;
  maxDeficit: string;
  maxSurplus: string;
  minCalories: string;
}>;

// ─── Validación ───────────────────────────────────────────────────────────────

function validate(settings: Omit<UserSettings, "id">): FormErrors {
  const errors: FormErrors = {};
  const { macroPct, maxDeficitKcal, maxSurplusKcal, minCaloriesKcal } = settings;

  const total = macroPct.protein + macroPct.fat + macroPct.carbs;
  if (Math.abs(total - 100) > 1) {
    errors.carbs = `Los macros deben sumar 100% (actualmente ${total}%)`;
  }

  const C = SETTINGS_CONSTRAINTS;
  if (maxDeficitKcal < C.MAX_DEFICIT_KCAL.min || maxDeficitKcal > C.MAX_DEFICIT_KCAL.max) {
    errors.maxDeficit = `Entre ${C.MAX_DEFICIT_KCAL.min} y ${C.MAX_DEFICIT_KCAL.max} kcal`;
  }
  if (maxSurplusKcal < C.MAX_SURPLUS_KCAL.min || maxSurplusKcal > C.MAX_SURPLUS_KCAL.max) {
    errors.maxSurplus = `Entre ${C.MAX_SURPLUS_KCAL.min} y ${C.MAX_SURPLUS_KCAL.max} kcal`;
  }
  if (minCaloriesKcal < C.MIN_CALORIES_KCAL.min || minCaloriesKcal > C.MIN_CALORIES_KCAL.max) {
    errors.minCalories = `Entre ${C.MIN_CALORIES_KCAL.min} y ${C.MIN_CALORIES_KCAL.max} kcal`;
  }

  return errors;
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface SettingsFormProps {
  initialSettings: UserSettings;
  onSaved?: (settings: UserSettings) => void;
}

const MACRO_COLORS = {
  protein: { bar: "bg-macro-protein", text: "text-macro-protein" },
  fat: { bar: "bg-macro-fat", text: "text-macro-fat" },
  carbs: { bar: "bg-macro-carbs", text: "text-macro-carbs" },
};

export function SettingsForm({ initialSettings, onSaved }: SettingsFormProps) {
  const [settings, setSettings] = useState<Omit<UserSettings, "id">>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (({ id, ...rest }) => rest)(initialSettings)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = useCallback(
    <K extends keyof Omit<UserSettings, "id">>(
      key: K,
      value: Omit<UserSettings, "id">[K]
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
    },
    []
  );

  const updateMacroPct = useCallback(
    (macro: "protein" | "fat" | "carbs", pct: number) => {
      setSettings((prev) => ({
        ...prev,
        macroPct: { ...prev.macroPct, [macro]: pct },
      }));
      setSaved(false);
    },
    []
  );

  const handleSave = async () => {
    const validationErrors = validate(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await upsertSettings(settings);
      setSaved(true);
      onSaved?.(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const macroTotal = settings.macroPct.protein + settings.macroPct.fat + settings.macroPct.carbs;

  return (
    <div className="space-y-6">
      {/* ── Unidades ── */}
      <Card>
        <CardHeader>
          <CardTitle>Unidades</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Peso"
            value={settings.weightUnit}
            onChange={(e) => update("weightUnit", e.target.value as WeightUnit)}
            options={[
              { value: "kg", label: "Kilogramos (kg)" },
              { value: "lb", label: "Libras (lb)" },
            ]}
          />
          <Select
            label="Talla"
            value={settings.heightUnit}
            onChange={(e) => update("heightUnit", e.target.value as HeightUnit)}
            options={[
              { value: "cm", label: "Centímetros (cm)" },
              { value: "in", label: "Pulgadas (in)" },
            ]}
          />
        </div>
      </Card>

      {/* ── Distribución de macros ── */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de macros</CardTitle>
          <span
            className={cx(
              "text-xs font-mono",
              Math.abs(macroTotal - 100) > 1 ? "text-danger" : "text-ok"
            )}
          >
            {macroTotal}%
          </span>
        </CardHeader>

        <div className="space-y-5">
          {(["protein", "fat", "carbs"] as const).map((macro) => {
            const labels = { protein: "Proteína", fat: "Grasa", carbs: "Carbohidratos" };
            const kcalPerG = { protein: 4, fat: 9, carbs: 4 };
            const pct = settings.macroPct[macro];
            const { bar, text } = MACRO_COLORS[macro];

            return (
              <div key={macro} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-ink-primary">{labels[macro]}</label>
                  <div className="flex items-center gap-2">
                    <span className={cx("text-sm font-mono font-semibold", text)}>
                      {pct}%
                    </span>
                    <span className="text-xs text-ink-muted">
                      {kcalPerG[macro]} kcal/g
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={5}
                  max={70}
                  step={1}
                  value={pct}
                  onChange={(e) => updateMacroPct(macro, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={
                    {
                      background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    } as React.CSSProperties
                  }
                />

                {/* Barra visual */}
                <div className="h-1 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={cx("h-full rounded-full transition-all", bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {errors.carbs && (
            <p className="text-xs text-danger">⚠ {errors.carbs}</p>
          )}
        </div>
      </Card>

      {/* ── Límites de déficit/superávit ── */}
      <Card>
        <CardHeader>
          <CardTitle>Límites de ajuste calórico</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Déficit máximo"
            type="number"
            inputMode="numeric"
            min={SETTINGS_CONSTRAINTS.MAX_DEFICIT_KCAL.min}
            max={SETTINGS_CONSTRAINTS.MAX_DEFICIT_KCAL.max}
            value={settings.maxDeficitKcal}
            onChange={(e) => update("maxDeficitKcal", Number(e.target.value))}
            error={errors.maxDeficit}
            suffix="kcal/día"
            hint="Máx. reducción respecto al TDEE al bajar de peso"
          />
          <Input
            label="Superávit máximo"
            type="number"
            inputMode="numeric"
            min={SETTINGS_CONSTRAINTS.MAX_SURPLUS_KCAL.min}
            max={SETTINGS_CONSTRAINTS.MAX_SURPLUS_KCAL.max}
            value={settings.maxSurplusKcal}
            onChange={(e) => update("maxSurplusKcal", Number(e.target.value))}
            error={errors.maxSurplus}
            suffix="kcal/día"
            hint="Máx. incremento respecto al TDEE al ganar masa"
          />
          <Input
            label="Mínimo calórico absoluto"
            type="number"
            inputMode="numeric"
            min={SETTINGS_CONSTRAINTS.MIN_CALORIES_KCAL.min}
            max={SETTINGS_CONSTRAINTS.MIN_CALORIES_KCAL.max}
            value={settings.minCaloriesKcal}
            onChange={(e) => update("minCaloriesKcal", Number(e.target.value))}
            error={errors.minCalories}
            suffix="kcal/día"
            hint="No se bajará de este valor por seguridad"
          />
        </div>
      </Card>

      {/* ── Notificaciones — placeholder Fase 4 ── */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <span className="text-[10px] text-ink-muted uppercase tracking-wide border border-surface-border rounded px-1.5 py-0.5">
            Fase 4
          </span>
        </CardHeader>
        <label className="flex items-center gap-3 cursor-pointer opacity-50 pointer-events-none">
          <div
            className={cx(
              "w-10 h-6 rounded-full relative transition-all border-2",
              settings.notificationsEnabled
                ? "bg-accent border-accent"
                : "bg-surface-muted border-surface-border"
            )}
          >
            <div
              className={cx(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all",
                settings.notificationsEnabled && "translate-x-4"
              )}
            />
          </div>
          <span className="text-sm text-ink-secondary">
            Activar recordatorios de registro
          </span>
        </label>
      </Card>

      {/* ── Submit ── */}
      <Button onClick={handleSave} loading={loading} fullWidth size="lg">
        {saved ? "✓ Guardado" : "Guardar configuración"}
      </Button>
    </div>
  );
}
