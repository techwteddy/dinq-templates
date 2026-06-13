'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Root error:', error)
    }

    // TODO: Send error to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <CardTitle>Oops! Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <p className="mb-1 text-xs font-semibold">Error Details (dev only):</p>
              <p className="font-mono text-xs break-words">{error.message}</p>
              {error.digest && (
                <p className="mt-1 font-mono text-xs opacity-70">Digest: {error.digest}</p>
              )}
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold">Stack trace</summary>
                  <pre className="mt-1 overflow-x-auto text-[10px] opacity-70">{error.stack}</pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => reset()} className="flex-1">
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
