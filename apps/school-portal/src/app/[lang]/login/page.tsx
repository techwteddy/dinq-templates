"use client"
import { useState, use } from "react" // Import 'use' to unwrap params
import { getDictionary } from "@/lib/dictionaries"
import { createClient } from "@/utils/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Unwrap the params safely
  const resolvedParams = use(params)
  const lang = resolvedParams.lang as 'en' | 'th' | 'zh'
  
  // 2. Get the dictionary (it's synchronous if it's just a TS object)
  const dict = getDictionary(lang)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const getTransformedPath = (targetLang: string) => {
    if (!pathname) return `/${targetLang}/login`
    const segments = pathname.split("/")
    segments[1] = targetLang
    return segments.join("/")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else {
      router.push(`/${lang}/news`)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <nav className="p-6 flex justify-between items-center max-w-4xl mx-auto">
        <Link href={`/${lang}/news`} className="font-bold hover:opacity-70">
          {dict.login.back}
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex gap-3 text-sm font-medium">
            {['en', 'th', 'zh'].map((l) => (
              <Link
                key={l}
                href={getTransformedPath(l)}
                className={`uppercase hover:text-blue-500 transition-colors ${
                  lang === l ? 'text-blue-600 font-bold underline underline-offset-4' : 'opacity-60'
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center pt-20 px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <h1 className="text-3xl font-bold mb-2 text-center">{dict.login.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">{dict.login.subtitle}</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{dict.login.email}</label>
              <input 
                type="email" 
                className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{dict.login.password}</label>
              <input 
                type="password" 
                className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">
            {dict.login.button}
          </button>
        </form>
      </div>
    </div>
  )
}