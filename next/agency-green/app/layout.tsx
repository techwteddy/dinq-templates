import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Optimization Meta tags
export const metadata: Metadata = {
  title: "DtPix Studios | Creative Design & Branding Solutions",
  description:
    "DtPix Studios offers professional branding, web design, UI/UX, and booklet formatting services tailored for businesses and institutions. High-quality visuals, fast turnaround, and client-focused creativity.",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "DtPix Studios",
    "Dtp works",
    "freelancing",
    "website making",
    "branding services",
    "web design",
    "UI/UX design",
    "booklet design",
    "creative design agency",
    "poster design",
    "data entry formatting",
    "school design services",
    "business brand identity",
  ],
  authors: [{ name: "DtPix Studios", url: "https://dtpixstudios.vercel.app/" }],
  creator: "DtPix Studios",
  metadataBase: new URL("https://dtpixstudios.vercel.app/"),
  openGraph: {
    title: "DtPix Studios | Branding, Web Design & More",
    description:
      "We craft beautiful designs, websites, and brand identities that speak your vision. Discover how DtPix Studios can transform your ideas into stunning visuals.",

    url: "https://dtpixstudios.vercel.app/",
    siteName: "DtPix Studios",
    images: [
      {
        url: "https://dtpixstudios.vercel.app/logo.png",
        width: 800,
        height: 600,
        alt: "DtPix Studios Logo",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollProgressBar />
        {children}
      </body>
    </html>
  );
}
