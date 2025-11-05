import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shawkat Hossain Maruf - Full-Stack Developer & Software Engineer',
    short_name: 'shawkath646',
    description: 'Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development. Building modern web applications and mobile solutions with cutting-edge technologies.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    orientation: 'portrait',
    lang: 'en',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
  }
}
