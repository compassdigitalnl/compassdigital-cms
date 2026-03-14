import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ magazineSlug: string }> },
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    // Auth check
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { magazineSlug } = await params

    if (!magazineSlug) {
      return Response.json(
        { error: 'Magazine slug is vereist' },
        { status: 400 },
      )
    }

    // Fetch magazine by slug
    const result = await payload.find({
      collection: 'magazines',
      where: {
        slug: { equals: magazineSlug },
      },
      limit: 1,
      depth: 1, // resolve cover images
    })

    if (result.docs.length === 0) {
      return Response.json(
        { error: 'Magazine niet gevonden' },
        { status: 404 },
      )
    }

    const magazine = result.docs[0]
    const editions = (magazine.editions || []) as any[]
    const now = new Date()

    // Map digital editions with availability info
    const digitalEditions = editions
      .map((edition: any, index: number) => {
        if (!edition.isDigital) return null

        const cover = edition.cover as any
        const coverUrl =
          typeof cover === 'object' && cover?.url ? cover.url : undefined

        // Check availability based on digitalAvailableFrom
        let isAvailable = true
        if (edition.digitalAvailableFrom) {
          isAvailable = new Date(edition.digitalAvailableFrom) <= now
        }

        return {
          index,
          title: edition.title,
          issueNumber: edition.issueNumber || undefined,
          year: edition.year || undefined,
          coverUrl,
          pageCount: edition.pageCount || 0,
          publishDate: edition.publishDate || undefined,
          isAvailable,
        }
      })
      .filter(Boolean)

    const cover = magazine.cover as any
    const coverUrl =
      typeof cover === 'object' && cover?.url ? cover.url : undefined

    return Response.json({
      magazine: {
        name: magazine.name,
        slug: magazine.slug,
        tagline: magazine.tagline || undefined,
        coverUrl,
      },
      editions: digitalEditions,
    })
  } catch (error) {
    console.error('[Library Editions API] Error:', error)
    return Response.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
