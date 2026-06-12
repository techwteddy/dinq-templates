import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import MouseSpotlight from "@/components/MouseSpotlight";
import CustomCursor from "@/components/CustomCursor";
import SkipLink from "@/components/SkipLink";
import ScrollProgressBar from "@/components/ScrollProgressBar";
const AskFernando = dynamic(() => import("@/components/AskFernando"));
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://ghiberti85.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Fernando Ghiberti — Senior Fullstack Developer",
  description:
    "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, Node.js, Supabase, and AI integrations. Available for new opportunities.",
  keywords: [
    "Fernando Ghiberti",
    "Senior Fullstack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Supabase",
    "AI",
    "Portfolio",
    "Brazil",
  ],
  authors: [{ name: "Fernando Ghiberti", url: "https://github.com/ghiberti85" }],
  creator: "Fernando Ghiberti",
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Fernando Ghiberti Portfolio",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
    creator: "@ghiberti85",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Fernando Ghiberti",
      url: BASE_URL,
      jobTitle: "Senior Fullstack Developer",
      email: "ghiberti85@gmail.com",
      image: "https://github.com/ghiberti85.png",
      sameAs: [
        "https://github.com/ghiberti85",
        "https://linkedin.com/in/fernando-ghiberti",
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Supabase",
        "PostgreSQL",
        "AI Integration",
        "Groq",
        "Framer Motion",
        "Tailwind CSS",
      ],
      address: { "@type": "PostalAddress", addressCountry: "BR" },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Fernando Ghiberti Portfolio",
      description: "Personal portfolio of Fernando Ghiberti, Senior Fullstack Developer.",
      author: { "@id": `${BASE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <ScrollProgressBar />
            <SkipLink />
            <div className="mesh-blob mesh-blob-1" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-2" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-3" aria-hidden="true" />
            <CustomCursor />
            <MouseSpotlight />
            <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 relative z-10 overflow-x-hidden">{children}</div>
            <AskFernando />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
