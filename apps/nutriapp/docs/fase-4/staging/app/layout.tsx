/**
 * app/layout.tsx
 *
 * Root layout con:
 *  - Metadata PWA completa (manifest, theme-color, apple-touch-icon)
 *  - Viewport mobile-first
 *  - Registro del service worker (componente cliente)
 *  - Proveedor de Push Notifications
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ServiceWorkerRegistrar } from "@/components/push/ServiceWorkerRegistrar";
import { PushNotificationManager } from "@/components/push/PushNotificationManager";
import "./globals.css";

// ── Fuente ────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ── Metadata PWA ──────────────────────────────────
export const metadata: Metadata = {
  // Básico
  title: {
    default: "NutriApp",
    template: "%s | NutriApp",
  },
  description: "Tu app personal y privada de nutrición diaria.",
  applicationName: "NutriApp",
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",

  // PWA / Manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-96x96.png",
  },

  // Open Graph
  openGraph: {
    title: "NutriApp",
    description: "Tu app personal y privada de nutrición diaria.",
    type: "website",
    locale: "es_PE",
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    title: "NutriApp",
    statusBarStyle: "black-translucent",
  },

  // Sin indexación (app privada)
  robots: { index: false, follow: false },
};

// ── Viewport ──────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,        // Evita zoom accidental en iOS
  userScalable: false,
  viewportFit: "cover",   // Para notch de iPhone
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)",  color: "#15803d" },
  ],
};

// ── Layout ────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Apple Splash Screens — genera con: npx pwa-asset-generator */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {/* Registrar SW en el cliente */}
        <ServiceWorkerRegistrar />

        {/* Gestión de notificaciones push */}
        <PushNotificationManager />

        {/* Contenido de la app */}
        {children}
      </body>
    </html>
  );
}
