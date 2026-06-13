'use client'

import { useActionState, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'
import { ChatIcon, PhoneIcon, PlaneIcon } from '@/components/ui/icons'
import { updateRideAction } from './actions'
import type { ContactPreference } from '@/lib/utils/contact'

const contactOptions: { value: ContactPreference; label: string; icon: ReactNode }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: <ChatIcon className="w-5 h-5" /> },
  { value: 'call',     label: 'Chiamata', icon: <PhoneIcon className="w-5 h-5" /> },
  { value: 'telegram', label: 'Telegram', icon: <PlaneIcon className="w-5 h-5" /> },
]

interface ManageEditFormProps {
  rideId: string
  managementToken: string
  rideType: 'offer' | 'seek'
  departureDatetimeLocal: string
  meetingPoint: string
  notes: string
  fuelContributionEur: number | null
  totalSeats: number
  seatsTaken: number
  driverName: string
  driverPhone: string
  contactPreference: ContactPreference
}

export function ManageEditForm({
  rideId,
  managementToken,
  rideType,
  departureDatetimeLocal,
  meetingPoint,
  notes,
  fuelContributionEur,
  totalSeats,
  seatsTaken,
  driverName,
  driverPhone,
  contactPreference,
}: ManageEditFormProps) {
  const isOffer = rideType === 'offer'
  const [state, formAction, isPending] = useActionState(
    updateRideAction as (_prev: unknown, fd: FormData) => Promise<{ error: string } | { ok: boolean } | null>,
    null
  )
  const [contactPref, setContactPref] = useState<ContactPreference>(contactPreference)

  return (
    <form action={formAction} className="flex flex-col gap-4 bg-card rounded-card border border-border p-5 shadow-card">
      <input type="hidden" name="ride_id" value={rideId} />
      <input type="hidden" name="management_token" value={managementToken} />

      {'error' in (state ?? {}) && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {(state as { error: string }).error}
        </div>
      )}
      {'ok' in (state ?? {}) && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
          Modifiche salvate!
        </div>
      )}

      <Input
        label="Il tuo nome"
        name="driver_name"
        defaultValue={driverName}
        placeholder="Luna"
      />

      <Input
        label="Numero di telefono"
        name="driver_phone"
        type="tel"
        defaultValue={driverPhone}
        placeholder="+39 340 000 0000"
      />

      <div>
        <p className="text-sm font-medium text-ink mb-2">Come preferisci essere contentatə?</p>
        <div className="grid grid-cols-3 gap-2">
          {contactOptions.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setContactPref(value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl border py-3 text-xs font-medium transition-colors',
                contactPref === value
                  ? 'bg-forest text-card border-forest'
                  : 'bg-background text-ink-subtle border-border'
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <input type="hidden" name="contact_preference" value={contactPref} />
      </div>

      <Input
        label="Posti totali"
        name="total_seats"
        type="number"
        min={seatsTaken || 1}
        max={8}
        defaultValue={totalSeats}
        hint={seatsTaken > 0 ? `Minimo ${seatsTaken} — hai già ${seatsTaken} passeggeri confermati.` : undefined}
      />
      <Input
        label="Data e ora di partenza"
        name="departure_at"
        type="datetime-local"
        defaultValue={departureDatetimeLocal}
      />
      {isOffer && (
        <Input
          label="Punto di ritrovo"
          name="meeting_point"
          placeholder="es. Stazione Centrale"
          defaultValue={meetingPoint}
        />
      )}
      {isOffer && (
        <Input
          label="Contributo carburante (€)"
          name="fuel_contribution_eur"
          type="number"
          min={0}
          step={1}
          defaultValue={fuelContributionEur ?? ''}
        />
      )}
      <Textarea
        label="Note"
        name="notes"
        placeholder="Spazio bagagli, preferenze, animali..."
        defaultValue={notes}
      />
      <Button type="submit" variant="secondary" loading={isPending}>
        Salva modifiche
      </Button>
    </form>
  )
}
