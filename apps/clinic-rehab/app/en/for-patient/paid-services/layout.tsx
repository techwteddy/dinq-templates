import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paid Medical Services & Prices | Sails of Life Zhytomyr',
  description: 'Official list and prices of additional paid medical services, procedures, and consultations provided by our rehabilitation center.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/for-patient/paid-services',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/platni-poslugy',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/paid-services',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}