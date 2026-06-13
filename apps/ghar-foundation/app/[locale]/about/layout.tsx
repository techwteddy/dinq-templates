import type { Metadata } from 'next';

const titles: Record<string, string> = {
  en: 'About Us | GHAR Organization',
  ar: 'من نحن | مؤسسة غار',
  de: 'Über uns | GHAR Organization',
};

const descriptions: Record<string, string> = {
  en: 'Learn about GHAR Organization — our story, mission, vision, values, and team dedicated to humanitarian aid in Sudan and Yemen.',
  ar: 'تعرف على مؤسسة غار — قصتنا، مهمتنا، رؤيتنا، قيمنا، وفريقنا المكرس للعمل الإنساني في السودان واليمن.',
  de: 'Erfahren Sie mehr über die GHAR Organization — unsere Geschichte, Mission, Vision, Werte und unser Team.',
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

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}