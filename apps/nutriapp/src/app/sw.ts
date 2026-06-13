/// <reference lib="webworker" />
/**
 * app/sw.ts  — Service Worker (fuente compilada por @serwist/next)
 *
 * Este archivo es transformado por serwist durante el build.
 * NO importar módulos de Next.js aquí.
 *
 * Estrategias de caché:
 *   - App shell / rutas Next.js → NetworkFirst (siempre intenta red)
 *   - Nutrientes FDC (API estática) → CacheFirst (7 días)
 *   - Open Food Facts → CacheFirst (24 h)
 *   - Imágenes → StaleWhileRevalidate (30 días)
 *   - Fuentes → CacheFirst (30 días)
 */
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, Serwist } from "serwist";
import { ExpirationPlugin } from "serwist";
import { CacheableResponsePlugin } from "serwist";

// ── Tipado de assets inyectados por @serwist/next ──
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

// ── Instancia principal ────────────────────────────
const serwist = new Serwist({
  // Assets pre-cacheados (generados en build por @serwist/next)
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // Fallback cuando no hay red
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },

  // ── Rutas de runtime ────────────────────────────
  runtimeCaching: [
    // ① Pages de Next.js → NetworkFirst (fresh, con fallback offline)
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "document",
      handler: new NetworkFirst({
        cacheName: "pages-cache",
        networkTimeoutSeconds: 5,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 }),
        ],
      }),
    },

    // ② FoodData Central (datos nutricionales) → CacheFirst 7 días
    {
      matcher: ({ url }) => url.hostname === "api.nal.usda.gov",
      handler: new CacheFirst({
        cacheName: "fdc-api-cache",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },

    // ③ Open Food Facts → CacheFirst 24 h
    {
      matcher: ({ url }) =>
        url.hostname.includes("openfoodfacts.org"),
      handler: new CacheFirst({
        cacheName: "off-api-cache",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },

    // ④ Imágenes → StaleWhileRevalidate
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new StaleWhileRevalidate({
        cacheName: "images-cache",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },

    // ⑤ Fuentes externas → CacheFirst 30 días
    {
      matcher: ({ request }) =>
        request.destination === "font" ||
        request.url.includes("fonts.googleapis.com") ||
        request.url.includes("fonts.gstatic.com"),
      handler: new CacheFirst({
        cacheName: "fonts-cache",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },

    // ⑥ API propias de la app → NetworkFirst
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin && url.pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 8,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 }),
        ],
      }),
    },

    // Default del framework
    ...defaultCache,
  ],
});

serwist.addEventListeners();

// ── Push: manejar notificaciones entrantes ──────────────────
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let payload: { title: string; body: string; url?: string; tag?: string };
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "NutriApp", body: event.data.text() };
  }

  const options: NotificationOptions = {
    body: payload.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: payload.tag ?? "nutriapp-default",
    data: { url: payload.url ?? "/" },
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// ── Push: manejar click en notificación ────────────────────
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    (self.clients as Clients)
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Reutiliza ventana abierta si existe
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return (client as WindowClient).focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
