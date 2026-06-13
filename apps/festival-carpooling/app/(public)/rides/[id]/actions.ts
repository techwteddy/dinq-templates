'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { sendRequestNotificationEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

export async function requestRideAction(rideId: string, passengerName: string, message: string, passengerContact: string) {
  if (!passengerName.trim()) return { error: 'Il tuo nome è obbligatorio.' }

  const supabase = createServiceClient()

  const { data: ride } = await supabase
    .from('rides')
    .select('status, seats_taken, total_seats, driver_email, driver_name, management_token, origin_city, destination')
    .eq('id', rideId)
    .is('deleted_at', null)
    .single()

  if (!ride) return { error: 'Passaggio non trovato.' }
  if (ride.status === 'full') return { error: 'Questo passaggio è al completo.' }
  if (ride.seats_taken >= ride.total_seats) return { error: 'Questo passaggio è al completo.' }

  const { error } = await supabase.from('ride_requests').insert({
    ride_id: rideId,
    passenger_id: null,
    passenger_name: passengerName.trim().slice(0, 100),
    passenger_contact: passengerContact.trim().slice(0, 200) || null,
    message: message.trim().slice(0, 500) || null,
  })

  if (error) return { error: 'Qualcosa è andato storto. Riprova.' }

  // Notify driver by email
  if (ride.driver_email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const manageUrl = `${appUrl}/rides/${rideId}/manage?token=${ride.management_token}`
    await sendRequestNotificationEmail(
      ride.driver_email,
      ride.driver_name ?? 'Ciao',
      passengerName.trim(),
      passengerContact.trim() || null,
      message.trim() || null,
      `${ride.origin_city} → ${ride.destination}`,
      manageUrl
    )
  }

  revalidatePath(`/rides/${rideId}`)
  return { ok: true }
}

export async function acceptRequestAction(requestId: string, managementToken: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase.rpc('accept_ride_request', {
    p_request_id: requestId,
    p_management_token: managementToken,
  })

  if (error) return { error: 'Qualcosa è andato storto. Riprova.' }
  if (!(data as { ok: boolean }).ok) {
    const errMsg = (data as { error?: string }).error
    if (errMsg === 'no_seats_available') return { error: 'Non ci sono più posti disponibili.' }
    if (errMsg === 'not_authorized') return { error: 'Non autorizzato.' }
    return { error: 'Impossibile accettare la richiesta.' }
  }

  const { data: req } = await supabase
    .from('ride_requests')
    .select('ride_id')
    .eq('id', requestId)
    .single()

  if (req) revalidatePath(`/rides/${req.ride_id}/manage`)
  return { ok: true }
}

export async function declineRequestAction(requestId: string, managementToken: string) {
  const supabase = createServiceClient()

  const { data: req } = await supabase
    .from('ride_requests')
    .select('ride_id, ride:rides(management_token)')
    .eq('id', requestId)
    .single()

  if (!req) return { error: 'Richiesta non trovata.' }

  const ride = req.ride as { management_token: string } | null
  if (ride?.management_token !== managementToken) return { error: 'Non autorizzato.' }

  await supabase
    .from('ride_requests')
    .update({ status: 'declined' })
    .eq('id', requestId)

  revalidatePath(`/rides/${req.ride_id}/manage`)
  return { ok: true }
}
