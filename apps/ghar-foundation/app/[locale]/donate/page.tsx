import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getProjects, getSiteSettings, getDonatePage } from "@/sanity/lib/queries";
import DonateClient from "./DonateClient";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  const [projects, siteSettings, donatePage] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    getDonatePage(),
  ]);

  const heroImage = donatePage?.heroImage || "/images/HeroImage1.png";
  const heroTitle = locale === "ar" ? donatePage?.heroTitleAr : locale === "de" ? donatePage?.heroTitleDe : donatePage?.heroTitle;
  const heroSubtitle = locale === "ar" ? donatePage?.heroSubtitleAr : locale === "de" ? donatePage?.heroSubtitleDe : donatePage?.heroSubtitle;

  return (
    <div className="bg-background">
      <section className="relative h-[40vh]">
        <Image src={heroImage} alt="Donate" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>
      <DonateClient projects={projects} siteSettings={siteSettings} />
    </div>
  );
}