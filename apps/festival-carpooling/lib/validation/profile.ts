import { z } from 'zod'

export const onboardingSchema = z.object({
  display_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less')
    .regex(/^[^<>{}[\]]*$/, 'Name contains invalid characters'),
  phone: z
    .string()
    .max(20)
    .optional()
    .nullable()
    .transform((v) => (v === '' ? null : v)),
})

export const profileSchema = onboardingSchema.extend({
  bio: z.string().max(200).optional().nullable(),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
export type ProfileValues = z.infer<typeof profileSchema>
