/**
 * Internal Edition Provider — Digital Library
 *
 * Implements EditionProvider using Payload CMS collections.
 * Reads magazine data from the Magazines collection and page images
 * from the DigitalEditionPages collection.
 *
 * Reading progress is stored server-side on the user document
 * via a JSON field (readingProgress). The frontend can also use
 * localStorage as a fast cache and sync to the server periodically.
 */

import type { Payload } from 'payload'
import type {
  EditionProvider,
  MagazineSummary,
  Edition,
  PageImage,
  RecentRead,
} from './EditionProvider'

interface ReadingProgressEntry {
  magazineSlug: string
  editionIndex: number
  currentPage: number
  lastReadAt: string
}

export class InternalEditionProvider implements EditionProvider {
  private payload: Payload | null = null

  /**
   * Get the Payload instance lazily.
   * We import it dynamically to avoid circular dependency issues at module load time.
   */
  private async getPayload(): Promise<Payload> {
    if (this.payload) return this.payload
    const { getPayload: getPayloadInstance } = await import('payload')
    const configPromise = await import('@/payload.config')
    this.payload = await getPayloadInstance({ config: configPromise.default })
    return this.payload
  }

  /**
   * Get all magazines that have at least one digital edition.
   */
  async getAvailableMagazines(userId: string): Promise<MagazineSummary[]> {
    const payload = await this.getPayload()

    const result = await payload.find({
      collection: 'magazines',
      where: {
        visible: { equals: true },
      },
      limit: 100,
      depth: 1, // resolve cover images
    })

    const summaries: MagazineSummary[] = []

    for (const magazine of result.docs) {
      const editions = (magazine.editions || []) as any[]
      const digitalEditions = editions.filter((e: any) => e.isDigital)

      // Only include magazines with at least one digital edition
      if (digitalEditions.length === 0) continue

      const cover = magazine.cover as any
      const coverUrl =
        typeof cover === 'object' && cover?.url ? cover.url : undefined

      summaries.push({
        id: String(magazine.id),
        name: magazine.name,
        slug: magazine.slug,
        coverUrl,
        tagline: magazine.tagline || undefined,
        totalEditions: editions.length,
        digitalEditions: digitalEditions.length,
      })
    }

    return summaries
  }

  /**
   * Get all digital editions for a specific magazine.
   */
  async getEditions(magazineSlug: string, userId: string): Promise<Edition[]> {
    const payload = await this.getPayload()

    const result = await payload.find({
      collection: 'magazines',
      where: {
        slug: { equals: magazineSlug },
      },
      limit: 1,
      depth: 1,
    })

    if (result.docs.length === 0) return []

    const magazine = result.docs[0]
    const editions = (magazine.editions || []) as any[]
    const now = new Date()

    const digitalEditions: Edition[] = []
    for (let index = 0; index < editions.length; index++) {
      const edition = editions[index]
      if (!edition.isDigital) continue

      const cover = edition.cover as any
      const coverUrl =
        typeof cover === 'object' && cover?.url ? cover.url : undefined

      // Check availability based on digitalAvailableFrom
      let isAvailable = true
      if (edition.digitalAvailableFrom) {
        isAvailable = new Date(edition.digitalAvailableFrom) <= now
      }

      digitalEditions.push({
        index,
        title: edition.title,
        issueNumber: edition.issueNumber || undefined,
        year: edition.year || undefined,
        coverUrl,
        pageCount: edition.pageCount || 0,
        publishDate: edition.publishDate || undefined,
        isAvailable,
      })
    }
    return digitalEditions
  }

  /**
   * Get the page count for a specific edition.
   * First checks the pageCount field on the edition, then falls back
   * to counting DigitalEditionPages records.
   */
  async getPageCount(
    magazineSlug: string,
    editionIndex: number,
  ): Promise<number> {
    const payload = await this.getPayload()

    // Try to get from the magazine's edition data first
    const magazineResult = await payload.find({
      collection: 'magazines',
      where: { slug: { equals: magazineSlug } },
      limit: 1,
      depth: 0,
    })

    if (magazineResult.docs.length > 0) {
      const editions = (magazineResult.docs[0].editions || []) as any[]
      if (editions[editionIndex]?.pageCount) {
        return editions[editionIndex].pageCount
      }
    }

    // Fallback: count DigitalEditionPages
    const magazine = magazineResult.docs[0]
    if (!magazine) return 0

    const pagesResult = await (payload as any).count({
      collection: 'digital-edition-pages',
      where: {
        and: [
          { magazine: { equals: magazine.id } },
          { editionIndex: { equals: editionIndex } },
        ],
      },
    })

    return pagesResult.totalDocs
  }

  /**
   * Get the URL for a specific page image.
   * Returns the URL to the page-image API endpoint which can handle
   * watermarking based on the user.
   */
  async getPageImageUrl(
    magazineSlug: string,
    editionIndex: number,
    pageNumber: number,
    userId: string,
  ): Promise<PageImage> {
    const payload = await this.getPayload()

    // Find the magazine
    const magazineResult = await payload.find({
      collection: 'magazines',
      where: { slug: { equals: magazineSlug } },
      limit: 1,
      depth: 0,
    })

    if (magazineResult.docs.length === 0) {
      throw new Error(`Magazine not found: ${magazineSlug}`)
    }

    const magazine = magazineResult.docs[0]

    // Find the page image
    // Note: 'digital-edition-pages' is not yet in payload-types.ts until types are regenerated
    const pageResult = await (payload as any).find({
      collection: 'digital-edition-pages',
      where: {
        and: [
          { magazine: { equals: magazine.id } },
          { editionIndex: { equals: editionIndex } },
          { pageNumber: { equals: pageNumber } },
        ],
      },
      limit: 1,
      depth: 1, // resolve pageImage
    })

    if (pageResult.docs.length === 0) {
      throw new Error(
        `Page ${pageNumber} not found for ${magazineSlug} edition ${editionIndex}`,
      )
    }

    const page = pageResult.docs[0] as any
    const pageImage = page.pageImage as any

    // Return the API endpoint URL (which handles watermarking server-side)
    // For now, return the direct image URL. Watermarking will be handled
    // by the page-image API route when it is built.
    const url =
      typeof pageImage === 'object' && pageImage?.url
        ? pageImage.url
        : `/api/digital-library/page-image/${magazineSlug}/${editionIndex}/${pageNumber}`

    return {
      url,
      width: page.width || 0,
      height: page.height || 0,
      watermarked: false, // watermarking handled at API layer
    }
  }

  /**
   * Save reading progress for a user.
   * Stores progress as JSON in the user's metadata.
   */
  async saveReadingProgress(
    userId: string,
    magazineSlug: string,
    editionIndex: number,
    page: number,
  ): Promise<void> {
    const payload = await this.getPayload()

    // Read existing progress from user
    const user = (await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
    })) as any

    const existingProgress: ReadingProgressEntry[] = user.readingProgress
      ? (typeof user.readingProgress === 'string'
          ? JSON.parse(user.readingProgress)
          : user.readingProgress)
      : []

    // Update or add entry
    const existingIndex = existingProgress.findIndex(
      (p) =>
        p.magazineSlug === magazineSlug && p.editionIndex === editionIndex,
    )

    const entry: ReadingProgressEntry = {
      magazineSlug,
      editionIndex,
      currentPage: page,
      lastReadAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      existingProgress[existingIndex] = entry
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
      id: userId,
      data: {
        readingProgress: JSON.stringify(trimmed),
      } as any,
      depth: 0,
    })
  }

  /**
   * Get the current reading position for a specific edition.
   */
  async getReadingProgress(
    userId: string,
    magazineSlug: string,
    editionIndex: number,
  ): Promise<number | null> {
    const payload = await this.getPayload()

    const user = (await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
    })) as any

    if (!user.readingProgress) return null

    const progress: ReadingProgressEntry[] =
      typeof user.readingProgress === 'string'
        ? JSON.parse(user.readingProgress)
        : user.readingProgress

    const entry = progress.find(
      (p) =>
        p.magazineSlug === magazineSlug && p.editionIndex === editionIndex,
    )

    return entry?.currentPage ?? null
  }

  /**
   * Get the last 10 recently read editions for a user.
   */
  async getRecentlyRead(userId: string): Promise<RecentRead[]> {
    const payload = await this.getPayload()

    const user = (await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
    })) as any

    if (!user.readingProgress) return []

    const progress: ReadingProgressEntry[] =
      typeof user.readingProgress === 'string'
        ? JSON.parse(user.readingProgress)
        : user.readingProgress

    // Sort by last read, take the 10 most recent
    const recent = progress
      .sort(
        (a, b) =>
          new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime(),
      )
      .slice(0, 10)

    // Enrich with magazine data
    const results: RecentRead[] = []

    // Batch-fetch unique magazine slugs
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

    for (const entry of recent) {
      const magazine = magazineMap.get(entry.magazineSlug)
      if (!magazine) continue

      const editions = (magazine.editions || []) as any[]
      const edition = editions[entry.editionIndex]
      if (!edition) continue

      const cover = edition.cover as any
      const coverUrl =
        typeof cover === 'object' && cover?.url ? cover.url : undefined

      results.push({
        magazineId: String(magazine.id),
        magazineName: magazine.name,
        magazineSlug: magazine.slug,
        editionIndex: entry.editionIndex,
        editionTitle: edition.title,
        coverUrl,
        currentPage: entry.currentPage,
        totalPages: edition.pageCount || 0,
        lastReadAt: entry.lastReadAt,
      })
    }

    return results
  }
}
