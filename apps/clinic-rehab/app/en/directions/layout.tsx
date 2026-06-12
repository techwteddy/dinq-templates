import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rehabilitation and Care Directions | Sails of Life',
  description: 'We provide comprehensive services in physical rehabilitation, psychological support, speech therapy correction, and palliative care for children in Zhytomyr.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/directions',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/napryamky',
      'en-US': 'https://vitrylazhyttia.com.ua/en/directions',
    },
  }, 
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}