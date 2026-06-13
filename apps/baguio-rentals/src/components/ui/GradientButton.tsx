'use client';

import type { HTMLAttributes } from 'react';

interface GradientButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function GradientButton({
  children,
  className = '',
  ...props
}: GradientButtonProps) {
  return (
    <div
      className={`
        rotating-gradient relative rounded-[50px]
        after:content-[""] after:block after:absolute after:bg-cream
        after:inset-[2px] after:rounded-[48px] after:z-[1]
        flex items-center justify-center
        ${className}
      `}
      style={{ '--r': '0deg' } as React.CSSProperties}
      {...props}
    >
      <span className="relative z-[2] flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-bark">
        {children}
      </span>
    </div>
  );
}
