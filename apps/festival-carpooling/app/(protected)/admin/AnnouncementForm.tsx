'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { createAnnouncementAction } from './actions'

export function AnnouncementForm() {
  const [state, formAction, isPending] = useActionState(createAnnouncementAction, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        label="Titolo"
        name="title"
        placeholder="Aggiornamento importante"
        required
        error={state?.fieldErrors?.title?.[0]}
      />
      <Textarea
        label="Testo"
        name="body"
        placeholder="Dettagli..."
        required
        rows={4}
        error={state?.fieldErrors?.body?.[0]}
      />
      <div className="flex items-center gap-3">
        <input type="checkbox" id="pinned" name="pinned" value="true" className="h-4 w-4 rounded accent-stone-900" />
        <label htmlFor="pinned" className="text-sm font-medium text-stone-700">
          Fissa in homepage
        </label>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-600">Annuncio pubblicato!</p>}
      <Button type="submit" loading={isPending}>
        Pubblica annuncio
      </Button>
    </form>
  )
}
