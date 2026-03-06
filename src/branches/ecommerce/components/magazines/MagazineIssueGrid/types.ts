export interface MagazineIssue {
  id: number
  title: string
  slug: string
  coverUrl?: string | null
  price?: number | null
  status?: 'available' | 'sold-out' | 'preorder'
  publishedDate?: string | null
}

export interface MagazineIssueGridProps {
  title?: string
  issues: MagazineIssue[]
  magazineSlug: string
  className?: string
}
