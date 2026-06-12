import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import SupabaseProvider from '@/components/providers/SupabaseProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FocusFlow AI — Your Productivity Coach',
  description:
    'AI-powered focus timer, smart task manager, habit tracker, and daily insights to help you do your best work.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FocusFlow',
  },
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
    { rel: 'icon', url: '/icons/icon-192x192.png' },
  ],
  themeColor: '#16a34a',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#16a34a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="text-slate-900 antialiased safe-top safe-bottom">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
