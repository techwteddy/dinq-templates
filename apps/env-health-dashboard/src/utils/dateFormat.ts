/**
 * Formats an ISO 8601 timestamp string into a human-readable relative time string.
 *
 * Examples: "Just now", "5 seconds ago", "2 minutes ago", "1 hour ago"
 *
 * @param isoString - ISO 8601 timestamp string (e.g., "2024-01-15T10:30:00.000Z")
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) {
    return 'Just now';
  }

  if (seconds < 10) {
    return 'Just now';
  }
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Formats an ISO 8601 timestamp string into a localized date-time string.
 *
 * @param isoString - ISO 8601 timestamp string
 * @param locale - BCP 47 locale string (default: 'en-US')
 * @returns Formatted date-time string (e.g., "Apr 10, 2024, 10:30:00 AM")
 */
export function formatDateTime(isoString: string, locale: string = 'en-US'): string {
  const date = new Date(isoString);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Formats milliseconds into a human-readable duration string.
 *
 * Examples: "150ms", "1.5s", "2m 30s"
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }

  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}
