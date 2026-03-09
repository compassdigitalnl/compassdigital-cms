/**
 * Dynamic Web App Manifest Route
 *
 * Serves /manifest.webmanifest with tenant-specific PWA metadata
 * fetched from Payload CMS settings.
 */

import { generateManifest } from '@/features/pwa/lib/manifest-generator'

export const dynamic = 'force-dynamic'

export async function GET() {
  const manifest = await generateManifest()

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
