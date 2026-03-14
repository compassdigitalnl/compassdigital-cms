export interface LibraryEditionCardProps {
  magazineSlug: string
  editionIndex: number
  title: string
  issueNumber?: string | number
  year?: string | number
  coverUrl?: string
  pageCount?: number
  publishDate?: string
  isAvailable?: boolean
  progress?: number // 0-100
  className?: string
}
