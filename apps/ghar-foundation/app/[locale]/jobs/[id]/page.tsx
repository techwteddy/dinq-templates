import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

async function getJob(id: string) {
  try {
    return await client.fetch(`
      *[_type == "job" && slug.current == $id][0] {
        "id": slug.current,
        "title": title.en,
        "titleAr": title.ar,
        "titleDe": title.de,
        "desc": desc.en,
        "descAr": desc.ar,
        "descDe": desc.de,
        "requirements": requirements.en,
        "requirementsAr": requirements.ar,
        "requirementsDe": requirements.de,
        type,
        location,
        applyEmail,
      }
    `, { id });
  } catch {
    return null;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  const job = await getJob(id);

  if (!job) notFound();

  const getTitle = () => locale === "ar" ? job.titleAr : locale === "de" ? job.titleDe : job.title;
  const getDesc = () => locale === "ar" ? job.descAr : locale === "de" ? job.descDe : job.desc;
  const getRequirements = () => locale === "ar" ? job.requirementsAr : locale === "de" ? job.requirementsDe : job.requirements;

  const typeLabels: Record<string, Record<string, string>> = {
    'full-time': { en: 'Full-time', ar: 'دوام كامل', de: 'Vollzeit' },
    'part-time': { en: 'Part-time', ar: 'دوام جزئي', de: 'Teilzeit' },
    'volunteer': { en: 'Volunteer', ar: 'تطوع', de: 'Freiwillig' },
  };

  const typeColors: Record<string, string> = {
    'full-time': 'bg-primary/10 text-primary',
    'part-time': 'bg-accent/10 text-accent',
    'volunteer': 'bg-secondary/10 text-secondary',
  };

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[35vh]">
        <Image src="/images/HeroImage2.png" alt={getTitle()} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <Link href={`/${locale}/jobs`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> {t("backToJobs")}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColors[job.type] || 'bg-gray-100'}`}>
              {typeLabels[job.type]?.[locale] || job.type}
            </span>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <MapPin size={12} />
              <span>{job.location}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white max-w-2xl">{getTitle()}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">
                {locale === "ar" ? "عن الوظيفة" : locale === "de" ? "Über die Stelle" : "About the Role"}
              </h2>
              <p className="text-gray-600 leading-relaxed">{getDesc()}</p>
            </div>

            {getRequirements() && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">
                  {locale === "ar" ? "المتطلبات" : locale === "de" ? "Anforderungen" : "Requirements"}
                </h2>
                <p className="text-gray-600 leading-relaxed">{getRequirements()}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-dark font-bold text-lg mb-6">{t("applyNow")}</h3>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{locale === "ar" ? "الموقع" : locale === "de" ? "Standort" : "Location"}</p>
                    <p className="text-dark text-sm font-medium">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{locale === "ar" ? "البريد الإلكتروني" : locale === "de" ? "E-Mail" : "Apply via Email"}</p>
                    <a href={`mailto:${job.applyEmail}?subject=Application: ${getTitle()}`}
                      className="text-primary text-sm font-medium hover:underline">
                      {job.applyEmail}
                    </a>
                  </div>
                </div>
              </div>

              <a href={`mailto:${job.applyEmail}?subject=Application: ${getTitle()}`}
                className="block w-full bg-primary hover:bg-blue-800 text-white text-center py-3 rounded-lg font-semibold transition-colors mb-3">
                {t("applyNow")}
              </a>
              <Link href={`/${locale}/jobs`}
                className="block w-full text-primary text-center py-3 rounded-lg font-semibold transition-colors border border-primary hover:bg-primary/5">
                {t("backToJobs")}
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}