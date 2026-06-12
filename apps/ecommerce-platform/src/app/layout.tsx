import type { Metadata } from "next";
import { Dela_Gothic_One, Space_Grotesk } from "next/font/google";
import "./globals.css";

const delaGothic = Dela_Gothic_One({
  variable: "--font-dela-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HealMitra – Authentic Ayurvedic Wellness | Brutalist Edition",
  description: "Brave Ayurveda. Natural healing for the modern world. No fluff, just results. 100% Authentic.",
  keywords: "ayurvedic products, natural hair care, neobrutalist, HealMitra",
  authors: [{ name: "HealMitra" }],
};

import { ClerkProvider } from "@clerk/nextjs";
import SplashLoader from "@/components/ui/SplashLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0A2A1F',
          colorText: '#0A2A1F',
          colorBackground: '#F8F4E8',
          fontFamily: 'var(--font-space-grotesk)',
          borderRadius: '1.5rem',
        },
        elements: {
          card: "border-2 border-ink shadow-hard rounded-[2.5rem]",
          formButtonPrimary: "bg-ink text-acid hover:bg-ink/90 border-2 border-ink shadow-hard-acid",
        }
      }}
    >
      <html lang="en" className={`${delaGothic.variable} ${spaceGrotesk.variable}`}>
        <body className="font-sans antialiased text-ink bg-paper selection:bg-acid selection:text-ink">
          <SplashLoader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
