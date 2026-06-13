import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistrar } from "@/components/push/ServiceWorkerRegistrar";
import { PushNotificationManager } from "@/components/push/PushNotificationManager";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriApp",
  description: "App personal de nutrición — precisa, privada, tuya.",
  applicationName: "NutriApp",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NutriApp",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="page-bg text-ink-primary font-display antialiased safe-top safe-bottom">
        <ServiceWorkerRegistrar />
        <PushNotificationManager />
        {children}
      </body>
    </html>
  );
}
