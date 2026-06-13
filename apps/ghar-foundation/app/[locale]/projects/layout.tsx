import type { Metadata } from 'next';

const titles: Record<string, string> = {
  en: 'Our Projects | GHAR Organization',
  ar: 'مشاريعنا | مؤسسة غار',
  de: 'Unsere Projekte | GHAR Organization',
};

const descriptions: Record<string, string> = {
  en: 'Explore GHAR Organization projects in Sudan and Yemen — clean water, food aid, medical camps, education, and emergency shelter.',
  ar: 'اكتشف مشاريع مؤسسة غار في السودان واليمن — مياه نظيفة، إغاثة غذائية، مخيمات طبية، تعليم، ومأوى طارئ.',
  de: 'Entdecken Sie die Projekte der GHAR Organization im Sudan und Jemen — sauberes Wasser, Nahrungsmittelhilfe, medizinische Lager und mehr.',
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

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}