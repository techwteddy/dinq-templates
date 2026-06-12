import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Дитяча реабілітація | Центр Вітрила Життя',
  description: 'Стаття в.о. директора про важливість дитячої реабілітації, сучасні виклики, статистику ДЦП та майбутнє центру.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/reabilitatsiya',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/reabilitatsiya',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/rehabilitation',
    },
  },
};

export default function RehabilitationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}