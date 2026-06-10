import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koketso 💙 Neo - Wedding Invitation | 06 Dec 2025",
  description: "Join us for our special day of love and celebration in Letsholathebe village. Interactive wedding invitation with all the details you need.",
  keywords: ["wedding", "invitation", "Koketso", "Neo", "Botswana", "Letsholathebe", "December 2025"],
  authors: [{ name: "Koketso Morapedi" }],
  metadataBase: new URL('https://koketso-neo-wedding.netlify.app'),
  openGraph: {
    title: "Koketso 💙 Neo - Wedding Invitation",
    description: "You're invited to celebrate our union on 06 December 2025 in Letsholathebe, Botswana",
    type: "website",
    images: [
      {
        url: "/images/Proposal 2.JPG",
        width: 1200,
        height: 630,
        alt: "Koketso & Neo Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koketso 💙 Neo - Wedding Invitation",
    description: "Join us for our special day - 06 December 2025",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#A3BFD9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Great+Vibes&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/images/Proposal 1.JPG" />
        <link rel="preload" as="image" href="/images/Proposal 2.JPG" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
