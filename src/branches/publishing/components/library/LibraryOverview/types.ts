export interface LibraryMagazineItem {
  id: string
  name: string
  slug: string
  coverUrl?: string
  tagline?: string
  totalEditions: number
  digitalEditions: number
}

export interface RecentlyReadItem {
  magazineSlug: string
  magazineName: string
  editionIndex: number
  editionTitle: string
  coverUrl?: string
  currentPage: number
  totalPages: number
}

export interface LatestEditionItem {
  magazineSlug: string
  magazineName: string
  editionIndex: number
  title: string
  coverUrl?: string
  publishDate?: string
}

export interface LibraryOverviewProps {
  magazines: LibraryMagazineItem[]
  recentlyRead: RecentlyReadItem[]
  latestEditions: LatestEditionItem[]
}
