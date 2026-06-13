import { createClient } from '@/lib/supabase/server'
import { getActiveFestivalId } from './festivals'
import type { Announcement } from '@/lib/types/database.types'

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient()
  const festivalId = await getActiveFestivalId()

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('festival_id', festivalId)
    .eq('published', true)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data ?? []
}

export async function getPinnedAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient()
  const festivalId = await getActiveFestivalId()

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('festival_id', festivalId)
    .eq('published', true)
    .eq('pinned', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw error
  return data ?? []
}
