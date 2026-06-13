'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { completeOnboardingAction } from './actions'

interface OnboardingFormProps {
  email?: string
}

export function OnboardingForm({ email }: OnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(completeOnboardingAction, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {email && (
        <p className="text-xs text-stone-400 -mt-2">Accesso come {email}</p>
      )}
      <Input
        label="Il tuo nome"
        name="display_name"
        placeholder="Come ti chiamano?"
        required
        autoFocus
        error={state?.fieldErrors?.display_name?.[0]}
      />
      <Input
        label="Numero di telefono"
        name="phone"
        type="tel"
        placeholder="+39 ..."
        hint="Condiviso solo con le persone con cui condividi il passaggio, non visibile pubblicamente."
        error={state?.fieldErrors?.phone?.[0]}
      />
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" loading={isPending} className="w-full">
        Inizia
      </Button>
    </form>
  )
}
