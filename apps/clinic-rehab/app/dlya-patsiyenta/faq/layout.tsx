import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Часті запитання (FAQ) | Центр Вітрила Життя',
  description: 'Відповіді на часті запитання пацієнтів та їхніх родичів про реабілітацію, паліативну допомогу, необхідні документи та графік роботи центру.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/faq',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/faq',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/faq',
    },
  },
};

export default function FAQLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
