import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Допомога центру | Центр Вітрила Життя',
  description: 'Дізнайтеся, як допомогти нашому центру: фінансові реквізити, перелік актуальних потреб та онлайн-форма волонтера.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/dopomoga',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dopomoga',
      'en-US': 'https://vitrylazhyttia.com.ua/en/help',
    },
  },
};

export default function HelpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
