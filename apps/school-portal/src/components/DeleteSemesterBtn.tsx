"use client"
import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteSemester } from "@/app/actions/grades";

export function DeleteSemesterBtn({ semesterName }: { semesterName: string }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-1 pr-2 rounded-lg border border-red-200 dark:border-red-900 animate-in fade-in zoom-in duration-200">
        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-2 uppercase italic">
          Delete all records?
        </span>
        <button 
          onClick={() => deleteSemester(semesterName).then(() => setIsConfirming(false))}
          className="bg-red-600 text-white text-[10px] px-3 py-1 rounded font-bold hover:bg-red-700 transition-colors"
        >
          Yes, Delete
        </button>
        <button 
          onClick={() => setIsConfirming(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
      title="Delete Semester"
    >
      <Trash2 size={16} />
    </button>
  );
}