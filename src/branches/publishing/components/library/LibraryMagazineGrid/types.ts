export interface LibraryMagazineGridEdition {
  editionIndex: number
  title: string
  issueNumber?: string | number
  year?: string | number
  coverUrl?: string
  pageCount?: number
  publishDate?: string
  isAvailable?: boolean
  progress?: number
}

export interface LibraryMagazineGridProps {
  magazine: {
    name: string
    slug: string
    tagline?: string
    coverUrl?: string
  }
  editions: LibraryMagazineGridEdition[]
  className?: string
}
