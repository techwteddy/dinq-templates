import { createClient } from '@/lib/supabase/server'
import { ACTIVE_FESTIVAL_SLUG } from '@/lib/config'

async function fetchFestival<T>(select: string): Promise<T> {
  const supabase = await createClient()
  const { data, error } = ACTIVE_FESTIVAL_SLUG
    ? await supabase.from('festivals').select(select).eq('slug', ACTIVE_FESTIVAL_SLUG).single()
    : await supabase.from('festivals').select(select).eq('is_active', true).limit(1).single()

  if (error || !data) throw new Error('Active festival not found')
  return data as T
}

export async function getActiveFestivalId(): Promise<string> {
  const { id } = await fetchFestival<{ id: string }>('id')
  return id
}

export async function getActiveFestival() {
  return fetchFestival<{
    id: string
    name: string
    slug: string
    location: string | null
    starts_at: string | null
    ends_at: string | null
    is_active: boolean
    created_at: string
  }>('*')
}
