"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Newspaper, Palette, LogIn } from "lucide-react";

export function Navbar({ lang, isLoggedIn = false }: { lang: string; isLoggedIn?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: lang === 'zh' ? '新闻' : lang === 'th' ? 'ข่าว' : 'News', href: `/${lang}/news`, icon: <Newspaper size={18} /> },
    { name: lang === 'zh' ? '成绩' : lang === 'th' ? 'คะแนน' : 'Grades', href: `/${lang}/grades`, icon: <GraduationCap size={18} /> },
    { name: lang === 'zh' ? '画廊' : lang === 'th' ? 'หอศิลป์' : 'Gallery', href: `/${lang}/gallery`, icon: <Palette size={18} /> },
    {
      name: lang === 'zh' ? '登录' : lang === 'th' ? 'เข้าสู่ระบบ' : 'Login',
      href: `/${lang}/login`,
      icon: <LogIn size={18} />,
      hideIfLoggedIn: true,
    },
  ];

  const visibleItems = navItems.filter(item => !(item.hideIfLoggedIn && isLoggedIn));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:relative md:border-t-0 md:border-b mb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex gap-8">
            {visibleItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}