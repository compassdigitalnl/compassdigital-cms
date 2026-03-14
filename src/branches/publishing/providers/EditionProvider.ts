/**
 * Edition Provider Interface — Digital Library
 *
 * Abstraction layer for digital magazine edition data.
 * Currently implemented by InternalEditionProvider (Payload CMS).
 * Future: ThorEditionProvider for external magazine distribution (THOR API).
 */

export interface DigitalSubscription {
  magazineId: string
  magazineName: string
  magazineSlug: string
  coverUrl?: string
  planName: string
  status: 'active' | 'expired' | 'cancelled'
}

export interface MagazineSummary {
  id: string
  name: string
  slug: string
  coverUrl?: string
  tagline?: string
  totalEditions: number
  digitalEditions: number
}

export interface Edition {
  index: number
  title: string
  issueNumber?: string
  year?: number
  coverUrl?: string
  pageCount: number
  publishDate?: string
  isAvailable: boolean // based on digitalAvailableFrom
}

export interface PageImage {
  url: string
  width: number
  height: number
  watermarked: boolean
}

export interface TOCEntry {
  pageNumber: number
  title: string
}

export interface RecentRead {
  magazineId: string
  magazineName: string
  magazineSlug: string
  editionIndex: number
  editionTitle: string
  coverUrl?: string
  currentPage: number
  totalPages: number
  lastReadAt: string
}

export interface EditionProvider {
  // Library
  getAvailableMagazines(userId: string): Promise<MagazineSummary[]>
  getEditions(magazineSlug: string, userId: string): Promise<Edition[]>

  // Viewer
  getPageCount(magazineSlug: string, editionIndex: number): Promise<number>
  getPageImageUrl(
    magazineSlug: string,
    editionIndex: number,
    pageNumber: number,
    userId: string,
  ): Promise<PageImage>

  // Progress
  saveReadingProgress(
    userId: string,
    magazineSlug: string,
    editionIndex: number,
    page: number,
  ): Promise<void>
  getReadingProgress(
    userId: string,
    magazineSlug: string,
    editionIndex: number,
  ): Promise<number | null>
  getRecentlyRead(userId: string): Promise<RecentRead[]>
}
