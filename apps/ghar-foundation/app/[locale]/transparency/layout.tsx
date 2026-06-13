import type { Metadata } from 'next';

const titles: Record<string, string> = {
  en: 'Transparency | GHAR Organization',
  ar: 'الشفافية | مؤسسة غار',
  de: 'Transparenz | GHAR Organization',
};

const descriptions: Record<string, string> = {
  en: 'GHAR Organization financial reports, donation allocation, governance structure, and certifications. Full transparency guaranteed.',
  ar: 'التقارير المالية لمؤسسة غار، توزيع التبرعات، هيكل الحوكمة، والشهادات. شفافية كاملة مضمونة.',
  de: 'Finanzberichte, Spendenverwendung, Governance-Struktur und Zertifizierungen der GHAR Organization. Volle Transparenz garantiert.',
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

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}