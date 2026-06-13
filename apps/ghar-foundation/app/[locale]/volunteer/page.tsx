import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getJobs, getVolunteerPage } from "@/sanity/lib/queries";
import VolunteerClient from "./VolunteerClient";

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "volunteer" });
  const [jobs, volunteerPage] = await Promise.all([
    getJobs(),
    getVolunteerPage(),
  ]);

  const heroImage = volunteerPage?.heroImage || "/images/HeroImage2.png";
  const heroTitle = locale === "ar" ? volunteerPage?.heroTitleAr : locale === "de" ? volunteerPage?.heroTitleDe : volunteerPage?.heroTitle;
  const heroSubtitle = locale === "ar" ? volunteerPage?.heroSubtitleAr : locale === "de" ? volunteerPage?.heroSubtitleDe : volunteerPage?.heroSubtitle;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[40vh]">
        <Image src={heroImage} alt="Volunteer" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>

      <VolunteerClient jobs={jobs} />

    </div>
  );
}