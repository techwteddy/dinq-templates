import type { Metadata } from 'next';

const titles: Record<string, string> = {
  en: 'Volunteer | GHAR Organization',
  ar: 'تطوع | مؤسسة غار',
  de: 'Ehrenamt | GHAR Organization',
};

const descriptions: Record<string, string> = {
  en: 'Volunteer with GHAR Organization and make a real difference in Sudan and Yemen. Apply online and join our humanitarian team.',
  ar: 'تطوع مع مؤسسة غار وأحدث فارقاً حقيقياً في السودان واليمن. قدّم طلبك عبر الإنترنت وانضم لفريقنا الإنساني.',
  de: 'Engagieren Sie sich ehrenamtlich bei der GHAR Organization und helfen Sie im Sudan und Jemen. Jetzt online bewerben.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}