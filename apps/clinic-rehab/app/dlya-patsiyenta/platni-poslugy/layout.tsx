import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Платні медичні послуги та ціни | Вітрила Життя Житомир',
  description: 'Офіційний перелік та вартість додаткових платних медичних послуг, процедур і консультацій, які надає наш реабілітаційний центр.',
  alternates: {
    canonical: 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/platni-poslugy',
    languages: {
      'uk-UA': 'https://vitrylazhyttia.com.ua/dlya-patsiyenta/platni-poslugy',
      'en-US': 'https://vitrylazhyttia.com.ua/en/for-patient/paid-services',
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}