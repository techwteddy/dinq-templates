"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cx } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold tracking-wide text-ink-secondary uppercase"
          >
            {label}
          </label>
        )}

        <div
          className={cx(
            "relative rounded-input bg-surface-overlay",
            "border transition-all duration-150",
            error
              ? "border-danger/60"
              : "border-surface-border focus-within:border-accent focus-within:shadow-input-focus"
          )}
        >
          <select
            ref={ref}
            id={selectId}
            className={cx(
              "w-full bg-transparent px-3 py-2.5 text-sm text-ink-primary",
              "outline-none appearance-none cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-surface-overlay text-ink-primary"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Flecha personalizada */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs">
            ▾
          </span>
        </div>

        {error && (
          <p className="text-xs text-danger flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
