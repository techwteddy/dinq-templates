/**
 * app/offline/page.tsx
 *
 * Página de fallback cuando el usuario no tiene conexión.
 * El service worker redirige aquí cuando un documento no está en caché.
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sin conexión",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center
                     bg-slate-950 px-6 text-center">
      {/* Ícono animado */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full
                      bg-slate-800 text-5xl">
        📡
      </div>

      <h1 className="text-2xl font-bold text-slate-100">Sin conexión</h1>
      <p className="mt-3 max-w-xs text-sm text-slate-400">
        Parece que no tienes acceso a internet. Algunas partes de la app
        funcionan offline — vuelve al inicio para ver lo que está disponible.
      </p>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="w-full rounded-2xl bg-green-700 px-5 py-3 text-sm
                     font-semibold text-white transition hover:bg-green-600
                     active:scale-95"
        >
          Ir al dashboard
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-2xl border border-slate-700 px-5 py-3
                     text-sm font-medium text-slate-300 transition
                     hover:border-slate-500 hover:text-slate-100 active:scale-95"
        >
          Reintentar conexión
        </button>
      </div>

      <p className="mt-10 text-xs text-slate-600">
        NutriApp guarda en caché el dashboard y tu historial reciente.
      </p>
    </main>
  );
}
