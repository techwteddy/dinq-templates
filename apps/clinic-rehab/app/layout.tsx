import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import ScrollToTop from "@/app/components/ScrollToTop";
import Script from "next/script";
import CookieBanner from "@/app/components/CookieBanner";
import { AccessibilityPanel } from "@/app/components/AccessibilityPanel";
import { AccessibilityProvider } from "@/app/components/AccessibilityProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: 'swap', });

export const metadata: Metadata = {
  metadataBase: new URL('https://vitrylazhyttia.com.ua'),
  title: "Вітрила Життя | Центр медичної реабілітації дітей у Житомирі",
  description: "Комплексна медична реабілітація та паліативна допомога дітям у Житомирі. Безкоштовні послуги за пакетами НСЗУ: фізична терапія, ерготерапія, логопед, психолог, раннє втручання.",
  keywords: [
    "реабілітація дітей Житомир", "Вітрила Життя", "дитячий реабілітаційний центр", 
    "паліативна допомога дітям", "логопед Житомир", "дитячий невролог Житомир",
    "фізична терапія для дітей", "ДЦП реабілітація", "раннє втручання Житомир", "ЦМР та ПДД ЖОР"
  ],
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua',
      'en-US': 'https://vitrylazhyttia.com.ua/en',
    },
  },
  icons: { 
    icon: '/icon.png',
    apple: '/icon.png',
   },
  openGraph: {
    title: "Вітрила Життя | Центр медичної реабілітації",
    description: "Комплексна медична реабілітація та паліативна допомога дітям у Житомирі.",
    url: "https://vitrylazhyttia.com.ua",
    siteName: "Вітрила Життя",
    images: [
      {
        url: '/og-image.png?v=2',
        width: 1200,
        height: 630,
        alt: 'Вітрила Життя — Центр медичної реабілітації дітей',
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Вітрила Життя | Центр медичної реабілітації",
    description: "Комплексна медична реабілітація та паліативна допомога дітям у Житомирі.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "КНП «Центр медичної реабілітації та паліативної допомоги дітям» Житомирської обласної ради",
    "alternateName": "Вітрила Життя",
    "url": "https://vitrylazhyttia.com.ua",
    "logo": "https://vitrylazhyttia.com.ua/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+380674572828",
      "contactType": "customer service",
      "areaServed": "UA",
      "availableLanguage": ["Ukrainian", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "вул. Корабельна, 8",
      "addressLocality": "Житомир",
      "postalCode": "10004",
      "addressCountry": "UA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.2858", 
      "longitude": "28.6631"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
      ],
      "opens": "08:00",
      "closes": "17:30"
    }
  };

  return (
    <html lang="uk" suppressHydrationWarning> 
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <script
          id="theme-consent-patch"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var consent = localStorage.getItem('cookie-consent');
                  if (consent !== 'accepted') {
                    var originalGetItem = localStorage.getItem;
                    var originalSetItem = localStorage.setItem;
                    var originalRemoveItem = localStorage.removeItem;
                    
                    var tempTheme = originalGetItem.call(localStorage, 'theme') || 'system';
                    
                    var patch = {
                      originalGetItem: originalGetItem,
                      originalSetItem: originalSetItem,
                      originalRemoveItem: originalRemoveItem,
                      tempTheme: tempTheme,
                      restore: function() {
                        localStorage.getItem = this.originalGetItem;
                        localStorage.setItem = this.originalSetItem;
                        localStorage.removeItem = this.originalRemoveItem;
                        localStorage.setItem('theme', this.tempTheme);
                        delete window.__themeConsentPatch;
                      }
                    };
                    
                    window.__themeConsentPatch = patch;
                    
                    localStorage.getItem = function(key) {
                      if (key === 'theme') {
                        return patch.tempTheme;
                      }
                      return originalGetItem.apply(this, arguments);
                    };
                    
                    localStorage.setItem = function(key, val) {
                      if (key === 'theme') {
                        patch.tempTheme = val;
                        return;
                      }
                      return originalSetItem.apply(this, arguments);
                    };
                    
                    localStorage.removeItem = function(key) {
                      if (key === 'theme') {
                        patch.tempTheme = 'system';
                        return;
                      }
                      return originalRemoveItem.apply(this, arguments);
                    };
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccessibilityProvider>
            {children}
            <ScrollToTop />
            <AccessibilityPanel />
            <CookieBanner />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}