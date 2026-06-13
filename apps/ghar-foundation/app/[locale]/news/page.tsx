import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getNews, getNewsPage } from "@/sanity/lib/queries";
import NewsClient from "./NewsClient";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const [news, newsPage] = await Promise.all([
    getNews(),
    getNewsPage(),
  ]);

  const heroImage = newsPage?.heroImage || "/images/NewsSection1.png";
  const heroTitle = locale === "ar" ? newsPage?.heroTitleAr : locale === "de" ? newsPage?.heroTitleDe : newsPage?.heroTitle;
  const heroSubtitle = locale === "ar" ? newsPage?.heroSubtitleAr : locale === "de" ? newsPage?.heroSubtitleDe : newsPage?.heroSubtitle;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[40vh]">
        <Image src={heroImage} alt="News" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>

      <NewsClient news={news} />

    </div>
  );
}