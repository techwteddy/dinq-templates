import type { Metadata } from 'next';

const titles: Record<string, string> = {
  en: 'Donate | GHAR Organization',
  ar: 'تبرع | مؤسسة غار',
  de: 'Spenden | GHAR Organization',
};

const descriptions: Record<string, string> = {
  en: 'Donate to GHAR Organization and directly fund humanitarian projects in Sudan and Yemen. One-time or monthly donations via PayPal. Zakat eligible.',
  ar: 'تبرع لمؤسسة غار وموّل مباشرة المشاريع الإنسانية في السودان واليمن. تبرع لمرة واحدة أو شهري عبر PayPal. مقبول للزكاة.',
  de: 'Spenden Sie an die GHAR Organization und finanzieren Sie direkt humanitäre Projekte im Sudan und Jemen. Zakat-berechtigt.',
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

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}