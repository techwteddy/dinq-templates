"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cx } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, suffix, prefix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-ink-secondary uppercase"
          >
            {label}
          </label>
        )}

        <div
          className={cx(
            "flex items-center rounded-input bg-surface-overlay",
            "border transition-all duration-150",
            error
              ? "border-danger/60 focus-within:border-danger"
              : "border-surface-border focus-within:border-accent focus-within:shadow-input-focus"
          )}
        >
          {prefix && (
            <span className="pl-3 text-ink-muted text-sm select-none">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cx(
              "flex-1 bg-transparent px-3 py-2.5 text-sm text-ink-primary",
              "placeholder:text-ink-muted outline-none font-mono",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              prefix ? "pl-1" : undefined,
              suffix ? "pr-1" : undefined,
              className
            )}
            {...props}
          />

          {suffix && (
            <span className="pr-3 text-ink-secondary text-xs select-none font-mono">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-danger flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-ink-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
