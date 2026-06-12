"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const THEME_CYCLE = ["light", "dark", "system"] as const;
const THEME_ICON = { light: Sun, dark: Moon, system: Monitor } as const;
const THEME_LABEL = { light: "Light", dark: "Dark", system: "System" } as const;

export function ThemeCycleButton({
  variant = "labeled",
  className,
}: {
  variant?: "labeled" | "icon";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICON[theme];

  function cycle() {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={cycle}
        className={cn(
          "shrink-0 p-3 text-muted-foreground hover:text-foreground transition-colors",
          className,
        )}
        title={`Theme: ${THEME_LABEL[theme]}`}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={cycle}>
      <Icon className="h-4 w-4" />
      {THEME_LABEL[theme]}
    </Button>
  );
}
