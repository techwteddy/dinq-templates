const CACHE_VERSION = 'v1'
const STATIC_CACHE = `carpooling-static-${CACHE_VERSION}`
const OFFLINE_URL = '/offline'

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(['/', '/rides', '/offline'])
    )
  )
  self.skipWaiting()
})

// Remove old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('carpooling-') && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never cache: Supabase API calls, auth, POST requests
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/auth/') ||
    request.method !== 'GET'
  ) {
    return
  }

  // Next.js static assets: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    )
    return
  }

  // Pages: network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        return cached ?? caches.match(OFFLINE_URL) ?? new Response('Offline', { status: 503 })
      })
  )
})
