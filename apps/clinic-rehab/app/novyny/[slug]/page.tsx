import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, PhoneCall, Clock } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { newsData } from "@/app/data/news";
import PhotoCarousel from "@/app/components/PhotoCarousel";

export const runtime = 'edge';

// Словник та функція для правильного сортування новин за датою (як на головній)
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

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Сортуємо всі новини від найновіших до найстаріших
  const sortedNews = [...newsData].sort((a, b) => parseUkrDate(b.date).getTime() - parseUkrDate(a.date).getTime());
  
  // Знаходимо індекс поточної новини
  const currentIndex = sortedNews.findIndex((n) => n.slug === resolvedParams.slug);

  if (currentIndex === -1) {
    notFound();
  }

  const newsItem = sortedNews[currentIndex];
  
  // Визначаємо сусідні новини (Next - новіша, Prev - старіша)
  const nextNews = currentIndex > 0 ? sortedNews[currentIndex - 1] : null;
  const prevNews = currentIndex < sortedNews.length - 1 ? sortedNews[currentIndex + 1] : null;

  // Відбираємо 3 останні новини для бокової панелі (без поточної)
  const recentNews = sortedNews.filter((n) => n.slug !== newsItem.slug).slice(0, 3);

  return (
    // ПРИБРАНО overflow-x-hidden для коректної роботи sticky sidebar
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 bg-white dark:bg-slate-950">
      
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 max-w-7xl mx-auto px-6 relative z-10">
        
        <Link href="/novyny" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-8 font-semibold">
          <ArrowLeft size={20} /> До всіх новин
        </Link>

        {/* СІТКА: СТАТТЯ + БІЧНА ПАНЕЛЬ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* КОЛОНКА 1: ОСНОВНА СТАТТЯ (8 колонок) */}
            <article className="lg:col-span-8">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 font-medium">
                    <Calendar size={18} className="text-blue-500" />
                    <span>{newsItem.date}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10 text-slate-900 dark:text-white leading-[1.2]">
                    {newsItem.title}
                </h1>

                <PhotoCarousel images={newsItem.images && newsItem.images.length > 0 ? newsItem.images : [newsItem.image]} />

                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 md:p-12 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    {newsItem.content.map((block: any, index: number) => {
                    if (block.type === "paragraph") {
                        return <p key={index} className="mb-6" dangerouslySetInnerHTML={{ __html: block.value }} />;
                    }
                    if (block.type === "heading") {
                        return <h2 key={index} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: block.value }} />;
                    }
                    if (block.type === "list") {
                        return (
                        <ul key={index} className="list-disc pl-6 mb-6 space-y-2 marker:text-blue-500">
                            {block.items.map((item: string, i: number) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ul>
                        );
                    }
                    return null;
                    })}
                </div>

                {/* БЛОК НАВІГАЦІЇ (ПОПЕРЕДНЯ / НАСТУПНА) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                    {prevNews ? (
                        <Link href={`/novyny/${prevNews.slug}`} className="group flex items-center gap-4 p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ChevronLeft size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Попередня публікація</div>
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prevNews.title}</div>
                            </div>
                        </Link>
                    ) : <div></div> /* Пустий div для вирівнювання, якщо це найстаріша новина */}

                    {nextNews ? (
                        <Link href={`/novyny/${nextNews.slug}`} className="group flex items-center justify-end text-right gap-4 p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Наступна публікація</div>
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{nextNews.title}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </Link>
                    ) : <div></div>}
                </div>
            </article>

            {/* КОЛОНКА 2: БІЧНА ПАНЕЛЬ (4 колонки, STICKY) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 h-fit lg:pl-4">
                
                {/* ВІДЖЕТ: Останні новини */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        Останні новини
                    </h3>
                    
                    <div className="space-y-6">
                        {recentNews.map((news) => (
                            <Link key={news.slug} href={`/novyny/${news.slug}`} className="group flex gap-4 items-start">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                                    <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">{news.date}</span>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {news.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Link href="/novyny" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors flex items-center justify-center gap-1 w-full text-center">
                            Всі новини центру <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* ВІДЖЕТ: Заклик до дії (Запис на прийом) */}
                <div className="bg-blue-600 rounded-[32px] p-8 text-center shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-24 h-24 bg-black/10 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <PhoneCall size={24} className="text-white" />
                    </div>
                    <h3 className="font-extrabold text-xl mb-3">Потрібна консультація?</h3>
                    <p className="text-sm text-blue-100 leading-relaxed mb-8">
                        Наші фахівці готові відповісти на ваші запитання та допомогти підібрати правильну програму для вашої дитини.
                    </p>
                    <Link href="/kontakty" className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                        Зв'язатися з нами
                    </Link>
                </div>

            </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}