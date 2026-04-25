import type { MetadataRoute } from 'next'
import appBaseUrl from '@/data/appBaseUrl'
import { defaultLocale } from '@/lib/locale'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: [
      new URL("/sitemap.xml", appBaseUrl).toString(),
      new URL(`/${defaultLocale}/about/gallery/sitemap.xml`, appBaseUrl).toString()
    ],
  }
}