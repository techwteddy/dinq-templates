import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  href,
  children,
  className,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-dark disabled:cursor-not-allowed';
  
  const variantStyles: Record<string, string> = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-blue-500',
    secondary: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-600 shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-blue-500',
    text: 'bg-transparent text-blue-500 hover:text-blue-600 hover:underline active:text-blue-700 disabled:opacity-50 disabled:hover:no-underline',
  };
  
  const sizeStyles: Record<string, string> = {
    small: 'px-4 py-2 text-sm rounded-lg',
    medium: 'px-6 py-3 text-base rounded-xl',
    large: 'px-8 py-4 text-lg rounded-xl',
  };
  
  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    loading && 'opacity-75 cursor-wait',
    className
  );
  
  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );
  
  if (href && !disabled && !loading) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={onClick as any}
        {...(props as any)}
      >
        {content}
      </a>
    );
  }
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};
