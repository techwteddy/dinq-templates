import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'acid' | 'ink';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                className={cn(
                    'inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-ink transition-all shadow-hard-sm',
                    {
                        'bg-paper text-ink': variant === 'default',
                        'bg-green-400 text-ink': variant === 'success',
                        'bg-yellow-400 text-ink': variant === 'warning',
                        'bg-red-400 text-ink': variant === 'error',
                        'bg-acid text-ink': variant === 'acid',
                        'bg-ink text-paper': variant === 'ink',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;
