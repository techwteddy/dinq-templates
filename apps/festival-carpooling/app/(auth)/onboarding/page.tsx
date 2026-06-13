import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from './OnboardingForm'

export const metadata = { title: 'Crea il tuo profilo' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  // If profile already exists, skip onboarding
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', session.user.id)
    .single()

  if (existing) redirect('/')

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-ink">Ancora un passo</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Scegli il tuo nome in modo che le altre persone possano riconoscerti.
          </p>
        </div>
        <OnboardingForm email={session.user.email} />
      </div>
    </div>
  )
}
