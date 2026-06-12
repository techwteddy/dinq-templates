import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Напрямки реабілітації та допомоги | Вітрила Життя',
  description: 'Надаємо комплексні послуги з фізичної реабілітації, психологічної підтримки, логопедичної корекції та паліативної допомоги дітям у Житомирі.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/napryamky',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/napryamky',
      'en-US': 'https://vitrylazhyttia.com.ua/en/directions',
    },
  }, 
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}