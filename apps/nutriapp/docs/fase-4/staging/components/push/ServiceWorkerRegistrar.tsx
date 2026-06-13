"use client";
/**
 * components/push/ServiceWorkerRegistrar.tsx
 *
 * Registra el service worker en el cliente.
 * Renderiza null — sólo efecto de registro.
 */
import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Serwist exporta el path del SW compilado
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] Registrado:", registration.scope);

        // Comprueba actualizaciones al volver a primer plano
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nueva versión disponible — opcionalmente avisa al usuario
              console.log("[SW] Nueva versión disponible.");
            }
          });
        });
      })
      .catch((err) => {
        console.error("[SW] Error de registro:", err);
      });
  }, []);

  return null;
}
