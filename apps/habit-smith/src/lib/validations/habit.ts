import { z } from "zod";

import type { HabitCategory, HabitFrequency } from "@/types";

export const habitCategories = ["fitness", "study", "health", "reading", "mindfulness", "career", "personal"] as const;
export const habitFrequencies = ["daily", "weekly", "custom"] as const;

export const habitSchema = z.object({
  title: z.string().min(2, "Title is required."),
  description: z.string().min(4, "Description is required."),
  emoji: z.string().min(1, "Pick an emoji."),
  category: z.enum(habitCategories),
  colour: z.string().min(4, "Choose a color."),
  frequency: z.enum(habitFrequencies),
  targetCount: z.number().min(1, "Target must be at least 1."),
  unit: z.string().min(1, "Unit is required."),
});

export type HabitFormInput = z.infer<typeof habitSchema>;
export type HabitCategoryFilter = HabitCategory | "all";
export type HabitFrequencyInput = HabitFrequency;
