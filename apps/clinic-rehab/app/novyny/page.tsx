"use client";

import { useState, useMemo } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Newspaper, 
  RefreshCcw, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Search,
  Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header"; 
import Footer from "@/app/components/Footer"; 
import { newsData } from "@/app/data/news"; 

const MONTH_NAMES_UKR = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const monthMap: Record<string, number> = {
  "січня": 0, "лютого": 1, "березня": 2, "квітня": 3, "травня": 4, "червня": 5,
  "липня": 6, "серпня": 7, "вересня": 8, "жовтня": 9, "листопада": 10, "грудня": 11
};

const parseUkrDate = (dateStr: string) => {
  const parts = dateStr.toLowerCase().split(' ');
  if (parts.length >= 3) {
    const day = parseInt(parts[0]);
    const month = monthMap[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return new Date();
};

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Нові стани для фільтрів
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<{type: 'day' | 'month', date: Date} | null>(null);

  // Сортуємо новини за датою (від найновіших)
  const sortedNews = useMemo(() => {
    return [...newsData].sort((a, b) => parseUkrDate(b.date).getTime() - parseUkrDate(a.date).getTime());
  }, []);

  // Допоміжний Set для підсвітки днів у календарі
  const newsDatesSet = useMemo(() => {
    const dates = new Set<string>();
    sortedNews.forEach(news => {
      dates.add(parseUkrDate(news.date).toDateString());
    });
    return dates;
  }, [sortedNews]);

  // Головна логіка фільтрації (Пошук + Календар)
  const filteredNews = useMemo(() => {
    let result = sortedNews;

    // 1. Фільтр за пошуковим запитом
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(news => 
        news.title.toLowerCase().includes(query) || 
        news.excerpt.toLowerCase().includes(query)
      );
    }

    // 2. Фільтр за календарем (День або Місяць)
    if (activeFilter) {
      if (activeFilter.type === 'day') {
        result = result.filter(news => parseUkrDate(news.date).toDateString() === activeFilter.date.toDateString());
      } else if (activeFilter.type === 'month') {
        result = result.filter(news => {
          const d = parseUkrDate(news.date);
          return d.getMonth() === activeFilter.date.getMonth() && d.getFullYear() === activeFilter.date.getFullYear();
        });
      }
    }

    return result;
  }, [sortedNews, searchQuery, activeFilter]);

  // Відрізаємо для пагінації ("Завантажити ще")
  const displayNews = filteredNews.slice(0, visibleCount);

  const loadMore = () => setVisibleCount(prev => prev + 6);
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Очищення всіх фільтрів
  const clearFilters = () => {
    setActiveFilter(null);
    setSearchQuery("");
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateStr = date.toDateString();
      const hasNews = newsDatesSet.has(dateStr);
      
      const isSelectedDay = activeFilter?.type === 'day' && activeFilter.date.toDateString() === dateStr;
      const isSelectedMonth = activeFilter?.type === 'month' && activeFilter.date.getMonth() === currentMonth.getMonth() && activeFilter.date.getFullYear() === currentMonth.getFullYear();

      const isToday = new Date().toDateString() === dateStr;

      days.push(
        <button
          key={d}
          onClick={() => setActiveFilter(isSelectedDay ? null : { type: 'day', date })}
          disabled={!hasNews}
          className={`h-9 w-9 rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 ${
            isSelectedDay || (isSelectedMonth && hasNews)
              ? 'bg-blue-600 text-white shadow-lg scale-110 z-10' 
              : hasNews 
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 font-bold' 
                : 'text-slate-400 dark:text-slate-600 opacity-40'
          } ${isToday ? 'ring-2 ring-blue-500/70 dark:ring-blue-400/70 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''}`}
        >
          <span className="text-sm">{d}</span>
          {hasNews && !isSelectedDay && !isSelectedMonth && <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>}
        </button>
      );
    }
    return days;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Перевірка чи активний місяць в календарі зараз обраний як фільтр
  const isCurrentMonthFiltered = activeFilter?.type === 'month' && activeFilter.date.getMonth() === currentMonth.getMonth() && activeFilter.date.getFullYear() === currentMonth.getFullYear();

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500">
      
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16 text-center lg:text-left">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6">
                    <Newspaper size={16} /> Новини центру
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white leading-tight">
                    Будьте в курсі <span className="text-blue-600 dark:text-blue-400">подій</span>
                </h1>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* ЛІВА ЧАСТИНА: СТРІЧКА НОВИН ТА ПОШУК */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              
              {/* ПОЛЕ ПОШУКУ */}
              <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Шукати в новинах..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* РЕЗУЛЬТАТИ / СІТКА НОВИН */}
              {displayNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {displayNews.map((news) => (
                      <motion.article 
                        key={news.slug} 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                      >
                        <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-lg">
                            <CalendarIcon size={12} className="text-blue-600 dark:text-blue-400" />
                            {news.date}
                          </div>
                        </div>
                        <div className="p-7 flex flex-col flex-grow">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            <Link href={`/novyny/${news.slug}`}>{news.title}</Link>
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{news.excerpt}</p>
                          <Link href={`/novyny/${news.slug}`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mt-auto group/btn">
                            Докладніше <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-300 dark:border-slate-700">
                  <Filter size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Новин не знайдено</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">За вашими критеріями пошуку або обраною датою немає публікацій.</p>
                  <button onClick={clearFilters} className="px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                    Скинути всі фільтри
                  </button>
                </motion.div>
              )}

              {/* КНОПКА ЗАВАНТАЖИТИ ЩЕ */}
              {visibleCount < filteredNews.length && (
                <div className="mt-12 flex justify-center">
                  <button onClick={loadMore} className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm group">
                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Показати ще
                  </button>
                </div>
              )}
            </div>

            {/* ПРАВА ЧАСТИНА (SIDEBAR) */}
            <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24 space-y-8 h-fit self-start mb-12 lg:mb-0">
              
              {/* КАЛЕНДАР */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  
                  {/* КНОПКА ФІЛЬТРУ ЗА МІСЯЦЕМ */}
                  <button 
                    onClick={() => setActiveFilter(isCurrentMonthFiltered ? null : { type: 'month', date: currentMonth })}
                    className={`font-bold uppercase tracking-widest text-xs px-3 py-2 rounded-xl transition-colors ${
                      isCurrentMonthFiltered 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isCurrentMonthFiltered ? "Скинути фільтр" : "Показати всі новини за цей місяць"}
                  >
                    {MONTH_NAMES_UKR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </button>
                  
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 place-items-center">
                  {generateCalendarDays()}
                </div>

                {/* ІНФО-БЛОК АКТИВНОГО ФІЛЬТРА */}
                {/* ІНФО-БЛОК АКТИВНОГО ФІЛЬТРА */}
                {(activeFilter || searchQuery) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 font-bold text-center">Активні фільтри</div>
                    
                    {/* ПЛАШКИ З ФІЛЬТРАМИ */}
                    <div className="flex flex-col gap-2 mb-4">
                      {searchQuery && (
                        <div className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-2.5 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-700">
                          <span className="truncate pr-2"><span className="font-bold text-slate-800 dark:text-slate-100">Пошук:</span> {searchQuery}</span>
                          <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"><X size={14} /></button>
                        </div>
                      )}
                      
                      {activeFilter?.type === 'day' && (
                        <div className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-2.5 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-700">
                          <span><span className="font-bold text-slate-800 dark:text-slate-100">Дата:</span> {activeFilter.date.toLocaleDateString('uk-UA')}</span>
                          <button onClick={() => setActiveFilter(null)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"><X size={14} /></button>
                        </div>
                      )}

                      {activeFilter?.type === 'month' && (
                        <div className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-2.5 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-700">
                          <span><span className="font-bold text-slate-800 dark:text-slate-100">Місяць:</span> {MONTH_NAMES_UKR[activeFilter.date.getMonth()]} {activeFilter.date.getFullYear()}</span>
                          <button onClick={() => setActiveFilter(null)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"><X size={14} /></button>
                        </div>
                      )}
                    </div>

                    {/* ЗАГАЛЬНА КНОПКА СКИНУТИ ВСЕ */}
                    <button 
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                        <X size={14} /> Скинути всі
                    </button>
                  </motion.div>
                )}
              </div>

              {/* СОЦМЕРЕЖІ */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hidden lg:block">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-xs uppercase tracking-widest text-center">Ми у соцмережах</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://www.facebook.com/vitrylazhyttia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#1877F2] transition-colors">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-slate-500">Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/babyzthouse/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#E4405F] transition-colors">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span className="text-[10px] font-bold text-slate-500">Instagram</span>
                  </a>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}