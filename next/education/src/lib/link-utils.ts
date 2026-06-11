/**
 * Utility function to determine if a URL is external
 * @param url The URL to check
 * @returns True if the URL is external (starts with http/https and is not local), false otherwise
 */
export function isExternalLink(url: string): boolean {
  if (!url) return false;

  // Internal absolute paths or relative paths
  if (
    url.startsWith('/') ||
    url.startsWith('#') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const host = urlObj.host;

    // Check if it's localhost or the production domain (if known)
    // For now, we consider any non-relative URL with a protocol as external
    // unless it matches the current window location in a browser environment.
    if (typeof window !== 'undefined') {
      return host !== window.location.host;
    }

    // In SSR, we can't easily check against window.location,
    // so we treat all absolute URLs as potentially external.
    return true;
  } catch (e) {
    // If URL parsing fails, it might be a relative path that doesn't start with /
    return false;
  }
}
