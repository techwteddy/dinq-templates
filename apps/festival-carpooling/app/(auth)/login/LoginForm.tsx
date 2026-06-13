'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EnvelopeIcon } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps {
  next?: string
}

export function LoginForm({ next }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleMagicLink = () => {
    startTransition(async () => {
      setError(null)
      const supabase = createClient()
      const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
      const redirectTo = `${base}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    })
  }

  const handleGoogle = () => {
    startTransition(async () => {
      setError(null)
      const supabase = createClient()
      const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
      const redirectTo = `${base}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
    })
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-stone-50 border border-stone-100 px-6 py-8 text-center">
        <EnvelopeIcon className="w-8 h-8 mb-3 mx-auto text-forest" />
        <p className="font-semibold text-stone-900">Controlla la tua email</p>
        <p className="mt-2 text-sm text-stone-500">
          Abbiamo inviato un link di accesso a <strong>{email}</strong>. Clicca il link per continuare.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Input
          label="Indirizzo email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@esempio.com"
          required
          onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          onClick={handleMagicLink}
          loading={isPending}
          disabled={!email.includes('@')}
          className="w-full"
        >
          Invia link di accesso
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-stone-400">oppure</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <Button
        variant="secondary"
        onClick={handleGoogle}
        loading={isPending}
        className="w-full"
      >
        <GoogleIcon className="h-4 w-4" />
        Continua con Google
      </Button>

      <p className="text-center text-xs text-stone-400">
        Accedendo, ti impegni a coordinare i passaggi con rispetto.
      </p>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
