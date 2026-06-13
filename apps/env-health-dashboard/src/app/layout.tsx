import type { Metadata } from 'next';
import './globals.css';

/**
 * Metadata for the application (used by Next.js for SEO).
 */
export const metadata: Metadata = {
  title: 'Server Health Dashboard',
  description: 'Monitor and display the uptime and latency of API endpoints across different SDLC environments.',
};

/**
 * RootLayout - The root layout component for the Next.js app.
 *
 * Wraps all pages with the HTML structure and global styles.
 *
 * @param props - Component props
 * @param props.children - Child pages/components to render
 * @returns React component with the root layout structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
