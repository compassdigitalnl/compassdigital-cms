import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

interface ReadingProgressEntry {
  magazineSlug: string
  editionIndex: number
  currentPage: number
  lastReadAt: string
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    // Auth check
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const body = await request.json()
    const { magazineSlug, editionIndex, currentPage, totalPages } = body

    // Validate input
    if (
      !magazineSlug ||
      editionIndex === undefined ||
      editionIndex === null ||
      currentPage === undefined ||
      currentPage === null
    ) {
      return Response.json(
        {
          error:
            'Ontbrekende velden. Vereist: magazineSlug, editionIndex, currentPage',
        },
        { status: 400 },
      )
    }

    if (
      typeof editionIndex !== 'number' ||
      typeof currentPage !== 'number' ||
      editionIndex < 0 ||
      currentPage < 1
    ) {
      return Response.json(
        { error: 'Ongeldige waarden voor editionIndex of currentPage' },
        { status: 400 },
      )
    }

    // Read existing progress from user
    const fullUser = (await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 0,
    })) as any

    const existingProgress: ReadingProgressEntry[] = fullUser.readingProgress
      ? typeof fullUser.readingProgress === 'string'
        ? JSON.parse(fullUser.readingProgress)
        : fullUser.readingProgress
      : []

    // Update or add entry
    const existingIdx = existingProgress.findIndex(
      (p) =>
        p.magazineSlug === magazineSlug && p.editionIndex === editionIndex,
    )

    const entry: ReadingProgressEntry = {
      magazineSlug,
      editionIndex,
      currentPage,
      lastReadAt: new Date().toISOString(),
    }

    if (existingIdx >= 0) {
      existingProgress[existingIdx] = entry
    } else {
      existingProgress.push(entry)
    }

    // Keep only the most recent 50 entries
    const sorted = existingProgress.sort(
      (a, b) =>
        new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime(),
    )
    const trimmed = sorted.slice(0, 50)

    // Save back to user
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        readingProgress: JSON.stringify(trimmed),
      } as any,
      depth: 0,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[Library Progress API] Error:', error)
    return Response.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
