import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Us | Sails of Life Center',
  description: 'Learn how to support our center: bank details, list of urgent needs, and volunteer online application.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/help',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dopomoga',
      'en-US': 'https://vitrylazhyttia.com.ua/en/help',
    },
  },
};

export default function HelpLayoutEn({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
