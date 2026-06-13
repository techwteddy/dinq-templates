'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SadIcon } from '@/components/ui/icons'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Replace with Sentry.captureException(error) when Sentry is configured
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <SadIcon className="w-10 h-10 mb-4 text-ink-subtle mx-auto" />
      <h2 className="font-serif text-lg font-bold text-ink mb-2">Qualcosa è andato storto</h2>
      <p className="text-sm text-ink-muted mb-6">Prova ad aggiornare la pagina.</p>
      <Button onClick={reset} variant="secondary">
        Riprova
      </Button>
    </div>
  )
}
