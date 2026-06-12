import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vacancies | Sails of Life Center Zhytomyr',
  description: 'Join our team of professionals! Open vacancies for doctors, rehabilitation specialists, psychologists, and nurses in Zhytomyr.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/vacancy',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/vakansiyi',
      'en-US': 'https://vitrylazhyttia.com.ua/en/vacancy',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}