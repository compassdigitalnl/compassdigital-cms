import type { Media } from '@/payload-types'

export interface BrandHeroProps {
  name: string
  tagline?: string | null
  description?: string | null
  logo?: Media | number | null
  productCount: number
  categoryCount?: number
  inStockPercent?: number
  className?: string
}
