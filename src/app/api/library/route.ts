import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    // Get user from session
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Fetch all visible magazines
    const result = await payload.find({
      collection: 'magazines',
      where: {
        visible: { equals: true },
      },
      limit: 100,
      depth: 1, // resolve cover images
    })

    // Map to magazine summaries, only including those with digital editions
    const magazines = result.docs
      .map((magazine) => {
        const editions = (magazine.editions || []) as any[]
        const digitalEditions = editions.filter((e: any) => e.isDigital)

        if (digitalEditions.length === 0) return null

        const cover = magazine.cover as any
        const coverUrl =
          typeof cover === 'object' && cover?.url ? cover.url : undefined

        return {
          id: String(magazine.id),
          name: magazine.name,
          slug: magazine.slug,
          coverUrl,
          tagline: magazine.tagline || undefined,
          totalEditions: editions.length,
          digitalEditions: digitalEditions.length,
        }
      })
      .filter(Boolean)

    // Get recently read from user's reading progress
    const userAny = user as any
    let recentlyRead: any[] = []

    if (userAny.readingProgress) {
      try {
        const progress =
          typeof userAny.readingProgress === 'string'
            ? JSON.parse(userAny.readingProgress)
            : userAny.readingProgress

        // Sort by last read, take 5 most recent
        const recent = (progress as any[])
          .sort(
            (a, b) =>
              new Date(b.lastReadAt).getTime() -
              new Date(a.lastReadAt).getTime(),
          )
          .slice(0, 5)

        // Enrich with magazine data
        const slugs = [...new Set(recent.map((r) => r.magazineSlug))]
        const magazineMap = new Map<string, any>()

        for (const slug of slugs) {
          const found = result.docs.find((m) => m.slug === slug)
          if (found) magazineMap.set(slug, found)
        }

        recentlyRead = recent
          .map((entry) => {
            const mag = magazineMap.get(entry.magazineSlug)
            if (!mag) return null

            const editions = (mag.editions || []) as any[]
            const edition = editions[entry.editionIndex]
            if (!edition) return null

            const edCover = edition.cover as any
            const coverUrl =
              typeof edCover === 'object' && edCover?.url
                ? edCover.url
                : undefined

            return {
              magazineId: String(mag.id),
              magazineName: mag.name,
              magazineSlug: mag.slug,
              editionIndex: entry.editionIndex,
              editionTitle: edition.title,
              coverUrl,
              currentPage: entry.currentPage,
              totalPages: edition.pageCount || 0,
              lastReadAt: entry.lastReadAt,
            }
          })
          .filter(Boolean)
      } catch {
        // If reading progress is corrupted, ignore it
        recentlyRead = []
      }
    }

    return Response.json({ magazines, recentlyRead })
  } catch (error) {
    console.error('[Library API] Error:', error)
    return Response.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
