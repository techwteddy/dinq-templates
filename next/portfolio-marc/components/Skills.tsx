'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

type GitHubLanguage = { name: string; bytes: number; percent: number }
type GitHubLanguagesResponse = {
  username: string
  repoCount: number
  totalBytes: number
  languages: GitHubLanguage[]
  source: string
}

type TechCategory = {
  label: string
  icon: string
  items: string[]
}

const techCategories: TechCategory[] = [
  {
    label: 'Frameworks & Libraries',
    icon: '⚡',
    items: ['Next.js', 'React', 'Node.js', 'ASP.NET MVC', 'Laravel', 'Vite', 'Bootstrap', 'Express.js'],
  },
  {
    label: 'Databases & Backend',
    icon: '🗄️',
    items: ['Supabase', 'PostgreSQL', 'MySQL', 'SQL Server', 'TypeORM', 'REST API'],
  },
  {
    label: 'UI & Styling',
    icon: '🎨',
    items: ['Tailwind CSS', 'shadcn/ui', 'CSS3', 'HTML5'],
  },
  {
    label: 'Tools & DevOps',
    icon: '🛠️',
    items: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Postman', 'npm'],
  },
]

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [data, setData] = useState<GitHubLanguagesResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/github-languages?username=1mRen&repoLimit=30', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) {
          const msg = (json && typeof json.error === 'string') ? json.error : `Failed to load (${res.status})`
          throw new Error(msg)
        }
        if (!cancelled) setData(json as GitHubLanguagesResponse)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        if (!cancelled) setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const languages = useMemo(() => {
    if (data?.languages?.length) return data.languages
    return [] as GitHubLanguage[]
  }, [data])

  const maxPercent = useMemo(() => {
    return languages.reduce((m, l) => Math.max(m, l.percent), 0) || 100
  }, [languages])

  return (
    <section
      id="skills"
      className="py-20 bg-gray-50 dark:bg-gray-800"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
            Skills & Technologies
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Languages
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on public repository language statistics for <span className="font-semibold">{data?.username || '1mRen'}</span>.
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? (
                <span>Loading…</span>
              ) : error ? (
                <span className="text-red-600 dark:text-red-400">Failed to load</span>
              ) : (
                <span>
                  {data?.repoCount ?? 0} repos · {languages.length} languages
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {(loading ? Array.from({ length: 6 }) : languages).map((lang, idx) => {
              const name = loading ? 'Loading' : (lang as GitHubLanguage).name
              const percent = loading ? 0 : (lang as GitHubLanguage).percent
              const width = loading ? '35%' : `${Math.max(2, (percent / maxPercent) * 100)}%`

              return (
                <div key={loading ? idx : name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {name}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 font-semibold tabular-nums">
                      {loading ? '—' : `${percent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={isInView ? { width } : { width: 0 }}
                      transition={{ duration: 0.9, delay: 0.1 + idx * 0.06 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {!loading && !error && (
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              Source: {data?.source}
            </div>
          )}
        </motion.div>

        {/* Technologies grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 text-center">
            Frameworks, Tools & Technologies
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {techCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 + catIdx * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.icon}</span>
                  <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 leading-tight">
                    {cat.label}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: 0.5 + catIdx * 0.1 + itemIdx * 0.04 }}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Skills

