import type { Metadata } from "next";
import { Fredoka, Space_Grotesk } from "next/font/google";

import { ThemeSync } from "@/components/layout/theme-sync";
import "./globals.css";

const fredokaOne = Fredoka({
  variable: "--font-fredoka-one",
  subsets: ["latin"],
  weight: "500",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HabitSmith",
  description: "A modern habit tracking app for streaks, analytics, and social accountability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${fredokaOne.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
