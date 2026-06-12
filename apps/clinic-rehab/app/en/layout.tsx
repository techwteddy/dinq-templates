import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://vitrylazhyttia.com.ua'),
  title: "Sails of Life | Children's Medical Rehabilitation Center in Zhytomyr",
  description: "Comprehensive medical rehabilitation and palliative care for children. Free services under NHSU packages: physical therapy, occupational therapy, speech therapy, psychology, early intervention.",
  keywords: [
    "child rehabilitation Zhytomyr", "Sails of Life", "children's rehabilitation center", 
    "speech therapy Zhytomyr", "pediatric neurologist Zhytomyr",
    "physical therapy for children", "CP rehabilitation", "early intervention Zhytomyr"
  ],
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en',
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
    title: "Sails of Life | Medical Rehabilitation Center",
    description: "Professional help for children. Rehabilitation and palliative care in Zhytomyr.",
    url: 'https://vitrylazhyttia.com.ua/en',
    siteName: 'Sails of Life',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sails of Life — Children\'s Medical Rehabilitation Center',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sails of Life | Medical Rehabilitation Center",
    description: "Professional help for children. Rehabilitation and palliative care in Zhytomyr.",
    images: ['/og-image.png'],
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}