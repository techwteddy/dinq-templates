import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LASU STESA - Science & Technology Education Hub',
  description: 'Lagos State University Science, Technology, Engineering and Skills Services for Africa. Access courses, resources, and announcements.',
  generator: 'v0.app',
  keywords: 'LASU, STESA, Science Education, Technology Education, Lagos State University',
  authors: [{ name: 'LASU STESA' }],
  icons: {
    icon: '/lasu-logo.png',
    apple: '/lasu-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stesa.lasu.edu.ng',
    siteName: 'LASU STESA Resource Hub',
    title: 'LASU STESA - Science & Technology Education Hub',
    description: 'Science, Technology, Engineering and Skills Services for Africa',
    images: [
      {
        url: '/lasu-logo.png',
        width: 1200,
        height: 630,
        alt: 'LASU STESA Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LASU STESA - Science & Technology Education Hub',
    description: 'Science, Technology, Engineering and Skills Services for Africa',
    images: ['/lasu-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
