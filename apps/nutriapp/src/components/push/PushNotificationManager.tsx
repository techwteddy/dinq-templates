"use client";
/**
 * components/push/PushNotificationManager.tsx
 *
 * Solicita permiso y gestiona la suscripción Web Push del usuario.
 * Renderiza un banner de opt-in si el usuario no ha decidido aún.
 */
import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationManager() {
  const { status, subscribe, unsubscribe, isSupported } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const d = localStorage.getItem("push-banner-dismissed");
    if (d) setDismissed(true);
  }, []);

  if (!mounted || !isSupported || dismissed) return null;
  if (status === "granted" || status === "denied") return null;

  return (
    <div
      role="dialog"
      aria-label="Activar notificaciones"
      className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-slate-700
                 bg-slate-900 p-4 shadow-2xl sm:left-auto sm:right-6 sm:w-80"
    >
      {/* Cerrar sin decidir */}
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem("push-banner-dismissed", "1");
        }}
        className="absolute right-3 top-3 text-slate-400 hover:text-slate-100"
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
                         rounded-full bg-green-600/20 text-green-400">
          <Bell size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-100">
            Recordatorios de comidas
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Activa las notificaciones para recibir recordatorios de desayuno,
            almuerzo, cena y tu resumen diario.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={subscribe}
          className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-medium
                     text-white transition hover:bg-green-500 active:scale-95"
        >
          Activar
        </button>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("push-banner-dismissed", "1");
          }}
          className="rounded-xl border border-slate-700 px-3 py-2 text-sm
                     text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}

// ── Componente de configuración (para Settings page) ─────────
export function PushSettingsToggle() {
  const { status, subscribe, unsubscribe, isSupported } = usePushNotifications();

  if (!isSupported) {
    return (
      <p className="text-xs text-slate-500">
        Tu navegador no soporta notificaciones push.
        {typeof navigator !== "undefined" &&
          /iPad|iPhone/.test(navigator.userAgent) &&
          " En iOS, instala la app en tu pantalla de inicio primero."}
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-100">
          Recordatorios push
        </p>
        <p className="text-xs text-slate-400">
          {status === "granted"
            ? "Notificaciones activadas"
            : status === "denied"
            ? "Bloqueadas — actívalas en ajustes del navegador"
            : "Recibirás recordatorios de comidas y peso"}
        </p>
      </div>

      {status === "granted" ? (
        <button
          onClick={unsubscribe}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700
                     px-3 py-1.5 text-xs text-slate-400 hover:border-red-700
                     hover:text-red-400 transition"
        >
          <BellOff size={14} /> Desactivar
        </button>
      ) : (
        <button
          onClick={subscribe}
          disabled={status === "denied"}
          className="flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-1.5
                     text-xs font-medium text-white hover:bg-green-600 transition
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Bell size={14} /> Activar
        </button>
      )}
    </div>
  );
}
