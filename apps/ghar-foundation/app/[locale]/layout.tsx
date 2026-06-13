import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import CookieBanner from '@/components/layout/CookieBanner';
import Script from 'next/script';
import { getSiteSettings, getProjects } from '@/sanity/lib/queries';


const locales = ['en', 'ar', 'de'];

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'GHAR Organization — German Humanitarian Relief Organization',
    ar: 'منظمة غار — منظمة إنسانية ألمانية',
    de: 'GHAR Organization — Deutsche Humanitäre Hilfsorganisation',
  };
  const descriptions: Record<string, string> = {
    en: 'GHAR Organization provides humanitarian support to crisis-affected regions. Donate, volunteer, or partner with us.',
    ar: 'منظمة غار تقدم المساعدات الإنسانية للمناطق المنكوبة. تبرع، تطوع، أو كن شريكاً معنا.',
    de: 'Die GHAR Organization leistet humanitäre Hilfe in Krisenregionen. Spenden, ehrenamtlich tätig sein oder Partner werden.',
  };
  return {
    title: {
      default: titles[locale] || titles.en,
      template: `%s | GHAR Organization`,
    },
    description: descriptions[locale] || descriptions.en,
    metadataBase: new URL('https://www.ghar-ngo.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: { 'en': '/en', 'ar': '/ar', 'de': '/de' },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `https://www.ghar-ngo.com/${locale}`,
      siteName: 'GHAR Organization',
      images: [{ url: 'https://www.ghar-ngo.com/og-image.png', width: 1200, height: 630, alt: 'GHAR Organization' }],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: ['https://www.ghar-ngo.com/og-image.png'],
    },
    robots: { index: true, follow: true },
    verification: {
      google: 'sWC7-eEp4EOw9NVWMDt8yAJkgh_7B7PJc0QSekqfaro',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const [messages, siteSettings, projects] = await Promise.all([
    getMessages(),
    getSiteSettings(),
    getProjects(),
  ]);

  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "NGO",
                  "@id": "https://www.ghar-ngo.com/#organization",
                  "name": "German Humanitarian Relief Organization e.V.",
                  "alternateName": "GHAR",
                  "url": "https://www.ghar-ngo.com",
                  "logo": "https://www.ghar-ngo.com/images/GahrLogo.svg",
                  "foundingDate": "2025",
                  "description": "German humanitarian NGO providing aid to crisis-affected regions. Registered in Bremen, Germany.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Kulenkampffallee 193",
                    "addressLocality": "Bremen",
                    "postalCode": "28213",
                    "addressCountry": "DE"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+4901772839465",
                    "email": "info@ghar-ngo.com",
                    "contactType": "customer support"
                  },
                  "sameAs": [
                    "https://www.facebook.com/share/1D3frCWUJj/",
                    "https://www.instagram.com/ghar_ngo",
                    "https://www.linkedin.com/company/ghar-organization/"
                  ],
                  "areaServed": ["Sudan", "Egypt"],
                  "nonprofitStatus": "https://schema.org/DERegisteredAssociationCharity",
                  "legalName": "German Humanitarian Relief Organization e.V."
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.ghar-ngo.com/#website",
                  "url": "https://www.ghar-ngo.com",
                  "name": "GHAR Organization",
                  "description": "German Humanitarian Relief Organization providing aid to crisis-affected regions.",
                  "publisher": {
                    "@id": "https://www.ghar-ngo.com/#organization"
                  },
                  "inLanguage": ["en", "ar", "de"]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CKHM7ZYE7F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CKHM7ZYE7F');
          `}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer siteSettings={siteSettings} projects={projects} />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}