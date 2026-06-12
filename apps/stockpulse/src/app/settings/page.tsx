"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { ArrowLeft, Lock, Loader2, TrendingUp, AlertCircle, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = React.useState<User | null>(null)
  const [fullName, setFullName] = React.useState("")
  const [profileLoading, setProfileLoading] = React.useState(false)
  
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.user_metadata?.full_name) {
        setFullName(data.user.user_metadata.full_name)
      }
    })
  }, [supabase])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")
      
      setSuccess("Profile updated successfully!")
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      setUser(updatedUser)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess("Password updated successfully! You can now log in using your email and this password.")
      setPassword("")
    }
    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete your account? All your saved ETFs will be permanently erased.")) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch("/api/account", { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete account")
      }
      
      // Cleanup client session quickly
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err: any) {
      alert(err.message)
      setIsDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080a0c] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  const displayName = user.user_metadata?.full_name || "User"
  const isGoogleUser = user.app_metadata?.provider === "google"

  return (
    <div className="min-h-screen bg-[#080a0c] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-black mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-sm mb-10">Manage your profile and security preferences.</p>

        {/* Profile Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 mb-6 font-sans">Profile Settings</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-16 w-16 rounded-2xl object-cover border border-white/10" />
              ) : (
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-black text-emerald-400">{displayName.slice(0, 2).toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Display Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full max-w-sm bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading || fullName === user.user_metadata?.full_name}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 px-6 transition-all text-sm font-black text-black"
              >
                {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 mb-2">
            {isGoogleUser ? "Set Password" : "Change Password"}
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            {isGoogleUser 
              ? "Since you signed in with Google, you can set a password here to also allow logging in with your email and password."
              : "Update your account password to keep your account secure."}
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-400 font-bold">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-bold leading-relaxed">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 px-6 transition-all text-sm font-black text-black mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-500/[0.02] border border-rose-500/20 rounded-3xl p-6 mt-8 backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-widest text-rose-500 mb-2">
            Danger Zone
          </h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-lg">
            Permanently delete your account and all associated data, including your saved ETFs and watchlists. This action cannot be undone.
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 px-6 transition-all text-sm font-black"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                Delete Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
