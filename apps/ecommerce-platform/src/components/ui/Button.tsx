import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'acid' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-display transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none border-2 border-ink',
                    {
                        'bg-ink text-paper hover:bg-acid hover:text-ink shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none': variant === 'default',
                        'bg-paper text-ink hover:bg-stone shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none': variant === 'outline',
                        'border-transparent hover:bg-acid/20 text-ink': variant === 'ghost',
                        'bg-acid text-ink hover:bg-white shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none': variant === 'acid',
                        'bg-stone text-ink hover:bg-paper shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none': variant === 'secondary',
                    },
                    {
                        'h-9 px-4 text-[10px] tracking-widest': size === 'sm',
                        'h-12 px-8 text-sm tracking-wide': size === 'md',
                        'h-16 px-10 text-lg tracking-wider': size === 'lg',
                    },
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
