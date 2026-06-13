export function formatDepartureDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('it', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return formatDepartureDate(isoString)
  if (diffDays === 0) return 'Oggi'
  if (diffDays === 1) return 'Domani'
  if (diffDays < 7) return `Tra ${diffDays} giorni`
  return new Intl.DateTimeFormat('it', { month: 'short', day: 'numeric' }).format(date)
}

export function toDatetimeLocal(isoString: string): string {
  const date = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
