import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lifebeet - Finance Tracker",
  description: "Multi-tenant finance tracking with automatic currency conversion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
