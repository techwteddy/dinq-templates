'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function cancelRideAction(formData: FormData): Promise<void> {
  const rideId = formData.get('ride_id') as string | null
  if (!rideId) return

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  await supabase
    .from('rides')
    .update({ status: 'cancelled' })
    .eq('id', rideId)
    .eq('driver_id', session.user.id) // RLS + explicit ownership check

  revalidatePath('/profile')
  revalidatePath('/rides')
  revalidatePath('/')
}
