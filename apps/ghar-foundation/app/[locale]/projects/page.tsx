import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getProjects, getProjectsPage } from "@/sanity/lib/queries";
import { createClient } from "@supabase/supabase-js";
import ProjectsClient from "./ProjectsClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  const [projects, projectsPage, { data: donors }] = await Promise.all([
    getProjects(),
    getProjectsPage(),
    supabase
      .from("donors")
      .select("project, amount")
      .eq("status", "completed"),
  ]);

  // مجموع التبرعات المكتملة من Supabase لكل مشروع
  const raisedByProject: Record<string, number> = {};
  for (const donor of donors || []) {
    if (!donor.project || donor.project === "general" || donor.project === "zakat") continue;
    raisedByProject[donor.project] = (raisedByProject[donor.project] || 0) + (donor.amount || 0);
  }

  // إضافة الـ raised اليدوي من Sanity
  for (const project of projects) {
    raisedByProject[project.id] = (raisedByProject[project.id] || 0) + (project.raised || 0);
  }

  const heroImage = projectsPage?.heroImage || "/images/ProjectCards1.png";
  const heroTitle = locale === "ar" ? projectsPage?.heroTitleAr : locale === "de" ? projectsPage?.heroTitleDe : projectsPage?.heroTitle;
  const heroSubtitle = locale === "ar" ? projectsPage?.heroSubtitleAr : locale === "de" ? projectsPage?.heroSubtitleDe : projectsPage?.heroSubtitle;

  return (
    <div className="bg-background">
      <section className="relative h-[40vh]">
        <Image src={heroImage} alt="Our Projects" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>

      <ProjectsClient projects={projects} raisedByProject={raisedByProject} />

      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("ctaSubtitle")}</p>
          <Link href={`/${locale}/donate`} className="bg-secondary hover:bg-green-700 text-white px-12 py-3 rounded font-semibold text-lg transition-colors">
            {t("donateNow")}
          </Link>
        </div>
      </section>
    </div>
  );
}