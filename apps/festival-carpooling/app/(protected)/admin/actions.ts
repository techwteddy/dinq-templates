'use server'

import { createClient } from '@/lib/supabase/server'
import { getActiveFestivalId } from '@/lib/queries/festivals'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) redirect('/')
  return { supabase, session }
}

const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  pinned: z.boolean().default(false),
})

export async function createAnnouncementAction(_prev: unknown, formData: FormData) {
  const { supabase, session } = await requireAdmin()

  const parsed = announcementSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    pinned: formData.get('pinned') === 'true',
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const festivalId = await getActiveFestivalId()

  const { error } = await supabase.from('announcements').insert({
    title: parsed.data.title,
    body: parsed.data.body,
    pinned: parsed.data.pinned,
    author_id: session.user.id,
    festival_id: festivalId,
    published: true,
  })

  if (error) return { error: 'Impossibile pubblicare l\'annuncio.' }

  revalidatePath('/')
  revalidatePath('/announcements')
  revalidatePath('/admin')
  return { ok: true }
}

export async function deleteRideAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()
  const rideId = formData.get('ride_id') as string
  const reportId = formData.get('report_id') as string | null

  await supabase
    .from('rides')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', rideId)

  if (reportId) {
    await supabase
      .from('reports')
      .update({ resolved: true })
      .eq('id', reportId)
  }

  revalidatePath('/rides')
  revalidatePath('/admin')
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()
  const id = formData.get('announcement_id') as string

  await supabase.from('announcements').delete().eq('id', id)

  revalidatePath('/')
  revalidatePath('/announcements')
  revalidatePath('/admin')
}

export async function resolveReportAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()
  const reportId = formData.get('report_id') as string

  await supabase
    .from('reports')
    .update({ resolved: true })
    .eq('id', reportId)

  revalidatePath('/admin')
}
