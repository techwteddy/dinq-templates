import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacts | Sails of Life Center Zhytomyr',
  description: 'Contact us for a consultation or appointment. Current address, phone numbers, email, working hours, and directions to our center.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/en/contacts',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/kontakty',
      'en-US': 'https://vitrylazhyttia.com.ua/en/contacts',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}