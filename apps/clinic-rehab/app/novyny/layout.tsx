import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Новини та події центру | Вітрила Життя',
  description: 'Останні новини, події, корисна інформація та звіти з життя Центру медичної реабілітації та паліативної допомоги дітям у Житомирі.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/novyny',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/novyny',
      'en-US': 'https://vitrylazhyttia.com.ua/en/news',
    },
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}