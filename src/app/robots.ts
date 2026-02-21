import type { MetadataRoute } from 'next'
import { getEnv } from '@/utils/getEnv';

const baseUrl = getEnv("NEXT_PUBLIC_APP_BASE_URL");
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}