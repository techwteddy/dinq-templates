import type { Metadata } from "next";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Footer, Navbar } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./globals.css";

const siteName = "어린이 둥지 | Ninho das Crianças";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description:
    "브라질 취약 환경의 아이들을 위한 방과 후 돌봄 사역 어린이 둥지(Ninho das Crianças) 공식 사이트입니다.",
  openGraph: {
    title: siteName,
    description:
      "아이들이 안전하게 머물 수 있는 방과 후 둥지. 후원과 소식은 웹에서 이어집니다.",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "브라질 취약 환경의 아이들을 위한 방과 후 돌봄 사역 어린이 둥지입니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn("theme min-h-full")}
      data-locale="ko"
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased [font-feature-settings:'kern'_1,'liga'_1]">
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
