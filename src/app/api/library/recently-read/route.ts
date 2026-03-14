import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    // Auth check
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const userAny = user as any

    if (!userAny.readingProgress) {
      return Response.json({ recentlyRead: [] })
    }

    let progress: any[]
    try {
      progress =
        typeof userAny.readingProgress === 'string'
          ? JSON.parse(userAny.readingProgress)
          : userAny.readingProgress
    } catch {
      return Response.json({ recentlyRead: [] })
    }

    // Sort by last read, take 10 most recent
    const recent = progress
      .sort(
        (a, b) =>
          new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime(),
      )
      .slice(0, 10)

    // Enrich with magazine data
    const slugs = [...new Set(recent.map((r) => r.magazineSlug))]
    const magazineMap = new Map<string, any>()

    for (const slug of slugs) {
      const res = await payload.find({
        collection: 'magazines',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      })
      if (res.docs.length > 0) {
        magazineMap.set(slug, res.docs[0])
      }
    }

    const recentlyRead = recent
      .map((entry) => {
        const magazine = magazineMap.get(entry.magazineSlug)
        if (!magazine) return null

        const editions = (magazine.editions || []) as any[]
        const edition = editions[entry.editionIndex]
        if (!edition) return null

        const cover = edition.cover as any
        const coverUrl =
          typeof cover === 'object' && cover?.url ? cover.url : undefined

        return {
          magazineId: String(magazine.id),
          magazineName: magazine.name,
          magazineSlug: magazine.slug,
          editionIndex: entry.editionIndex,
          editionTitle: edition.title,
          coverUrl,
          currentPage: entry.currentPage,
          totalPages: edition.pageCount || 0,
          lastReadAt: entry.lastReadAt,
        }
      })
      .filter(Boolean)

    return Response.json({ recentlyRead })
  } catch (error) {
    console.error('[Library Recently Read API] Error:', error)
    return Response.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
