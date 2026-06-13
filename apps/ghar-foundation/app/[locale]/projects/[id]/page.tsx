import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { getCountryName } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);

async function getProject(id: string) {
  try {
    return await client.fetch(`
      *[_type == "project" && slug.current == $id][0] {
        "id": slug.current,
        "image": image.asset->url,
        "title": title.en,
        "titleAr": title.ar,
        "titleDe": title.de,
        countryCode,
        category,
        "raised": coalesce(raised, 0),
        "goal": coalesce(goal, 1),
        "details": details.en,
        "detailsAr": details.ar,
        "detailsDe": details.de,
        impact,
        "gallery": gallery[].asset->url,
      }
    `, { id });
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const project = await getProject(id);

  if (!project) notFound();

  // جلب التبرعات المكتملة من Supabase لهذا المشروع
  const { data: donors } = await supabase
    .from("donors")
    .select("amount")
    .eq("project", id)
    .eq("status", "completed");

  const supabaseRaised = (donors || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalRaised = (project.raised || 0) + supabaseRaised;
  const progress = Math.min(Math.round((totalRaised / (project.goal || 1)) * 100), 100);

  const getTitle = () => locale === "ar" ? project.titleAr : locale === "de" ? project.titleDe : project.title;
  const getDetails = () => locale === "ar" ? project.detailsAr : locale === "de" ? project.detailsDe : project.details;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[50vh]">
        <Image src={project.image || "/images/ProjectCards1.png"} alt={getTitle()} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <Link href={`/${locale}/projects`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> {t("readMore").replace("→", "").trim()}
          </Link>
          <span className="text-white/70 text-sm mb-2">
            {getCountryName(project.countryCode, locale)} • {project.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">{getTitle()}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-dark mb-4">
              {locale === "ar" ? "عن هذا المشروع" : locale === "de" ? "Über dieses Projekt" : "About This Project"}
            </h2>
            <p className="text-gray-600 leading-relaxed text-base mb-8">{getDetails()}</p>

            <h2 className="text-2xl font-bold text-dark mb-4">
              {locale === "ar" ? "تأثيرنا" : locale === "de" ? "Unsere Wirkung" : "Our Impact"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {project.impact?.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                  <span className="text-secondary font-bold text-lg">✓</span>
                  <span className="text-dark text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {project.gallery?.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-dark mb-4">
                  {locale === "ar" ? "معرض الصور" : locale === "de" ? "Galerie" : "Gallery"}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {project.gallery.map((img: string, i: number) => (
                    <div key={i} className="relative h-32 rounded-xl overflow-hidden">
                      <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-dark font-bold text-lg mb-4">
                {locale === "ar" ? "ادعم هذا المشروع" : locale === "de" ? "Dieses Projekt unterstützen" : "Support This Project"}
              </h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{t("raised")}: €{totalRaised.toLocaleString()}</span>
                  <span>{t("goal")}: €{(project.goal || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-secondary h-3 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-primary font-bold mt-2">{progress}% {t("funded")}</p>
              </div>
              <Link href={`/${locale}/donate?project=${project.id}`} className="block bg-secondary hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-colors mb-3">
                {t("donateNow")}
              </Link>
              <Link href={`/${locale}/projects`} className="block text-primary text-center py-3 rounded-lg font-semibold transition-colors border border-primary hover:bg-primary/5">
                {locale === "ar" ? "كل المشاريع" : locale === "de" ? "Alle Projekte" : "View All Projects"}
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}