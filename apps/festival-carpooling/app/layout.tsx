import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { PwaSetup } from '@/components/PwaSetup'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: { default: 'Carpooling', template: '%s · Carpooling' },
  description: 'Carpooling per il festival. Condividi un passaggio, riduci le emissioni, arriva insieme.',
  applicationName: 'Carpooling',
  keywords: ['carpooling', 'festival', 'festival', 'passaggi', 'covoiturage'],
  openGraph: {
    title: 'Carpooling',
    description: 'Carpooling per il festival. Condividi un passaggio, riduci le emissioni, arriva insieme.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#faf9f7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased bg-background min-h-screen">
        <Header />
        {children}
        <Suspense><BottomNav /></Suspense>
        <PwaSetup />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
