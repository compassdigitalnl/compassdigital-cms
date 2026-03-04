import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeilisearchSettings, mergeSettings } from '@/lib/meilisearch/settings'

/**
 * GET /api/search/config
 *
 * Returns instant search display configuration (layout mode + sections).
 * Used by the InstantSearch frontend component.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    const cmsSettings = await getMeilisearchSettings(payload)
    const settings = mergeSettings(cmsSettings)

    return NextResponse.json({
      layout: settings.instantSearchLayout,
      sections: settings.instantSearchSections.map((s: any) => ({
        collection: s.collection,
        enabled: s.enabled ?? true,
        label: s.label || s.collection,
        icon: s.icon || 'package',
        maxResults: s.maxResults || 5,
      })),
    })
  } catch (error: any) {
    console.error('[search/config] Error:', error)

    // Return defaults on error
    return NextResponse.json({
      layout: 'stacked',
      sections: [
        { collection: 'products', enabled: true, label: 'Producten', icon: 'package', maxResults: 5 },
        { collection: 'blog-posts', enabled: true, label: 'Artikelen', icon: 'book-open', maxResults: 3 },
        { collection: 'pages', enabled: true, label: "Pagina's", icon: 'file-text', maxResults: 3 },
      ],
    })
  }
}
