import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        {label}
                        {props.required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                )}
                <input
                    className={cn(
                        'input-premium w-full',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
