import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Про нас | Центр Вітрила Життя',
  description: 'Дізнайтеся більше про нашу місію, цінності та історію. Ми створюємо комфортні умови для ефективної реабілітації та паліативної допомоги дітям.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/pro-nas',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/pro-nas',
      'en-US': 'https://vitrylazhyttia.com.ua/en/about-us',
    },
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}