import type { Media } from '@/payload-types'

export interface MagazineWithMeta {
  id: number
  name: string
  slug: string
  tagline?: string | null
  logo?: Media | number | null
  image?: Media | number | null
  issueCount?: number
}

export interface MagazineArchiveTemplate1Props {
  magazines: MagazineWithMeta[]
  featuredMagazines?: MagazineWithMeta[]
  totalIssueCount?: number
}
