import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Admin Panel | Shawkat Hossain Maruf',
    short_name: 'shawkath646',
    description: 'Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development. Building modern web applications and mobile solutions with cutting-edge technologies.',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    lang: 'en',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'any',
      }
    ],
  }
}
