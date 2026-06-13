import { createClient } from '@/lib/supabase/server'
import { getActiveFestivalId } from './festivals'
import type { CommunityStats } from '@/lib/types/database.types'

export async function getCommunityStats(
  scope: 'today' | 'festival' | 'all_time' = 'festival'
): Promise<CommunityStats> {
  const supabase = await createClient()
  const festivalId = await getActiveFestivalId()

  const { data, error } = await supabase.rpc('get_community_stats', {
    p_festival_id: festivalId,
    p_scope: scope,
  })

  if (error) throw error

  const result = data as CommunityStats | null
  return result ?? { total_rides: 0, total_passengers: 0, total_co2_saved_kg: 0 }
}
