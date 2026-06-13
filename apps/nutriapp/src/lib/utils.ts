/**
 * Utilidades generales de la app.
 */

/** Formatea un número con decimales opcionales y unidad. */
export function fmt(value: number, decimals = 0, unit = ""): string {
  const formatted = value.toFixed(decimals);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** Redondea a N decimales. */
export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Clamp de un valor dentro de un rango. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Genera clases CSS combinadas (sin dependencia de clsx). */
export function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Capitaliza la primera letra de un string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Convierte snake_case a legible. */
export function snakeToReadable(str: string): string {
  return str
    .split("_")
    .map(capitalize)
    .join(" ");
}

/** Pausa async (para debounce manual). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Formatea kcal con separador de miles. */
export function fmtKcal(kcal: number): string {
  return `${kcal.toLocaleString("es-PE")} kcal`;
}

/** Formatea peso según unidad del usuario. */
export function fmtWeight(
  kg: number,
  unit: "kg" | "lb",
  decimals = 1
): string {
  if (unit === "lb") {
    return `${(kg * 2.20462).toFixed(decimals)} lb`;
  }
  return `${kg.toFixed(decimals)} kg`;
}

/** Formatea altura según unidad del usuario. */
export function fmtHeight(cm: number, unit: "cm" | "in"): string {
  if (unit === "in") {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }
  return `${cm} cm`;
}
