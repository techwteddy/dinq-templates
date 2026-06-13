"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Users, Heart, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, divRef };
}

type Project = {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  titleDe: string;
  desc: string;
  descAr: string;
  descDe: string;
  countryCode: string;
  category: string;
  raised: number;
  goal: number;
};

type NewsItem = {
  id: number;
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

type HeroSlide = {
  image: string;
  title: string;
  titleAr: string;
  titleDe: string;
  subtitle: string;
  subtitleAr: string;
  subtitleDe: string;
};

type Stat = {
  number: number;
  label: string;
  labelAr: string;
  labelDe: string;
};

type HomeContent = {
  quote: string;
  quoteAr: string;
  quoteDe: string;
} | null;

export default function HomeClient({
  projects,
  news,
  heroSlides,
  stats,
  homeContent,
  raisedByProject,
}: {
  projects: Project[];
  news: NewsItem[];
  heroSlides: HeroSlide[];
  stats: Stat[];
  homeContent: HomeContent;
  raisedByProject: Record<string, number>;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("home");
  const locale = useLocale();

  const slides = heroSlides.length > 0 ? heroSlides : [];

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const counter1 = useCounter(stats[0]?.number || 0);
  const counter2 = useCounter(stats[1]?.number || 0);
  const counter3 = useCounter(stats[2]?.number || 0);

  const getTitle = (p: Project) => locale === "ar" ? p.titleAr : locale === "de" ? p.titleDe : p.title;
  const getDesc = (p: Project) => locale === "ar" ? p.descAr : locale === "de" ? p.descDe : p.desc;
  const getNewsTitle = (n: NewsItem) => locale === "ar" ? n.titleAr : locale === "de" ? n.titleDe : n.title;
  const getNewsExcerpt = (n: NewsItem) => locale === "ar" ? n.excerptAr : locale === "de" ? n.excerptDe : n.excerpt;
  const getSlideTitle = (s: HeroSlide) => locale === "ar" ? s.titleAr : locale === "de" ? s.titleDe : s.title;
  const getSlideSubtitle = (s: HeroSlide) => locale === "ar" ? s.subtitleAr : locale === "de" ? s.subtitleDe : s.subtitle;
  const getStatLabel = (s: Stat) => locale === "ar" ? s.labelAr : locale === "de" ? s.labelDe : s.label;

  const getQuote = () => {
    if (!homeContent) return t("quote");
    return locale === "ar" ? homeContent.quoteAr : locale === "de" ? homeContent.quoteDe : homeContent.quote;
  };

  if (slides.length === 0) return null;

  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[85vh]">
          {slides.map((slide, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <Image
                src={slide.image || "/images/HeroImage1.png"}
                alt={`Slide ${i + 1}`}
                fill className="object-cover" priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl transition-all duration-700">
              {getSlideTitle(slides[currentSlide]).split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-xl transition-all duration-700">
              {getSlideSubtitle(slides[currentSlide])}
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
          <div className="hidden md:block absolute bottom-6 right-8 md:right-20">
            <Link href={`/${locale}/donate`} className="bg-secondary hover:bg-green-700 text-white px-8 py-3 rounded font-semibold text-lg transition-colors">
              {t("donateNow")}
            </Link>
          </div>
        </div>
        <div className="md:hidden flex justify-center py-4 bg-background">
          <Link href={`/${locale}/donate`} className="bg-secondary hover:bg-green-700 text-white px-10 py-3 rounded font-semibold text-lg transition-colors">
            {t("donateNow")}
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("projects")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((project, i) => (
            <Link key={i} href={`/${locale}/projects/${project.id}`} className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src={project.image || "/images/ProjectCards1.png"}
                  alt={getTitle(project)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-primary font-semibold uppercase mb-1">{project.countryCode}</span>
                <h3 className="text-dark font-bold text-base mb-2">{getTitle(project)}</h3>
                <p className="text-gray-500 text-sm flex-grow leading-relaxed group-hover:underline">{getDesc(project)}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{t("raised")}: €{(raisedByProject[project.id] || 0).toLocaleString()}</span>
                    <span>{t("goal")}: €{(project.goal || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full"
                      style={{ width: `${Math.min(Math.round(((raisedByProject[project.id] || 0) / (project.goal || 1)) * 100), 100)}%` }} />
                  </div>
                  <p className="text-xs text-primary font-semibold mt-1">
                    {Math.min(Math.round(((raisedByProject[project.id] || 0) / (project.goal || 1)) * 100), 100)}% {t("funded")}
                  </p>
                </div>
                <span className="mt-2 text-primary text-xs group-hover:underline">
                  {t("readMore")}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/${locale}/donate?project=${project.id}`; }}
                  className="mt-4 bg-secondary hover:bg-green-700 text-white text-center py-2 rounded font-medium text-sm transition-colors w-full"
                >
                  {t("donate")}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center px-4">
          <span className="text-6xl text-primary font-serif leading-none">&ldquo;</span>
          <p className="text-xl md:text-2xl text-dark font-medium italic mt-2">{getQuote()}</p>
          <span className="text-6xl text-primary font-serif leading-none">&rdquo;</span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div ref={counter1.divRef} className="flex flex-col items-center gap-3 p-8 border border-gray-100 rounded-xl">
            <Users size={32} className="text-primary" />
            <span className="text-4xl font-bold text-dark">{counter1.count.toLocaleString()}+</span>
            <span className="text-gray-500 text-sm">{stats[0] ? getStatLabel(stats[0]) : ''}</span>
          </div>
          <div ref={counter2.divRef} className="flex flex-col items-center gap-3 p-8 border border-gray-100 rounded-xl">
            <Heart size={32} className="text-primary" />
            <span className="text-4xl font-bold text-dark">{counter2.count.toLocaleString()}+</span>
            <span className="text-gray-500 text-sm">{stats[1] ? getStatLabel(stats[1]) : ''}</span>
          </div>
          <div ref={counter3.divRef} className="flex flex-col items-center gap-3 p-8 border border-gray-100 rounded-xl">
            <Globe size={32} className="text-primary" />
            <span className="text-4xl font-bold text-dark">{counter3.count}+</span>
            <span className="text-gray-500 text-sm">{stats[2] ? getStatLabel(stats[2]) : ''}</span>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-dark">{t("latestNews")}</h2>
          <Link href={`/${locale}/news`} className="text-primary hover:underline text-sm font-medium">
            {t("viewAllNews")}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.slice(0, 4).map((item, i) => (
            <Link key={i} href={`/${locale}/news/${item.id}`} className="flex gap-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative w-36 h-full min-h-[100px] shrink-0">
                <Image src={item.image || "/images/NewsSection1.png"} alt={getNewsTitle(item)} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-xs text-primary font-semibold mb-2">{item.date}</span>
                <h3 className="text-dark font-semibold text-sm leading-snug mb-2 group-hover:underline">{getNewsTitle(item)}</h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{getNewsExcerpt(item)}</p>
                <span className="text-primary text-xs mt-3 group-hover:underline">{t("readMore")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}