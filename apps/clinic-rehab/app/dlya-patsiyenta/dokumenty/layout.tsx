import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Дитяча реабілітація: що потрібно знати | Вітрила Життя',
  description: 'Важлива інформація про процес дитячої реабілітації. Як підготуватися, які методи ми використовуємо та що очікувати від курсу відновлення.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/dokumenty',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/dokumenty',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/documents',
    },
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}