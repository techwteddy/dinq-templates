'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { acceptRequestAction, declineRequestAction } from './actions'

type RequestRow = {
  id: string
  status: string
  message: string | null
  passenger_name: string | null
  passenger_contact: string | null
}

interface ManageRequestsSectionProps {
  rideId: string
  managementToken: string
  pending: RequestRow[]
  accepted: RequestRow[]
}

export function ManageRequestsSection({
  managementToken,
  pending,
  accepted,
}: ManageRequestsSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  if (pending.length === 0 && accepted.length === 0) {
    return (
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Richieste
        </h2>
        <p className="text-sm text-ink-muted py-2">Nessuna richiesta ancora.</p>
      </section>
    )
  }

  return (
    <section className="mb-6 space-y-4">
      {accepted.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Ospiti confermati ({accepted.length})
          </h2>
          <div className="flex flex-col gap-3">
            {accepted.map((req) => (
              <div key={req.id} className="bg-card rounded-card border border-border p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink">{req.passenger_name ?? 'Ospite'}</p>
                  <Badge variant="success">Confermata</Badge>
                </div>
                {req.passenger_contact && (
                  <p className="mt-1 text-sm text-stone-500">{req.passenger_contact}</p>
                )}
                {req.message && (
                  <p className="mt-1 text-sm text-stone-400 italic">&ldquo;{req.message}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Richieste in attesa ({pending.length})
          </h2>
          <div className="flex flex-col gap-3">
            {pending.map((req) => (
              <div key={req.id} className="bg-card rounded-card border border-border p-4 shadow-card">
                <p className="font-medium text-ink">{req.passenger_name ?? 'Ospite'}</p>
                {req.message && (
                  <p className="mt-1 text-sm text-stone-500 italic">&ldquo;{req.message}&rdquo;</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    loading={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        const res = await acceptRequestAction(req.id, managementToken)
                        if (res?.error) setFeedback(res.error)
                      })
                    }
                  >
                    Accetta
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await declineRequestAction(req.id, managementToken)
                      })
                    }
                  >
                    Rifiuta
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
        </div>
      )}
    </section>
  )
}
