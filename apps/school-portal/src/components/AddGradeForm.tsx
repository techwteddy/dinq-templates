"use client"
import { addGrade } from "@/app/actions/grades";

export function AddGradeForm({ currentSubject, currentLevel, currentSemester }: any) {
  return (
    <form action={addGrade} className="space-y-4 p-5 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 shadow-xl">
      {/* Hidden inputs to pass the current "Sheet" context */}
      <input type="hidden" name="subject" value={currentSubject} />
      <input type="hidden" name="grade_level" value={currentLevel} />
      <input type="hidden" name="semester" value={currentSemester} />
      <input type="hidden" name="academic_year" value="2026" />

      <div>
        <label className="text-xs font-bold opacity-50 block mb-1">Student Full Name</label>
        <input name="student_name" className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" required />
      </div>
      
      <div>
        <label className="text-xs font-bold opacity-50 block mb-1">Score (0-100)</label>
        <input name="score" type="number" step="0.1" className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" required />
      </div>

      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
        Save Grade
      </button>
    </form>
  );
}