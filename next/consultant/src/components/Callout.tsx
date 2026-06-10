import React from "react";
import { Info } from "lucide-react";

interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "warning" | "error";
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const styles = {
    info: "bg-teal-50 border-teal-200 text-teal-900 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300",
    warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
    error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  };

  return (
    <div className={`my-8 flex items-start gap-4 rounded-xl border p-6 ${styles[type]}`}>
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-current/10">
        <Info className="h-4 w-4" />
      </div>
      <div className="flex-1 text-sm leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}
