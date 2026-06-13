import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { getJobs, getJobsPage } from "@/sanity/lib/queries";

type Job = {
  id: string;
  title: string;
  titleAr: string;
  titleDe: string;
  desc: string;
  descAr: string;
  descDe: string;
  type: string;
  location: string;
  applyEmail: string;
};

const typeColors: Record<string, string> = {
  'full-time': 'bg-primary/10 text-primary',
  'part-time': 'bg-accent/10 text-accent',
  'volunteer': 'bg-secondary/10 text-secondary',
};

const typeLabels: Record<string, Record<string, string>> = {
  'full-time': { en: 'Full-time', ar: 'دوام كامل', de: 'Vollzeit' },
  'part-time': { en: 'Part-time', ar: 'دوام جزئي', de: 'Teilzeit' },
  'volunteer': { en: 'Volunteer', ar: 'تطوع', de: 'Freiwillig' },
};

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  const [jobs, jobsPage] = await Promise.all([
    getJobs(),
    getJobsPage(),
  ]);

  const heroImage = jobsPage?.heroImage || "/images/HeroImage2.png";
  const heroTitle = locale === "ar" ? jobsPage?.heroTitleAr : locale === "de" ? jobsPage?.heroTitleDe : jobsPage?.heroTitle;
  const heroSubtitle = locale === "ar" ? jobsPage?.heroSubtitleAr : locale === "de" ? jobsPage?.heroSubtitleDe : jobsPage?.heroSubtitle;

  const getTitle = (job: Job) => locale === "ar" ? job.titleAr : locale === "de" ? job.titleDe : job.title;
  const getDesc = (job: Job) => locale === "ar" ? job.descAr : locale === "de" ? job.descDe : job.desc;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[40vh]">
        <Image src={heroImage} alt="Jobs" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("noJobs")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job: Job) => (
              <Link key={job.id} href={`/${locale}/jobs/${job.id}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-dark font-bold text-lg">{getTitle(job)}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${typeColors[job.type] || 'bg-gray-100 text-gray-500'}`}>
                      {typeLabels[job.type]?.[locale] || job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={12} />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{getDesc(job)}</p>
                  <span className="text-primary text-sm font-medium hover:underline">{t("viewDetails")} →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("ctaSubtitle")}</p>
          <Link href={`/${locale}/volunteer`} className="bg-secondary hover:bg-green-700 text-white px-12 py-3 rounded font-semibold text-lg transition-colors">
            {t("volunteerWithUs")}
          </Link>
        </div>
      </section>

    </div>
  );
}