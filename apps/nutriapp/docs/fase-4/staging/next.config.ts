/**
 * next.config.ts
 *
 * Integra @serwist/next para service worker y caché PWA.
 * Docs: https://serwist.pages.dev/docs/next
 */
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Archivo fuente del SW (TypeScript)
  swSrc: "app/sw.ts",
  // Destino compilado (dentro de public/)
  swDest: "public/sw.js",
  // Desactiva en desarrollo para evitar caché al editar
  disable: process.env.NODE_ENV === "development",
  // Revisa: https://serwist.pages.dev/docs/next/getting-started
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  // ──────────────────────────────────────────────
  // Imágenes
  // ──────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // FoodData Central (thumbnails si se usan)
      { protocol: "https", hostname: "api.nal.usda.gov" },
      // Open Food Facts (imágenes de productos)
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "static.openfoodfacts.org" },
    ],
  },

  // ──────────────────────────────────────────────
  // Cabeceras de seguridad y Service Worker
  // ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permite registrar el SW en el scope raíz
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      // Caché de larga duración para assets estáticos con hash
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Manifest sin caché agresiva para facilitar actualizaciones
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },

  // ──────────────────────────────────────────────
  // Experimental
  // ──────────────────────────────────────────────
  experimental: {
    // Optimiza las importaciones de paquetes grandes
    optimizePackageImports: ["lucide-react", "@supabase/supabase-js"],
  },
};

export default withSerwist(nextConfig);
