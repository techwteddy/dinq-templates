import { createClient } from '@/lib/supabase/server'
import { getActiveFestivalId } from './festivals'
import type { RideFilters, RideWithDriver, RideWithDetails, Profile, Ride } from '@/lib/types/database.types'

export async function getRides(filters: RideFilters = {}): Promise<RideWithDriver[]> {
  const supabase = await createClient()
  const festivalId = filters.festivalId ?? (await getActiveFestivalId())

  let query = supabase
    .from('rides')
    .select(`*, driver:profiles(id, display_name, avatar_url)`)
    .eq('festival_id', festivalId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .gte('departure_at', new Date().toISOString())
    .order('departure_at', { ascending: true })

  if (filters.origin) {
    query = query.ilike('origin_city', `%${filters.origin}%`)
  }
  if (filters.returnTrip !== undefined) {
    query = query.eq('return_trip', filters.returnTrip)
  }
  if (filters.date) {
    const dayStart = new Date(filters.date)
    const dayEnd = new Date(filters.date)
    dayEnd.setDate(dayEnd.getDate() + 1)
    query = query
      .gte('departure_at', dayStart.toISOString())
      .lt('departure_at', dayEnd.toISOString())
  }

  query = query.eq('type', filters.type ?? 'offer')

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as RideWithDriver[]
}

export async function getRideById(id: string): Promise<RideWithDetails | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rides')
    .select(`
      *,
      driver:profiles(id, display_name, avatar_url),
      ride_requests(
        id, status, seats_requested, message, passenger_name, passenger_contact, created_at,
        passenger:profiles(id, display_name, avatar_url)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) return null
  return data as unknown as RideWithDetails
}

export async function getRideWithContact(rideId: string, currentUserId: string) {
  const supabase = await createClient()

  const { data: ride, error } = await supabase
    .from('rides')
    .select(`*, driver:profiles(id, display_name, avatar_url)`)
    .eq('id', rideId)
    .is('deleted_at', null)
    .single()

  if (error || !ride) return null

  // Only expose phone after request is accepted
  const { data: accepted } = await supabase
    .from('ride_requests')
    .select('id')
    .eq('ride_id', rideId)
    .eq('passenger_id', currentUserId)
    .eq('status', 'accepted')
    .single()

  let driverPhone: string | null = null
  if (accepted) {
    const driverId = (ride as Ride).driver_id
    if (driverId) {
      const { data: driver } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', driverId)
        .single()
      driverPhone = (driver as Pick<Profile, 'phone'> | null)?.phone ?? null
    }
  }

  return { ride: ride as unknown as RideWithDriver, driverPhone }
}

export async function getMyRides(driverId: string): Promise<RideWithDriver[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rides')
    .select(`*, driver:profiles(id, display_name, avatar_url)`)
    .eq('driver_id', driverId)
    .is('deleted_at', null)
    .order('departure_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as RideWithDriver[]
}
