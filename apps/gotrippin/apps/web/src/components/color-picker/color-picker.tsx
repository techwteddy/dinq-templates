"use client";

import { useState, useCallback, useEffect } from "react";
import { Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PickerButton } from "./picker-button";
import { ColorPanel } from "./color-panel";
import type { ColorPickerTab } from "./tabs";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  icon?: React.ReactNode;
  label?: string;
  /** Use when `label` is omitted (icon-only); passed to the trigger for a11y. */
  triggerAriaLabel?: string;
  className?: string;
  /** Merged into popover panel (e.g. `z-[250]` above route drawers at z-[200]). */
  contentClassName?: string;
}

export function ColorPicker({
  value,
  onChange,
  icon,
  label,
  triggerAriaLabel,
  className,
  contentClassName,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<ColorPickerTab>("Preset");
  const [selectedColor, setSelectedColor] = useState(value || "#1a1a2e");

  useEffect(() => {
    if (open) setSelectedColor(value || "#1a1a2e");
  }, [open, value]);

  const handleSave = useCallback(() => {
    onChange(selectedColor);
    setOpen(false);
  }, [selectedColor, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PickerButton
          icon={icon ?? <Palette className="h-4 w-4" strokeWidth={2} />}
          isOpen={open}
          label={label}
          aria-label={triggerAriaLabel}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className={cn("w-72", contentClassName)}>
        <ColorPanel
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onSave={handleSave}
        />
      </PopoverContent>
    </Popover>
  );
}
