import { CO2_DISCLAIMER } from '@/lib/config'
import { formatCo2, formatCo2Equivalent } from '@/lib/utils/formatting'
import { LeafIcon } from '@/components/ui/icons'

interface Co2BadgeProps {
  kg: number
  variant?: 'compact' | 'full'
}

export function Co2Badge({ kg, variant = 'compact' }: Co2BadgeProps) {
  if (kg <= 0) return null

  if (variant === 'compact') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-forest-light border border-forest/20 px-2.5 py-0.5 text-xs font-medium text-forest">
        <LeafIcon className="w-3 h-3" /> {formatCo2(kg)} risparmiati
      </span>
    )
  }

  return (
    <div className="rounded-card bg-forest-light border border-forest/20 px-4 py-3">
      <p className="text-sm font-semibold text-forest">
        {formatCo2(kg)} CO₂ evitati
      </p>
      <p className="mt-0.5 text-xs text-forest/70">
        Equivalente a {formatCo2Equivalent(kg)}
      </p>
      <p className="mt-2 text-xs text-ink-subtle">{CO2_DISCLAIMER}</p>
    </div>
  )
}
