"use client" // Must be a client component for interactivity

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // This ensures the component only renders icons after mounting on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // While waiting for the client to mount, we render an empty button 
  // to maintain the layout size without causing a hydration error.
  if (!mounted) {
    return <div className="p-2 w-10 h-10" /> 
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-blue-400 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  )
}