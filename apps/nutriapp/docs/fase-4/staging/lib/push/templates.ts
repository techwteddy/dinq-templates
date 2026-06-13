/**
 * lib/push/templates.ts
 *
 * Plantillas de notificaciones push para los casos de uso de Fase 4.
 */
import type { PushPayload } from "./web-push";

export const pushTemplates = {
  // ── Recordatorios de comidas ───────────────────────
  desayuno(): PushPayload {
    return {
      title: "🌅 Buenos días — ¿Registraste el desayuno?",
      body: "Llevar un registro preciso te ayuda a alcanzar tus metas. Tarda sólo 1 minuto.",
      url: "/diary",
      tag: "recordatorio-desayuno",
    };
  },

  almuerzo(): PushPayload {
    return {
      title: "🥗 Hora del almuerzo",
      body: "No olvides registrar lo que comes. Cada comida cuenta.",
      url: "/diary",
      tag: "recordatorio-almuerzo",
    };
  },

  cena(): PushPayload {
    return {
      title: "🌙 ¿Cenar hoy?",
      body: "Registra tu cena para completar el seguimiento del día.",
      url: "/diary",
      tag: "recordatorio-cena",
    };
  },

  // ── Cierre de día ─────────────────────────────────
  cierreDia(caloriasRestantes: number): PushPayload {
    const mensaje =
      caloriasRestantes > 0
        ? `Te quedan ${caloriasRestantes} kcal para tu meta de hoy.`
        : `¡Hoy superaste tu meta calórica por ${Math.abs(caloriasRestantes)} kcal!`;

    return {
      title: "📊 Resumen del día",
      body: mensaje,
      url: "/",
      tag: "cierre-dia",
    };
  },

  // ── Recordatorio semanal de peso ──────────────────
  pesoCorporal(): PushPayload {
    return {
      title: "⚖️ Registro semanal de peso",
      body: "Es hora de registrar tu peso para hacer seguimiento de tu progreso.",
      url: "/profile?section=weight",
      tag: "peso-corporal",
    };
  },

  // ── Streak de racha ────────────────────────────────
  rachaRegistro(dias: number): PushPayload {
    return {
      title: `🔥 ${dias} días de racha`,
      body: "¡Sigue así! Registrar todos los días hace la diferencia.",
      url: "/",
      tag: "racha",
    };
  },
} as const;

// ── Horarios recomendados (hora local) ──────────────
export const PUSH_SCHEDULES = {
  desayuno: { hour: 8,  minute: 30 },
  almuerzo: { hour: 13, minute: 0  },
  cena:     { hour: 20, minute: 0  },
  cierreDia:{ hour: 22, minute: 0  },
  peso:     { hour: 8,  minute: 0, dayOfWeek: 1 }, // Lunes
} as const;
