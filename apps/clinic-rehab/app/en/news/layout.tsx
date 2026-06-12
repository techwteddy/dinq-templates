import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News and Events | Sails of Life Center',
  description: 'Latest news, events, useful information, and reports from the life of the Center for Medical Rehabilitation and Palliative Care for Children in Zhytomyr.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/news',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/novyny',
      'en-US': 'https://vitrylazhyttia.com.ua/en/news',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}