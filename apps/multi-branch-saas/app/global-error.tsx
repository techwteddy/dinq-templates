'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // TODO: Send error to error tracking service (e.g., Sentry)
  // Example: Sentry.captureException(error)

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 px-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter">Something went wrong!</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-4 text-left">
                <p className="mb-2 font-mono text-sm font-semibold">Error Details:</p>
                <p className="font-mono text-xs">{error.message}</p>
                {error.digest && (
                  <p className="mt-2 font-mono text-xs opacity-70">Digest: {error.digest}</p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
