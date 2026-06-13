import { getCommunityStats } from '@/lib/queries/stats'
import { CO2_DISCLAIMER } from '@/lib/config'
import { LeafIcon } from '@/components/ui/icons'

export async function CommunityImpact() {
  const [festival, today] = await Promise.all([
    getCommunityStats('festival').catch(() => null),
    getCommunityStats('today').catch(() => null),
  ])

  if (!festival || !today) return null
  if (festival.total_passengers < 2) return null

  return (
    <section aria-label="Impatto della comunità" className="mt-8">
      <h2 className="mb-3 font-serif text-base font-bold text-ink flex items-center gap-2">
        <LeafIcon className="w-4 h-4 text-forest" /> Impatto della comunità
      </h2>

      <div className="grid grid-cols-3 gap-2">
        <StatBlock value={festival.total_rides} label="passaggi condivisi" />
        <StatBlock value={festival.total_passengers} label="persone abbinate" />
        <StatBlock
          value={`~${Math.round(festival.total_co2_saved_kg)} kg`}
          label="CO₂ evitato"
          eco
        />
      </div>

      {today.total_rides > 0 && (
        <p className="mt-2.5 text-xs text-ink-subtle">
          {today.total_rides} passaggio{today.total_rides !== 1 ? 'i' : ''} condiviso{today.total_rides !== 1 ? '' : ''} oggi
          {today.total_co2_saved_kg > 0 && (
            <> · ~{Math.round(today.total_co2_saved_kg)} kg CO₂ evitati</>
          )}
        </p>
      )}

      <p className="mt-2 text-xs text-ink-subtle leading-relaxed">{CO2_DISCLAIMER}</p>
    </section>
  )
}

function StatBlock({
  value,
  label,
  eco = false,
}: {
  value: string | number
  label: string
  eco?: boolean
}) {
  return (
    <div
      className={`rounded-card px-3 py-4 text-center border ${
        eco
          ? 'bg-forest-light border-forest/20'
          : 'bg-card border-border'
      }`}
    >
      <p
        className={`font-serif text-xl font-bold tabular-nums leading-tight ${
          eco ? 'text-forest' : 'text-ink'
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs leading-tight text-ink-subtle">{label}</p>
    </div>
  )
}
