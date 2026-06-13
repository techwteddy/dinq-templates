'use client'

import { useActionState, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { ChatIcon, PhoneIcon, PlaneIcon, CarIcon, SearchIcon } from '@/components/ui/icons'
import type { ContactPreference } from '@/lib/utils/contact'

const contactOptions: { value: ContactPreference; label: string; icon: ReactNode }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: <ChatIcon className="w-5 h-5" /> },
  { value: 'call',     label: 'Chiamata', icon: <PhoneIcon className="w-5 h-5" /> },
  { value: 'telegram', label: 'Telegram', icon: <PlaneIcon className="w-5 h-5" /> },
]

interface RideFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prev: any, formData: FormData) => Promise<any>
  festivalName: string
  minDate?: string
  maxDate?: string
}

export function RideForm({ action, festivalName, minDate, maxDate }: RideFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)
  const [isReturn, setIsReturn] = useState(false)
  const [rideType, setRideType] = useState<'offer' | 'seek'>('offer')
  const [contactPref, setContactPref] = useState<ContactPreference>('whatsapp')

  useEffect(() => {
    if (state?.fieldErrors) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [state])

  const isSeek = rideType === 'seek'

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Offer / Seek toggle */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Cosa vuoi fare?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRideType('offer')}
            className={cn(
              'flex flex-col gap-0.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors text-left',
              !isSeek ? 'bg-forest text-card border-forest' : 'bg-card text-ink-subtle border-border'
            )}
          >
            <CarIcon className="w-4 h-4" />
            Offro un passaggio
          </button>
          <button
            type="button"
            onClick={() => setRideType('seek')}
            className={cn(
              'flex flex-col gap-0.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors text-left',
              isSeek ? 'bg-forest text-card border-forest' : 'bg-card text-ink-subtle border-border'
            )}
          >
            <SearchIcon className="w-4 h-4" />
            Cerco un passaggio
          </button>
        </div>
        <input type="hidden" name="ride_type" value={rideType} />
      </div>

      {/* Trip direction */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Direzione</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsReturn(false)}
            className={cn(
              'flex flex-col gap-0.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors text-left',
              !isReturn ? 'bg-ink text-card border-ink' : 'bg-card text-ink-subtle border-border'
            )}
          >
            <span className="text-base">→</span>
            Verso {festivalName}
          </button>
          <button
            type="button"
            onClick={() => setIsReturn(true)}
            className={cn(
              'flex flex-col gap-0.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors text-left',
              isReturn ? 'bg-ink text-card border-ink' : 'bg-card text-ink-subtle border-border'
            )}
          >
            <span className="text-base">←</span>
            Da {festivalName}
          </button>
        </div>
        <input type="hidden" name="return_trip" value={isReturn ? 'true' : 'false'} />
      </div>

      {/* Route */}
      <div key={`${isReturn}-${rideType}`} className="flex flex-col gap-3">
        {isReturn ? (
          <>
            <FestivalBadge label="Da" name={festivalName} />
            <input type="hidden" name="origin_city" value={festivalName} />
            <Input
              label="Dove torni?"
              name="destination"
              placeholder="es. Milano"
              required
              error={state?.fieldErrors?.destination?.[0]}
            />
          </>
        ) : (
          <>
            <Input
              label={isSeek ? 'Da dove parti?' : 'Da dove parti?'}
              name="origin_city"
              placeholder="es. Milano"
              required
              error={state?.fieldErrors?.origin_city?.[0]}
            />
            <input type="hidden" name="destination" value={festivalName} />
            <FestivalBadge label="A" name={festivalName} />
          </>
        )}
      </div>

      {!isSeek && (
        <Input
          label="Soste intermedie"
          name="stops"
          placeholder="es. Bologna, Firenze"
          hint="Separale con una virgola."
        />
      )}

      <Input
        label="Data e ora"
        name="departure_at"
        type="datetime-local"
        required
        min={minDate}
        max={maxDate}
        error={state?.fieldErrors?.departure_at?.[0]}
      />

      {isSeek ? (
        <Input
          label="Quante persone siete?"
          name="total_seats"
          type="number"
          min={1}
          max={4}
          defaultValue={1}
          error={state?.fieldErrors?.total_seats?.[0]}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <Input
            label="Posti disponibili"
            name="total_seats"
            type="number"
            min={1}
            max={8}
            defaultValue={3}
            required
            error={state?.fieldErrors?.total_seats?.[0]}
          />
          <Input
            label="Contributo carburante (€)"
            name="fuel_contribution_eur"
            type="number"
            min={0}
            step={1}
            placeholder="20"
            error={state?.fieldErrors?.fuel_contribution_eur?.[0]}
          />
        </div>
      )}

      {!isSeek && (
        <Input
          label="Punto di ritrovo"
          name="meeting_point"
          placeholder="es. Stazione Centrale, ingresso principale"
          error={state?.fieldErrors?.meeting_point?.[0]}
        />
      )}

      <Textarea
        label="Note"
        name="notes"
        placeholder={isSeek ? 'Presentati, racconta da dove vieni...' : 'Spazio bagagli, preferenze musicali, animali...'}
        error={state?.fieldErrors?.notes?.[0]}
      />

      {!isSeek && (
        <Input
          label="Distanza approssimativa (km)"
          name="distance_km"
          type="number"
          min={1}
          max={9999}
          placeholder="es. 300"
          hint="Per stimare il CO₂ risparmiato."
          error={state?.fieldErrors?.distance_km?.[0]}
        />
      )}

      {/* Identity */}
      <div className="border-t border-border pt-5 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
          Chi sei?
        </p>
        <p className="text-sm text-ink-subtle -mt-2">
          {isSeek
            ? 'Chi guida potrà contattarti direttamente al tuo numero.'
            : 'Ti invieremo un link per gestire il passaggio e accettare le richieste.'}
        </p>
        <Input
          label="Il tuo nome"
          name="driver_name"
          placeholder="Luna"
          required
          error={state?.fieldErrors?.driver_name?.[0]}
        />
        <Input
          label="Numero di telefono"
          name="driver_phone"
          type="tel"
          placeholder="+39 340 000 0000"
          required
          error={state?.fieldErrors?.driver_phone?.[0]}
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
                    : 'bg-card text-ink-subtle border-border'
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
          label="La tua email"
          name="driver_email"
          type="email"
          placeholder="luna@esempio.it"
          required
          hint="Per il link di gestione."
          error={state?.fieldErrors?.driver_email?.[0]}
        />
      </div>

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        {isSeek ? 'Pubblica ricerca' : 'Pubblica passaggio'}
      </Button>
    </form>
  )
}

function FestivalBadge({ label, name }: { label: string; name: string }) {
  return (
    <div className="rounded-2xl border border-forest px-4 py-3" style={{ backgroundColor: '#e6efe4' }}>
      <p className="text-xs font-medium mb-0.5" style={{ color: '#2d5a27', opacity: 0.7 }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: '#2d5a27' }}>{name}</p>
    </div>
  )
}
