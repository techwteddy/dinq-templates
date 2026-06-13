import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carpooling',
    short_name: 'Carpooling',
    description: 'Carpooling per eventi e festival.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f7',
    theme_color: '#1c1917',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
