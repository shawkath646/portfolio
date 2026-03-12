import type { MetadataRoute } from 'next'
import appBaseUrl from '@/data/appBaseUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: [
      new URL("/sitemap.xml", appBaseUrl).toString(),
      new URL("/gallery/sitemap.xml", appBaseUrl).toString()
    ],
  }
}