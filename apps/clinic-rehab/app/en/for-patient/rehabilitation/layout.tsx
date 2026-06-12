import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Child Rehabilitation | Sails of Life Center',
  description: 'An article by the Acting Director on the importance of child rehabilitation, modern challenges, cerebral palsy statistics, and the future of the center.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/for-patient/rehabilitation',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/reabilitatsiya',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/rehabilitation',
    },
  },
};

export default function RehabilitationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}