import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {!props.required && (
              <span className="ml-1 font-normal text-ink-subtle text-xs">opzionale</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink',
            'placeholder:text-ink-subtle',
            'focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-0 focus:border-transparent',
            'disabled:bg-background disabled:text-ink-subtle',
            error && 'border-terra focus:ring-terra',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
        {error && <p className="text-xs text-terra">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {!props.required && (
              <span className="ml-1 font-normal text-ink-subtle text-xs">opzionale</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={cn(
            'block w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink resize-none',
            'placeholder:text-ink-subtle',
            'focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent',
            error && 'border-terra focus:ring-terra',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
        {error && <p className="text-xs text-terra">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
