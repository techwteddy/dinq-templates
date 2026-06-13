import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/components/ui/alert-provider";

export const metadata: Metadata = {
  title: "UC Transportation",
  description: "Admin-only TMS for managing vehicle reservations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}


