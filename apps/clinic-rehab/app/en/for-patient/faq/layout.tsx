import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Sails of Life Center',
  description: 'Answers to frequently asked questions from patients and their families regarding rehabilitation, palliative care, documentation, and the center schedule.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/for-patient/faq',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/faq',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/faq',
    },
  },
};

export default function FAQLayoutEn({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
