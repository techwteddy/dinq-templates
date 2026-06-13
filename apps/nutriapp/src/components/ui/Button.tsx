"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    "bg-accent text-surface-base font-semibold",
    "hover:bg-accent-dim active:scale-[0.98]",
    "shadow-accent-glow hover:shadow-none",
    "disabled:bg-accent/40 disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "bg-surface-overlay text-ink-primary border border-surface-border",
    "hover:bg-surface-muted hover:border-accent/40",
    "active:scale-[0.98]",
  ].join(" "),
  ghost: [
    "bg-transparent text-ink-secondary",
    "hover:text-ink-primary hover:bg-surface-raised",
    "active:scale-[0.98]",
  ].join(" "),
  danger: [
    "bg-danger/10 text-danger border border-danger/30",
    "hover:bg-danger/20",
    "active:scale-[0.98]",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-input",
  md: "h-11 px-5 text-sm rounded-input",
  lg: "h-13 px-6 text-base rounded-card",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cx(
          "inline-flex items-center justify-center gap-2",
          "transition-all duration-150 font-display select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Cargando…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
