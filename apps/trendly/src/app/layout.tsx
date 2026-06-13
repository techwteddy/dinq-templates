import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trendly.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trendly - Share what is trending",
    template: "%s | Trendly",
  },
  description:
    "Trendly is a social app for sharing photos, reels, and stories with friends.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Trendly",
    description: "Share what is trending - photos, reels, and stories.",
    url: siteUrl,
    siteName: "Trendly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trendly",
    description: "Share what is trending - photos, reels, and stories.",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBootstrap = `try{var t=localStorage.getItem('trendly-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Pre-paint theme script — avoids a dark→light flash on reload. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body style={{ fontFamily: "var(--font-inter), var(--font-ui)" }}>
        <div className="phone">{children}</div>
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
