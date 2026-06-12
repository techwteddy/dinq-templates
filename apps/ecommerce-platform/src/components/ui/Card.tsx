import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'acid' | 'stone' | 'ink';
}

export default function Card({ children, className, variant = 'default' }: CardProps) {
    return (
        <div className={cn(
            'border-2 border-ink rounded-3xl p-6 shadow-hard transition-all duration-300 hover:shadow-hard-xl',
            {
                'bg-white': variant === 'default',
                'bg-acid': variant === 'acid',
                'bg-stone': variant === 'stone',
                'bg-ink text-paper': variant === 'ink',
            },
            className
        )}>
            {children}
        </div>
    );
}
