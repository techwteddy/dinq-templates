import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Sails of Life Center',
  description: 'Learn more about our mission, values, and history. We create comfortable conditions for effective rehabilitation and palliative care for children.',
  alternates: {
    canonical: 'ttps://vitrylazhyttia.com.ua/en/about-us',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/pro-nas',
      'en-US': 'https://vitrylazhyttia.com.ua/en/about-us',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}