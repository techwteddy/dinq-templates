import { Building } from "lucide-react";
import GoogleMap from "./GoogleMap";

export default function Location() {
  return (
    <section className="py-24 bg-transparent transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-8 border border-blue-200 dark:border-blue-800 shadow-inner transition-colors">
                    <Building size={32} />
                </div>
                {/* ТУТ: dark:text-white */}
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">Ми знаходимося в Житомирі</h2>
                
                {/* ТУТ: dark:text-slate-300 */}
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 transition-colors">
                  Наш центр — це не просто медичний заклад, це затишний простір, адаптований під потреби дітей. Ви можете легко знайти нас на карті та прокласти маршрут.
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors">м. Житомир, вул. Корабельна, 8</p>
            </div>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 group transition-colors">
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-sm font-semibold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-slate-900 dark:text-white">
                  Натисніть "Більше", щоб відкрити додаток
                </div>
                <GoogleMap />
            </div>
        </div>
    </section>
  );
}