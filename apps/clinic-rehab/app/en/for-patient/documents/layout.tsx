import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Required Documents for Rehabilitation | Sails of Life',
  description: 'Important information about the child rehabilitation process. How to prepare, what methods we use, and what documents are required for recovery courses.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/for-patient/documents',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/dokumenty',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/documents',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}