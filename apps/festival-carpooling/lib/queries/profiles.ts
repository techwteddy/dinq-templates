import { createClient } from '@/lib/supabase/server'
import type { Profile, MyRequest } from '@/lib/types/database.types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function getMyRequests(passengerId: string): Promise<MyRequest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ride_requests')
    .select(`
      *,
      ride:rides(
        id, origin_city, destination, departure_at, status,
        driver:profiles(id, display_name, avatar_url)
      )
    `)
    .eq('passenger_id', passengerId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as MyRequest[]
}
