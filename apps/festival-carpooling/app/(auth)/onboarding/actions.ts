'use server'

import { createClient } from '@/lib/supabase/server'
import { onboardingSchema } from '@/lib/validation/profile'
import { redirect } from 'next/navigation'

export async function completeOnboardingAction(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const parsed = onboardingSchema.safeParse({
    display_name: formData.get('display_name'),
    phone: formData.get('phone'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('profiles').insert({
    id: session.user.id,
    display_name: parsed.data.display_name,
    phone: parsed.data.phone ?? null,
  })

  if (error?.code === '23505') {
    // Profile already exists (duplicate tab) — proceed
    redirect('/')
  }

  if (error) {
    return { error: 'Impossibile creare il profilo. Riprova.' }
  }

  redirect('/')
}
