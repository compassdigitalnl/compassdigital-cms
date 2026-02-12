import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'

  // Fetch custom disallow paths from settings
  let customDisallowPaths: string[] = []

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' })
    customDisallowPaths = settings.robotsDisallow?.map((r: any) => r.path) || []
  } catch (error) {
    console.log('Settings not available, using default robots.txt')
  }

  // ─── Staging/Preview: Block everything ─────────────────────
  if (
    siteUrl.includes('staging') ||
    siteUrl.includes('vercel.app') ||
    siteUrl.includes('preview') ||
    siteUrl.includes('localhost')
  ) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // ─── Production: Allow with exclusions ─────────────────────
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',       // Payload admin panel
          '/admin/*',
          '/api',         // API routes
          '/api/*',
          '/_next',       // Next.js internals
          '/preview',     // Preview mode
          '/draft',       // Draft content
          ...customDisallowPaths, // Custom paths from settings
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
