import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shawkat Hossain Maruf - Developer Portfolio',
    short_name: 'Shawkat Maruf',
    description: 'Shawkat Hossain Maruf (@shawkath646) is a Computer Science and Engineering student at Sejong University and a passionate full-stack developer. He specializes in building fast, modern web applications using React, Next.js, and Tailwind CSS, and also develops high-performance Android apps with React Native. Currently expanding his expertise in Artificial Intelligence, Data Science, and Analytics.',
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
