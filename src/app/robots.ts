import type { MetadataRoute } from 'next'

const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://shawkath646.pro';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${appBaseUrl}/sitemap.xml`,
  }
}