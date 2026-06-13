import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });
  return {
    title: locale === "de" ? "Impressum | GHAR Organization" : locale === "ar" ? "بيانات قانونية | مؤسسة غار" : "Impressum | GHAR Organization",
    description: t("metaDescription"),
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });

  return (
    <div className="bg-background min-h-screen">

      {/* Hero */}
      <section className="bg-primary py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white">{t("heroTitle")}</h1>
        <p className="text-white/70 mt-3 text-lg">{t("heroSubtitle")}</p>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-3xl mx-auto">

        {/* Section 1 - Legal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section1Title")}</h2>
          <div className="space-y-1 text-gray-600 text-sm leading-relaxed">
            <p className="font-semibold text-dark">German Humanitarian Relief Organization e.V.</p>
            <p>Kulenkampffallee 193</p>
            <p>28213 Bremen, Deutschland</p>
          </div>
        </div>

        {/* Section 2 - Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section2Title")}</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>
              <span className="font-medium text-dark">{t("phone")}</span>{" "}
              <a href="tel:+4901772839465" className="text-primary hover:underline">+49 01772839465</a>
            </p>
            <p>
              <span className="font-medium text-dark">{t("email")}</span>{" "}
              <a href="mailto:info@ghar-ngo.com" className="text-primary hover:underline">info@ghar-ngo.com</a>
            </p>
            <p>
              <span className="font-medium text-dark">{t("website")}</span>{" "}
              <a href="https://www.ghar-ngo.com" className="text-primary hover:underline">www.ghar-ngo.com</a>
            </p>
          </div>
        </div>

        {/* Section 3 - Register */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section3Title")}</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>
              <span className="font-medium text-dark">{t("registerNumber")}</span>{" "}
              VR 8792 HB
            </p>
            <p>
              <span className="font-medium text-dark">{t("registerCourt")}</span>{" "}
              Amtsgericht Bremen
            </p>
            <p>
              <span className="font-medium text-dark">{t("taxNumber")}</span>{" "}
              60/147/03398
            </p>
          </div>
        </div>

        {/* Section 4 - Board */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section4Title")}</h2>
          <div className="space-y-3 text-gray-600 text-sm">
            <div>
              <p className="font-medium text-dark">{t("chair1")}</p>
              <p>Eman Saad</p>
            </div>
            <div>
              <p className="font-medium text-dark">{t("chair2")}</p>
              <p>Aya Ayoub</p>
            </div>
            <div>
              <p className="font-medium text-dark">{t("treasurer")}</p>
              <p>Ibrahim Mohamed Ahmed Abusaif</p>
            </div>
          </div>
        </div>

        {/* Section 5 - Responsible */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section5Title")}</h2>
          <div className="text-gray-600 text-sm space-y-1">
            <p className="font-medium text-dark">Eman Saad</p>
            <p>Kulenkampffallee 193</p>
            <p>28213 Bremen, Deutschland</p>
          </div>
        </div>

        {/* Section 6 - Streitschlichtung */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section6Title")}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{t("section6Text")}</p>
        </div>

        {/* Section 7 - Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-dark mb-4">{t("section7Title")}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{t("section7Text")}</p>
        </div>

        {/* Back link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          {t("backHome")}
        </Link>

      </section>
    </div>
  );
}