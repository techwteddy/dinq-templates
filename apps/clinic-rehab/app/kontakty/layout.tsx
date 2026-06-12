import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Контакти | Центр Вітрила Життя Житомир',
  description: 'Зв\'яжіться з нами для консультації чи запису. Актуальна адреса, телефони, електронна пошта, графік роботи та схема проїзду до нашого центру.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/kontakty',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/kontakty',
      'en-US': 'https://vitrylazhyttia.com.ua/en/contacts',
    },
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}