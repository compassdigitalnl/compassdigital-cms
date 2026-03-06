import type { Media } from '@/payload-types'

export interface MagazineCardProps {
  id: number
  name: string
  slug: string
  tagline?: string | null
  logo?: Media | number | null
  image?: Media | number | null
  issueCount?: number
  className?: string
}
