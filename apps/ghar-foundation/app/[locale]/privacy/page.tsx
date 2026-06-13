import Link from "next/link";
import { Shield } from "lucide-react";
import { getPrivacyContent } from "@/sanity/lib/queries";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const privacyContent = await getPrivacyContent();

  const titles: Record<string, string> = {
    en: "Privacy Policy",
    ar: "سياسة الخصوصية",
    de: "Datenschutzrichtlinie",
  };

  const backLinks: Record<string, string> = {
    en: "← Back to Home",
    ar: "← العودة للرئيسية",
    de: "← Zurück zur Startseite",
  };

  const content = locale === "ar"
    ? privacyContent?.contentAr
    : locale === "de"
    ? privacyContent?.contentDe
    : privacyContent?.contentEn;

  const lastUpdated = privacyContent?.lastUpdated || "March 2026";

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="bg-primary py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Shield size={48} className="text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">{titles[locale] || titles.en}</h1>
          <p className="text-white/70 text-sm">{lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <pre className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </pre>
        </div>

        <div className="mt-10 text-center">
          <Link href={`/${locale}`} className="text-primary hover:underline text-sm font-medium">
            {backLinks[locale] || backLinks.en}
          </Link>
        </div>
      </section>

    </div>
  );
}