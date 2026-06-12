"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, TrendingUp, AlertCircle, Loader2, ArrowRight, User } from "lucide-react"

type Mode = "login" | "signup" | "forgot"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = React.useState<Mode>("login")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push("/")
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback` 
        }
      })
      if (error) setError(error.message)
      else setSuccess("Check your email to confirm your account!")
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`
      })
      if (error) setError(error.message)
      else setSuccess("Password reset link sent to your email!")
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div className="min-h-screen h-[100svh] bg-[#080a0c] flex items-center justify-center relative overflow-hidden isolate">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative z-20 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <svg className="h-10 w-10 flex-shrink-0 drop-shadow-xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="url(#SVGnR2EndgxLogin)" fillRule="evenodd" d="M21 13.04c0 .091-.02.179-.057.255l-3.86 7.21a.91.91 0 0 1-.794.495H7.71a.91.91 0 0 1-.794-.494l-3.86-7.212A.6.6 0 0 1 3 13.04c0-.298.224-.54.501-.54h4.235l1.074 1.966l.006.012a.48.48 0 0 0 .68.18l.012-.008a.54.54 0 0 0 .219-.323l1.367-5.702l1.175 9.18l.002.013c.043.289.292.489.563.449l.012-.002a.52.52 0 0 0 .404-.398l1.649-6.873l.677 1.24l.006.011a.5.5 0 0 0 .425.255H20.5c.277 0 .501.242.501.54M16.289 3c.327 0 .63.188.793.494l3.861 7.211a.6.6 0 0 1 .057.256c0 .298-.224.54-.501.54h-4.25l-1.073-1.966l-.007-.013a.5.5 0 0 0-.299-.236l-.012-.003c-.264-.067-.53.106-.599.39l-1.367 5.703l-1.174-9.18l-.002-.013a.53.53 0 0 0-.37-.437c-.267-.074-.54.1-.61.388l-1.649 6.873l-.676-1.24l-.007-.011a.5.5 0 0 0-.425-.255H3.5c-.277 0-.501-.242-.501-.54c0-.091.019-.178.056-.253l3.861-7.214A.91.91 0 0 1 7.711 3z" clipRule="evenodd" /><defs><linearGradient id="SVGnR2EndgxLogin" x1="18.226" x2="5.326" y1="2.147" y2="20.689" gradientUnits="userSpaceOnUse"><stop stopColor="#00eaff" /><stop offset=".253" stopColor="#0080ff" /><stop offset=".497" stopColor="#8000ff" /><stop offset=".75" stopColor="#e619e6" /><stop offset=".999" stopColor="red" /></linearGradient></defs></g></svg>
            <span className="text-3xl font-sans text-white tracking-tighter">StockPulse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "login" && "Welcome back. Track smarter."}
            {mode === "signup" && "Start tracking Indian ETFs like a pro."}
            {mode === "forgot" && "Reset your password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Google button */}
          {mode !== "forgot" && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="relative z-[30] w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl py-3 px-4 transition-all text-sm font-bold text-white mb-6 pointer-events-auto"
              >
                <svg className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-transparent px-3 text-[11px] font-black text-muted-foreground/50 uppercase tracking-widest">or</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup Only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="relative z-[30] text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors font-bold py-1 pointer-events-auto"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {/* Error/Success */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-400 font-bold">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-bold">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-3 px-4 transition-all text-sm font-black text-black mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="text-center mt-6">
            {mode === "login" && (
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(null); setSuccess(null) }} className="relative z-[30] text-emerald-400 font-black hover:text-emerald-300 transition-colors py-1 pointer-events-auto">
                  Sign Up
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(null); setSuccess(null) }} className="text-emerald-400 font-black hover:text-emerald-300 transition-colors">
                  Sign In
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <button onClick={() => { setMode("login"); setError(null); setSuccess(null) }} className="text-sm text-emerald-400 font-black hover:text-emerald-300 transition-colors">
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
