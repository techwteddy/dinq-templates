import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://baguiorentals.com"),
  title: {
    default: "BaguioRentals - Find Your Home in the City of Pines",
    template: "%s | BaguioRentals",
  },
  description:
    "Browse rental listings in Baguio City. Apartments, houses, rooms, and condos for rent. Connect directly with property owners.",
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "BaguioRentals",
    title: "BaguioRentals - Find Your Home in the City of Pines",
    description:
      "Browse rental listings in Baguio City. Apartments, houses, rooms, and condos for rent. Connect directly with property owners.",
    images: [{ url: "/images/lion-head-baguio.jpg", width: 1200, height: 630, alt: "Baguio City skyline" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://unpkg.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
