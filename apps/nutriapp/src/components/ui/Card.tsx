import { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow, className, children, ...props }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-card bg-surface-raised shadow-card p-4",
        glow && "shadow-accent-glow border border-accent/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "flex items-center justify-between mb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cx("text-sm font-semibold text-ink-primary", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
