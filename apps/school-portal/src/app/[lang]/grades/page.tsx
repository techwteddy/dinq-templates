import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { AddGradeForm } from "@/components/AddGradeForm";
import { addSemester } from "@/app/actions/grades";
import { EditableGradeRow } from "@/components/EditableGradeRow";
import { DeleteSemesterBtn } from "@/components/DeleteSemesterBtn";
import { Navbar } from "@/components/Navbar";

export default async function GradesPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ subject?: string; level?: string; semester?: string }>
}) {
  const { lang } = await params;
  const currentLang = lang as 'en' | 'th' | 'zh';
  const {
    subject = 'Science',
    level = '6A',
    semester = 'Semester 1 2026'
  } = await searchParams;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${lang}/login`);

  const { data: grades } = await supabase
    .from("grades")
    .select("*")
    .eq("subject", subject)
    .eq("grade_level", level)
    .eq("semester", semester)
    .order("student_name", { ascending: true });

  const subjects = ["Science", "Math", "Conversation", "Basic English", "Reading and Writing"];
  const levels = ["6A", "6B", "6C"];

  // Fetch Dynamic Semesters
  const { data: semesterList } = await supabase.from("semesters").select("name").order("created_at", { ascending: true });
  const activeSemester = semester || semesterList?.[0]?.name || "Semester 1 2026";

  return (
    // min-h-screen ensures the background covers the whole page regardless of content height
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar lang={lang} isLoggedIn={!!user} />
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* TOP HEADER */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Gradebook
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Logged in as: {user.email}
            </p>
          </div>
          <div className="flex gap-4 items-center">

            <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-widest">
              {['en', 'th', 'zh'].map((l) => (
                <Link
                  key={l}
                  href={`/${l}/grades`}
                  className={currentLang === l ? "text-blue-600" : "opacity-40 hover:opacity-100"}
                >
                  {l}
                </Link>
              ))}
            </div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>



        {/* SEMESTER MANAGEMENT */}
        <div className="mb-8 p-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Period:</span>
            <div className="flex gap-2">
              {semesterList?.map((s) => (
                <div key={s.name} className="flex items-center gap-1">
                  <Link
                    href={`?subject=${subject}&level=${level}&semester=${s.name}`}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${activeSemester === s.name ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                  >
                    {s.name}
                  </Link>
                  {/* Only show delete button for the ACTIVE semester to avoid confusion */}
                  {activeSemester === s.name && <DeleteSemesterBtn semesterName={s.name} />}
                </div>
              ))}
            </div>
          </div>

          {/* ADD SEMESTER FORM */}
          <form action={addSemester} className="flex gap-2">
            <input name="semester_name" placeholder="New Semester (e.g. 2/2027)"
              className="text-xs p-2 rounded border dark:bg-slate-800 dark:border-slate-700 outline-none w-40 md:w-52" required />
            <button type="submit" className="text-xs bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-3 py-2 rounded-lg font-bold hover:opacity-80">
              + Add
            </button>
          </form>
        </div>


        {/* SUBJECT TABS (SHEETS) */}
        <div className="flex flex-wrap gap-1 mb-0 px-2">
          {subjects.map((s) => (
            <Link
              key={s}
              href={`?subject=${s}&level=${level}&semester=${semester}`}
              className={`px-4 py-3 rounded-t-xl text-xs font-black uppercase tracking-wide transition-all ${subject === s
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t border-x border-slate-200 dark:border-slate-800"
                : "text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl rounded-tr-2xl shadow-sm overflow-hidden">

          {/* LEVEL BAR (6A, 6B, 6C) */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Class Level:</span>
            <div className="flex gap-2">
              {levels.map(l => (
                <Link key={l} href={`?subject=${subject}&level=${l}&semester=${semester}`}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${level === l
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {/* LEFT: INPUT FORM */}
            <div className="p-6 bg-slate-50/30 dark:bg-slate-900/30">
              <h2 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-400">Entry Form</h2>
              <AddGradeForm
                currentSubject={subject}
                currentLevel={level}
                currentSemester={semester}
              />
            </div>

            {/* RIGHT: TABLE DATA */}
            <div className="lg:col-span-2">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <tr>
                    <th className="p-4 border-b dark:border-slate-800">Student Name</th>
                    <th className="p-4 border-b dark:border-slate-800 text-center">Score</th>
                    <th className="p-4 border-b dark:border-slate-800 text-center">Grade</th>
                    <th className="p-4 border-b dark:border-slate-800 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {grades && grades.map((g) => <EditableGradeRow key={g.id} g={g} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}