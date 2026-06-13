'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.96]',
          {
            'bg-ink text-card hover:bg-ink/85 active:bg-ink/90':
              variant === 'primary',
            'bg-ink/8 text-ink hover:bg-ink/14 active:bg-ink/14':
              variant === 'secondary',
            'text-ink-muted hover:bg-ink/6 active:bg-ink/6':
              variant === 'ghost',
            'bg-terra text-card hover:bg-terra/85 active:bg-terra/90':
              variant === 'danger',
          },
          {
            'h-8 px-3.5 text-sm gap-1.5': size === 'sm',
            'h-11 px-5 text-base gap-2': size === 'md',
            'h-14 px-6 text-base gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
