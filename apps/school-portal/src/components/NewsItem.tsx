"use client"
import { useState } from "react"
import { deleteNews, updateNews } from "@/app/actions/news"
import { Trash2, Edit3, Check, X } from "lucide-react"

export function NewsItem({ item, canEdit }: { item: any, canEdit: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)

  const handleUpdate = async () => {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    
    await updateNews(item.id, formData)
    setIsEditing(false)
  }

  return (
    <div className="p-6 border rounded-xl dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      {isEditing ? (
        <div className="space-y-3">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded dark:bg-slate-800"
          />
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded dark:bg-slate-800"
            rows={3}
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="text-green-500"><Check /></button>
            <button onClick={() => setIsEditing(false)} className="text-red-500"><X /></button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{item.title}</h3>
            {canEdit && (
              <div className="flex gap-3 opacity-50 hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => deleteNews(item.id)} className="hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            )} 
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{item.content}</p>
        </>
      )}
    </div>
  )
}