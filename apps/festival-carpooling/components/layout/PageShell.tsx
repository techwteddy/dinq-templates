import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function PageShell({ title, description, className, children, ...props }: PageShellProps) {
  return (
    <main
      className={cn('mx-auto max-w-lg px-4 pt-6 pb-28 animate-fade-in', className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h1 className="font-serif text-2xl font-bold text-ink">{title}</h1>
          )}
          {description && (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          )}
        </div>
      )}
      {children}
    </main>
  )
}
