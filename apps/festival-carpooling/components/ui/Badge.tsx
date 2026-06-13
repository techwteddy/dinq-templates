import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'muted' | 'outline' | 'success' | 'warning' | 'eco'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-ink text-card': variant === 'default',
          'bg-ink/8 text-ink-subtle': variant === 'muted',
          'border border-border text-ink-muted': variant === 'outline',
          'bg-forest-light text-forest': variant === 'success',
          'bg-[#f5e9c8] text-[#8a6420]': variant === 'warning',
          'bg-forest-light text-forest border border-forest/20': variant === 'eco',
        },
        className
      )}
      {...props}
    />
  )
}
