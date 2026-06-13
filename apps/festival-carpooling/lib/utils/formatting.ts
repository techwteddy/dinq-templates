export function formatSeats(taken: number, total: number): string {
  const available = total - taken
  if (available <= 0) return 'Full'
  return `${available} seat${available !== 1 ? 's' : ''} free`
}

export function formatCo2(kg: number): string {
  if (kg <= 0) return ''
  const rounded = Math.round(kg * 10) / 10
  return `~${rounded} kg CO₂`
}

export function formatCo2Equivalent(kg: number): string {
  const km = Math.round(kg / 0.12)
  return `${km} km not driven alone`
}
