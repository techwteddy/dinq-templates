import { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { cn, getAssetPath } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { DemoProvider } from '@/components/demo-provider';
import { ExternalLinkHandler } from '@/components/external-link-handler';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontSerif = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    ),
    title: 'EduPlatform | Academy',
    description:
      'A comprehensive academic platform for modern learning, faculty expertise, and educational insights.',
    icons: {
      icon: getAssetPath('/logo.svg'),
      apple: getAssetPath('/logo.svg'),
    },
    openGraph: {
      title: 'EduPlatform | Academy',
      description: 'A comprehensive academic platform for modern learning.',
      url: '/',
      siteName: 'EduPlatform',
      images: [
        {
          url: getAssetPath('/og-image.jpg'),
          width: 1200,
          height: 630,
          alt: 'EduPlatform',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    manifest: getAssetPath('/site.webmanifest?v=2'),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DemoProvider>
              <ExternalLinkHandler />
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <Toaster />
            </DemoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
