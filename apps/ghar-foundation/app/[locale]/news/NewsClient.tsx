"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const ITEMS_PER_PAGE = 10;

type NewsItem = {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  titleDe: string;
  excerpt: string;
  excerptAr: string;
  excerptDe: string;
  date: string;
  category: string;
};

export default function NewsClient({ news }: { news: NewsItem[] }) {
  const [activeYear, setActiveYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("news");
  const locale = useLocale();

  const getTitle = (n: NewsItem) => locale === "ar" ? n.titleAr : locale === "de" ? n.titleDe : n.title;
  const getExcerpt = (n: NewsItem) => locale === "ar" ? n.excerptAr : locale === "de" ? n.excerptDe : n.excerpt;

  const years = [...new Set(news.map((n) => new Date(n.date).getFullYear().toString()))].sort((a, b) => parseInt(b) - parseInt(a));

  const filtered = activeYear === "All"
    ? news
    : news.filter((n) => new Date(n.date).getFullYear().toString() === activeYear);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleYearChange = (year: string) => {
    setActiveYear(year);
    setCurrentPage(1);
  };

  const yearFilters = [
    { key: "All", label: t("filterAll") },
    ...years.map((y) => ({ key: y, label: y })),
  ];

  return (
    <>
      {/* Filter Bar */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex gap-3 justify-center flex-wrap">
          {yearFilters.map((year) => (
            <button
              key={year.key}
              onClick={() => handleYearChange(year.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeYear === year.key
                  ? "bg-primary text-white"
                  : "bg-white text-dark border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {year.label}
            </button>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          {t("articlesFound", { count: filtered.length })}
        </p>
      </section>

      {/* News Grid */}
      <section className="pb-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginated.map((item) => (
            <Link key={item.id} href={`/${locale}/news/${item.id}`} className="flex gap-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative w-40 h-full min-h-[120px] shrink-0">
                <Image src={item.image || "/images/NewsSection1.png"} alt={getTitle(item)} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                  </div>
                  <h3 className="text-dark font-semibold text-sm leading-snug mb-2 group-hover:underline">{getTitle(item)}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{getExcerpt(item)}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                  <span className="text-primary text-xs group-hover:underline font-medium">
                    {t("readMore")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="pb-16 px-4 max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-dark hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> {t("previous")}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-gray-200 text-dark hover:border-primary hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-dark hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("next")} <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-center text-gray-400 text-xs mt-3">
            {t("pageOf", { current: currentPage, total: totalPages })}
          </p>
        </section>
      )}
    </>
  );
}