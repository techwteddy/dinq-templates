"use client";
import * as LucideIcons from "lucide-react";
import { type LucideProps } from "lucide-react";

interface IconPreviewProps extends Omit<LucideProps, "name"> {
  name: string | null | undefined;
}

const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;

/**
 * Renders a Lucide icon by its string name.
 * Falls back to a placeholder if the name is missing or unknown.
 */
export function IconPreview({ name, className, ...props }: IconPreviewProps) {
  if (!name) return <div className={className} />;

  const IconComponent = icons[name.trim()];

  if (!IconComponent) {
    return (
      <div className={className} title={`Icon not found: ${name}`}>
        <LucideIcons.HelpCircle className="h-full w-full opacity-20" />
      </div>
    );
  }

  return <IconComponent className={className} {...props} />;
}

/**
 * Curated list of suggested category icons.
 */
export const CATEGORY_ICONS = [
  "TrendingUp",
  "TrendingDown",
  "ShoppingBag",
  "Utensils",
  "Car",
  "Home",
  "Zap",
  "Heart",
  "GraduationCap",
  "Briefcase",
  "Globe",
  "Smartphone",
  "Coffee",
  "Music",
  "Camera",
  "Gift",
  "Plane",
  "DollarSign",
  "CreditCard",
  "Activity",
  "Shield",
  "User",
  "Users",
  "Lightbulb",
  "Wrench",
  "Package",
];
