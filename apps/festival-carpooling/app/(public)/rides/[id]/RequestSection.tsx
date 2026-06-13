'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea } from '@/components/ui/Input'
import { requestRideAction } from './actions'
import type { RideWithDetails, RideRequest } from '@/lib/types/database.types'
import type { Session } from '@supabase/supabase-js'

interface RequestSectionProps {
  ride: RideWithDetails
  isDriver: boolean
  myRequest: RideRequest | null
  session: Session | null
  acceptedPassengers: (RideRequest & {
    passenger: { id: string; display_name: string; avatar_url: string | null } | null
  })[]
}

export function RequestSection({
  ride,
  isDriver,
  myRequest,
  acceptedPassengers,
}: RequestSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [passengerName, setPassengerName] = useState('')
  const [passengerContact, setPassengerContact] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const available = ride.total_seats - ride.seats_taken

  // Legacy: driver with auth session — show accepted passengers (kept for admin-created rides)
  if (isDriver) {
    return (
      <div className="space-y-3">
        {acceptedPassengers.length > 0 && (
          <div className="bg-card rounded-card border border-border p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
              Persone confermate ({acceptedPassengers.length})
            </p>
            <div className="space-y-3">
              {acceptedPassengers.map((req) => {
                const name = req.passenger?.display_name ?? (req as unknown as { passenger_name?: string }).passenger_name ?? '?'
                return (
                  <div key={req.id} className="flex items-center gap-3">
                    <Avatar
                      src={req.passenger?.avatar_url}
                      name={name}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-stone-700">{name}</span>
                    <Badge variant="success" className="ml-auto">Confermata</Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Legacy auth: already has a request
  if (myRequest) {
    const statusMap = {
      pending: { label: 'Richiesta inviata', color: 'bg-amber-50 border-amber-100 text-amber-700' },
      accepted: { label: 'Sei con noi! ✓', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
      declined: { label: 'Richiesta rifiutata', color: 'bg-red-50 border-red-100 text-red-600' },
      cancelled: { label: 'Richiesta annullata', color: 'bg-stone-50 border-stone-100 text-stone-500' },
    }
    const { label, color } = statusMap[myRequest.status]
    return (
      <div className={`rounded-3xl border px-5 py-4 ${color}`}>
        <p className="font-semibold">{label}</p>
      </div>
    )
  }

  // Submitted successfully
  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4">
        <p className="font-semibold text-emerald-800">Richiesta inviata!</p>
        <p className="mt-1 text-sm text-emerald-700">
          Chi guida la vedrà a breve e potrà accettarti.
        </p>
      </div>
    )
  }

  // No seats left
  if (available <= 0) {
    return (
      <div className="rounded-card bg-card border border-border px-5 py-4 text-center">
        <p className="text-sm text-ink-muted">Questo passaggio è al completo.</p>
      </div>
    )
  }

  // Anonymous request form
  return (
    <div className="bg-card rounded-card border border-border p-5 shadow-card">
      <p className="font-serif font-bold text-ink mb-4">Richiedi un posto</p>
      <div className="flex flex-col gap-4">
        <Input
          label="Il tuo nome"
          placeholder="Luna"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          required
        />
        <Input
          label="Come contattarti"
          placeholder="Telefono, email o Instagram"
          value={passengerContact}
          onChange={(e) => setPassengerContact(e.target.value)}
          hint="Chi guida lo vedrà solo se accetta la richiesta."
        />
        <Textarea
          label="Messaggio"
          placeholder="Presentati — da dove parti?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>
      {feedback && <p className="mt-2 text-sm text-red-600">{feedback}</p>}
      <Button
        className="w-full mt-4"
        loading={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await requestRideAction(ride.id, passengerName, message, passengerContact)
            if (res?.error) {
              setFeedback(res.error)
            } else {
              setSubmitted(true)
            }
          })
        }
      >
        Invia richiesta
      </Button>
    </div>
  )
}
