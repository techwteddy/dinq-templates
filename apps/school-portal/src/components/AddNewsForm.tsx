"use client"
import { addNews } from "@/app/actions/news"
import { useState, useRef } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function AddNewsForm({ lang }: { lang: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setStatus("loading")
    try {
      await addNews(formData)
      setStatus("success")
      formRef.current?.reset()
      setTimeout(() => setStatus("idle"), 3000)
    } catch (e) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
      <h2 className="text-xl font-bold">Post New Update</h2>

      <input
        name="title"
        placeholder="Headline"
        required
        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
      />

      <textarea
        name="content"
        placeholder="Write news content here..."
        rows={4}
        required
        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
      />

      <input type="hidden" name="language" value={lang} />

      {status === "success" && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
          <CheckCircle2 size={16} />
          News posted successfully!
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
          <AlertCircle size={16} />
          Failed to post news. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full py-2 rounded font-bold transition-all ${
          status === "success"
            ? "bg-green-500 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400"
        }`}
      >
        {status === "loading" ? "Posting..." : status === "success" ? "Posted!" : "Post News"}
      </button>
    </form>
  )
}