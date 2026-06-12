"use client";

import * as React from "react";
import { Eye, EyeOff, SquareArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type"
> & {
  /** Classes for the visibility toggle (e.g. light text on dark auth backgrounds). */
  toggleClassName?: string;
  /** When true, shows a caps-lock hint icon immediately left of the visibility toggle. */
  capsLockOn?: boolean;
  /** Accessible label for the caps-lock indicator (e.g. i18n `auth.caps_lock_on`). */
  capsLockAriaLabel?: string;
};

export function PasswordInput({
  className,
  disabled,
  toggleClassName,
  capsLockOn = false,
  capsLockAriaLabel,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        className={cn(capsLockOn ? "pr-16" : "pr-10", className)}
        disabled={disabled}
        {...props}
      />
      {capsLockOn && capsLockAriaLabel ? (
        <span
          className="pointer-events-none absolute right-8 top-1/2 flex h-8 w-6 -translate-y-1/2 items-center justify-center"
          role="status"
          aria-label={capsLockAriaLabel}
        >
          <SquareArrowUp
            className="size-4 shrink-0 text-amber-400/90"
            aria-hidden
          />
        </span>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          toggleClassName,
        )}
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="size-4 shrink-0" aria-hidden />
        ) : (
          <Eye className="size-4 shrink-0" aria-hidden />
        )}
      </Button>
    </div>
  );
}
