import type { Media } from '@/payload-types'

export interface BrandCardProps {
  id: number
  name: string
  slug: string
  logo?: Media | number | null
  productCount?: number
  variant?: 'standard' | 'featured'
  className?: string
}
