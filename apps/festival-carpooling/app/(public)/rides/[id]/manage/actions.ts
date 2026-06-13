'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { acceptRequestAction, declineRequestAction } from '../actions'

export { acceptRequestAction, declineRequestAction }

export async function updateRideAction(_prev: unknown, formData: FormData) {
  const rideId = formData.get('ride_id') as string
  const token = formData.get('management_token') as string

  if (!rideId || !token) return { error: 'Dati mancanti.' }

  const supabase = createServiceClient()

  // Verify token ownership
  const { data: ride } = await supabase
    .from('rides')
    .select('id, management_token, seats_taken')
    .eq('id', rideId)
    .eq('management_token', token)
    .is('deleted_at', null)
    .single()

  if (!ride) return { error: 'Non autorizzato.' }

  const departureAt = formData.get('departure_at') as string
  const meetingPoint = (formData.get('meeting_point') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null
  const fuelRaw = formData.get('fuel_contribution_eur') as string
  const fuelEur = fuelRaw ? parseFloat(fuelRaw) : null
  const totalSeatsRaw = formData.get('total_seats') as string
  const totalSeats = totalSeatsRaw ? parseInt(totalSeatsRaw, 10) : null
  const driverName = (formData.get('driver_name') as string)?.trim() || null
  const driverPhone = (formData.get('driver_phone') as string)?.trim() || null
  const contactPreference = (formData.get('contact_preference') as string) || null

  if (totalSeats !== null) {
    if (isNaN(totalSeats) || totalSeats < 1 || totalSeats > 8) {
      return { error: 'Il numero di posti deve essere tra 1 e 8.' }
    }
    if (totalSeats < ride.seats_taken) {
      return { error: `Non puoi impostare meno di ${ride.seats_taken} posti — hai già ${ride.seats_taken} passeggeri confermati.` }
    }
  }

  const newStatus = totalSeats !== null
    ? (ride.seats_taken >= totalSeats ? 'full' : 'active')
    : undefined

  const { error } = await supabase
    .from('rides')
    .update({
      departure_at: departureAt || undefined,
      meeting_point: meetingPoint,
      notes,
      fuel_contribution_eur: fuelEur,
      ...(driverName && { driver_name: driverName }),
      ...(driverPhone !== null && { driver_phone: driverPhone }),
      ...(contactPreference && { contact_preference: contactPreference }),
      ...(totalSeats !== null && { total_seats: totalSeats, status: newStatus }),
    })
    .eq('id', rideId)

  if (error) return { error: 'Impossibile aggiornare il passaggio. Riprova.' }

  revalidatePath(`/rides/${rideId}/manage`)
  revalidatePath(`/rides/${rideId}`)
  return { ok: true }
}

export async function cancelRideFromTokenAction(formData: FormData) {
  const rideId = formData.get('ride_id') as string
  const token = formData.get('management_token') as string

  if (!rideId || !token) return

  const supabase = createServiceClient()

  const { data: ride } = await supabase
    .from('rides')
    .select('id, management_token')
    .eq('id', rideId)
    .eq('management_token', token)
    .is('deleted_at', null)
    .single()

  if (!ride) return

  await supabase
    .from('rides')
    .update({ status: 'cancelled' })
    .eq('id', rideId)

  revalidatePath('/rides')
  revalidatePath('/')
  redirect('/rides')
}
