import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "BrainHub - Second Brain",
  description: "AI-Powered Knowledge Management",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0B] text-white antialiased flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
