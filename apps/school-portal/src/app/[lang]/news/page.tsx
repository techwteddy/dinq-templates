import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/dictionaries";
import { AddNewsForm } from "@/components/AddNewsForm";
import { NewsItem } from "@/components/NewsItem";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

// IMPORTANT: No 'use client' here. This is a Server Component.
export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Await params for Next.js 15
  const { lang } = await params;
  const currentLang = lang as 'en' | 'th' | 'zh';

  // 2. Load Dictionary and Supabase Server Client
  const dict = getDictionary(currentLang);
  const supabase = await createServerClient();

  // 3. Check for the logged-in user (Teacher)
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Fetch News items for the current language
  const { data: newsItems } = await supabase
    .from("news")
    .select("*")
    .eq("language", currentLang)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar lang={lang} isLoggedIn={!!user} />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center mb-10 border-b pb-6 dark:border-slate-800">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {/* Assuming your dictionaries.ts has a news.title property */}
              {dict.title || "School News"}
            </h1>
            <p className="text-slate-500 mt-1">
              {user ? `Logged in as ${user.email}` : "View only mode"}
            </p>
          </div>



          <div className="flex items-center gap-6">
            <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-widest">
              {['en', 'th', 'zh'].map((l) => (
                <Link
                  key={l}
                  href={`/${l}/news`}
                  className={currentLang === l ? "text-blue-600" : "opacity-40 hover:opacity-100"}
                >
                  {l}
                </Link>
              ))}
            </div>
            <ThemeToggle />
            {user ? (
              <LogoutButton />
            ) : (
              <Link
                href={`/${currentLang}/login`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-500 underline"
              >
                Teacher Login
              </Link>
            )}
          </div>
        </header>

        

        {/* POSTING SECTION (Only English + Only Teachers) */}
        {currentLang === 'en' && user ? (
          <section className="mb-12">
            <AddNewsForm lang={currentLang} />
          </section>
        ) : currentLang === 'en' ? (
          <div className="mb-12 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-center border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-500 text-sm">Please log in to post news updates.</p>
          </div>
        ) : null}

        {/* NEWS FEED SECTION */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Latest Updates
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="grid gap-6">
            {newsItems && newsItems.length > 0 ? (
              newsItems.map((item) => (
                <NewsItem
                  key={item.id}
                  item={item}
                  canEdit={!!user}
                />
              ))
            ) : (
              <div className="text-center py-20 text-slate-400">
                No news posts found for this language.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}