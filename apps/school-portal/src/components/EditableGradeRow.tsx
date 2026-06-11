"use client"
import { useState, useEffect } from "react"
import { Trash2, Edit, Check, X } from "lucide-react"
import { deleteGrade, updateGrade } from "@/app/actions/grades"

export function EditableGradeRow({ g }: { g: any }) {
  // 1. Manage the toggle state strictly in the client
  const [isEditing, setIsEditing] = useState(false)
  
  // 2. Initialize local state from the grade data
  const [tempName, setTempName] = useState(g.student_name)
  const [tempScore, setTempScore] = useState(g.score)

  // 3. If the server data changes (e.g. someone else updates it), update local state
  useEffect(() => {
    setTempName(g.student_name)
    setTempScore(g.score)
  }, [g.student_name, g.score])

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("student_name", tempName);
    formData.append("score", tempScore.toString());
    
    // Optimistic UI: stay in edit mode until we're sure it's saved
    try {
      await updateGrade(g.id, formData);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save grade");
    }
  }

  if (isEditing) {
    return (
      <tr className="bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-blue-500 transition-all">
        <td className="p-2">
          <input 
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-600 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            autoFocus
          />
        </td>
        <td className="p-2">
          <input 
            type="number" 
            value={tempScore}
            onChange={(e) => setTempScore(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-600 text-sm text-center outline-none"
          />
        </td>
        <td className="p-2 text-center opacity-40 font-black text-xs">...</td>
        <td className="p-2">
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleSave}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-300"
            >
              <X size={16} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
      <td className="p-4 font-semibold text-slate-900 dark:text-slate-200">{g.student_name}</td>
      <td className="p-4 text-center font-mono text-slate-700 dark:text-slate-300">{g.score}</td>
      <td className="p-4 text-center">
        <span className="inline-block px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-black">
          {g.grade_letter}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-3 justify-center">
          <button 
            type="button" // Force type button to prevent form submission
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all"
          >
            <Edit size={16} />
          </button>
          <button 
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              if (confirm(`Delete ${g.student_name}?`)) await deleteGrade(g.id);
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}