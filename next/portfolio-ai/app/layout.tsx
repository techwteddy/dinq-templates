import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Kanika - AI & Data Science Portfolio",
  description:
    "AI & Data Science student with expertise in ML, NLP, and Computer Vision. Seeking co-op opportunities.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  // 👇 Add these
  openGraph: {
    title: "Kanika - AI & Data Science Portfolio",
    description:
      "Explore AI, Machine Learning, NLP, and Computer Vision projects. Designed with Next.js, TailwindCSS, and Framer Motion.",
    url: "https://kanika-dev.netlify.app",
    siteName: "Kanika Portfolio",
    images: [
      {
        url: "https://kanika-dev.netlify.app/preview.png", // put your preview image inside /public/preview.png
        width: 1200,
        height: 630,
        alt: "Kanika Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kanika - AI & Data Science Portfolio",
    description:
      "Explore AI, Machine Learning, NLP, and Computer Vision projects. Designed with Next.js, TailwindCSS, and Framer Motion.",
    images: ["https://kanika-dev.netlify.app/preview.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${manrope.variable} antialiased`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
