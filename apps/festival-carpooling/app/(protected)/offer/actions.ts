'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { rideSchema } from '@/lib/validation/ride'
import { getActiveFestivalId } from '@/lib/queries/festivals'
import { sendManagementEmail } from '@/lib/email'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createRideAction(_prev: unknown, formData: FormData) {
  const driverName = (formData.get('driver_name') as string)?.trim()
  const driverEmail = (formData.get('driver_email') as string)?.trim().toLowerCase()

  if (!driverName) return { error: 'Il tuo nome è obbligatorio.' }
  if (!driverEmail || !driverEmail.includes('@')) return { error: 'Inserisci un indirizzo email valido.' }

  const parsed = rideSchema.safeParse({
    origin_city: formData.get('origin_city'),
    destination: formData.get('destination'),
    departure_at: formData.get('departure_at'),
    return_trip: formData.get('return_trip') === 'true',
    total_seats: formData.get('total_seats'),
    fuel_contribution_eur: formData.get('fuel_contribution_eur') || null,
    notes: formData.get('notes') || null,
    meeting_point: formData.get('meeting_point') || null,
    distance_km: formData.get('distance_km') || null,
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = createServiceClient()
  const festivalId = await getActiveFestivalId()

  const driverPhone = (formData.get('driver_phone') as string)?.trim() || null
  const rideType = formData.get('ride_type') === 'seek' ? 'seek' : 'offer'
  const contactPreference = (formData.get('contact_preference') as string) || 'whatsapp'

  const { data, error } = await supabase
    .from('rides')
    .insert({
      festival_id: festivalId,
      driver_id: null,
      driver_name: driverName,
      driver_email: driverEmail,
      driver_phone: driverPhone,
      contact_preference: contactPreference,
      type: rideType,
      origin_city: parsed.data.origin_city,
      destination: parsed.data.destination,
      departure_at: parsed.data.departure_at,
      return_trip: parsed.data.return_trip ?? false,
      total_seats: parsed.data.total_seats,
      fuel_contribution_eur: parsed.data.fuel_contribution_eur ?? null,
      notes: parsed.data.notes ?? null,
      stops: (formData.get('stops') as string)?.trim() || null,
      meeting_point: parsed.data.meeting_point ?? null,
      distance_km: parsed.data.distance_km ?? null,
    })
    .select('id, management_token, origin_city, destination')
    .single()

  if (error || !data) {
    console.error('[createRideAction] insert error:', JSON.stringify(error))
    return { error: `Impossibile creare il passaggio. ${error?.message ?? ''}` }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const manageUrl = `${appUrl}/rides/${data.id}/manage?token=${data.management_token}`

  await sendManagementEmail(
    driverEmail,
    driverName,
    `${data.origin_city} → ${data.destination}`,
    manageUrl,
    rideType
  )

  revalidatePath('/rides')
  revalidatePath('/')
  redirect(`/rides/${data.id}?posted=true&email=${encodeURIComponent(driverEmail)}`)
}
