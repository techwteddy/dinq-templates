import { z } from 'zod'

export const rideSchema = z.object({
  origin_city: z.string().min(2, 'Almeno 2 caratteri').max(100),
  destination: z.string().min(2, 'Almeno 2 caratteri').max(100),
  departure_at: z.string().min(1, 'Obbligatorio'),
  return_trip: z.coerce.boolean().default(false),
  total_seats: z.coerce.number().int().min(1).max(8),
  fuel_contribution_eur: z.coerce.number().min(0).max(500).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  meeting_point: z.string().max(200).optional().nullable(),
  distance_km: z.coerce.number().min(1).max(9999).optional().nullable(),
})

export type RideFormValues = z.infer<typeof rideSchema>
