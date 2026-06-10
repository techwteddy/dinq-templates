import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { organizationEntity, personEntity, websiteEntity, buildGraphScript } from "@/lib/schema";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://famoussheamus.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Famous Sheamus | Global Fractional CTO & AI Architect",
    template: "%s | Famous Sheamus"
  },
  description: "Global Fractional CTO & AI Architect. Scaling enterprises worldwide through agnostic AI implementation and automation strategy. Scale Revenue, Not Chaos.",
  keywords: ["Fractional CTO Dallas", "Global AI Consultant", "Fractional CTO Worldwide", "AI Implementation Audit", "Enterprise AI Strategy", "n8n workflow architect", "Voice AI for Home Services", "automation business scaling"],
  // Favicon configuration
  icons: {
    icon: "/images/favicon-32x32.png",
    shortcut: "/images/favicon-32x32.png",
    apple: "/images/favicon-32x32.png",
  },
  // Open Graph (Thumbnail) configuration
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://famoussheamus.com',
    siteName: 'Famous Sheamus Consulting',
    title: 'Famous Sheamus | Fractional CTO & AI Architect',
    description: 'Scale Revenue, Not Chaos. Agnostic AI and automation solutions for high-growth SMBs.',
    images: [
      {
        url: '/images/og-main.png', // Thumnail image
        width: 1200,
        height: 630,
        alt: 'Famous Sheamus Consulting - Scale Revenue, Not Chaos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Famous Sheamus | Fractional CTO & AI Architect',
    description: 'Decoupling revenue from headcount with agnostic AI infrastructure.',
    images: ['/images/og-main.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans min-h-screen bg-canvas text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: buildGraphScript([
                organizationEntity,
                personEntity,
                websiteEntity
              ])
            }}
          />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-MDF6DDLEE0`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MDF6DDLEE0');
          `}
        </Script>
      </body>
    </html>
  );
}