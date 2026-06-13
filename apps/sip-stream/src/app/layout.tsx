import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '../lib/providers/supabase-provider';
import { AuthProvider } from '../hooks/useAuth';
import { PrimeReactThemeProvider } from '../lib/providers/primereact-theme-provider';
import { SessionProvider } from '../lib/providers/session-provider';
import { ConnectionStatus } from '../components/connection-status';
import { IconProvider } from '../components/icon-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SipStream - Drinking Card Game',
  description: 'A real-time drinking card game built with Next.js and Supabase',
  icons: {
    icon: '/icon-1.png',
    apple: '/icon-1.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <IconProvider>
          <SupabaseProvider>
            <PrimeReactThemeProvider>
              <SessionProvider>
                <AuthProvider>
                  <ConnectionStatus />
                  <div style={{ position: 'relative', minHeight: '100vh' }}>{children}</div>
                </AuthProvider>
              </SessionProvider>
            </PrimeReactThemeProvider>
          </SupabaseProvider>
        </IconProvider>
      </body>
    </html>
  );
}
