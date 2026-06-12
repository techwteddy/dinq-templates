import { z } from "zod";

export const goals = ["fitness", "study", "health", "reading", "mindfulness"] as const;

export const onboardingSchema = z.object({
  goals: z.array(z.enum(goals)).min(1, "Select at least one goal."),
  starterHabits: z.array(z.string()).min(1, "Choose at least one starter habit."),
  reminderPreference: z.enum(["none", "push", "email"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
