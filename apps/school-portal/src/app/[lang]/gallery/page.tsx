import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/dictionaries";
import { Navbar } from "@/components/Navbar";
import { ShuffleArt } from "@/components/ShuffleArt";
import { BulkUploadForm } from "@/components/BulkUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const currentLang = lang as 'en' | 'th' | 'zh';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: art } = await supabase.from("student_art").select("id, image_url");

  const dict = getDictionary(currentLang);
  const t = dict.gallery;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* VIEWPORT-PINNED SECTION — always exactly one screen tall */}
      <div className="h-dvh flex flex-col overflow-hidden">
        <Navbar lang={lang} isLoggedIn={!!user} />

        <div className="flex-1 flex flex-col min-h-0 max-w-6xl mx-auto px-4 md:px-8 w-full pb-4">

          {/* HEADER */}
          <header className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex gap-3 text-xs font-bold uppercase tracking-widest">
                {['en', 'th', 'zh'].map((l) => (
                  <Link
                    key={l}
                    href={`/${l}/gallery`}
                    className={currentLang === l ? "text-blue-600" : "opacity-40 hover:opacity-100"}
                  >
                    {l}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
              {user && <LogoutButton />}
            </div>
          </header>

          {/* GALLERY — flex-1 fills all remaining height */}
          <main className="flex-1 flex flex-col items-center justify-center min-h-0 gap-3">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic text-center">
              {t.subtitle}
            </p>
            {art && art.length > 0 ? (
              <ShuffleArt initialArt={art} buttonText={t.next} />
            ) : (
              <div className="p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                {t.noArt}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ADMIN UPLOAD — completely outside the h-dvh block, scroll down to reach */}
      {user && (
        <section className="max-w-2xl mx-auto w-full px-4 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">
            {t.adminTitle}
          </h2>
          <BulkUploadForm />
        </section>
      )}
    </div>
  );
}