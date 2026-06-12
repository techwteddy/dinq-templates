import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Sails of Life Center',
  description: 'Meet our specialists. Experienced doctors, rehabilitation specialists, psychologists, and speech therapists who help children become healthier every day.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/team',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/komanda',
      'en-US': 'https://vitrylazhyttia.com.ua/en/team',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}