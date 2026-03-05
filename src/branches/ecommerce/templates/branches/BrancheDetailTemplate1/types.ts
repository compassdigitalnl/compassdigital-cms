import type { LucideIcon } from 'lucide-react'
import type { BranchStat } from '@/branches/ecommerce/components/branches/BranchHero/types'
import type { USPCard } from '@/branches/ecommerce/components/branches/BranchUSPCards/types'
import type { BranchCategory } from '@/branches/ecommerce/components/branches/BranchCategoryGrid/types'
import type { BranchPackage } from '@/branches/ecommerce/components/branches/BranchPackageGrid/types'

export interface PopularProduct {
  id: string
  name: string
  slug: string
  sku: string
  brand: { name: string; slug: string }
  image?: { url: string; alt: string }
  price: number | null
  priceLabel?: string
  compareAtPrice?: number
  stock: number
  stockStatus: 'in-stock' | 'low' | 'out' | 'on-backorder'
  badges?: Array<{ type: 'sale' | 'new' | 'pro' | 'popular'; label?: string }>
}

export interface BrancheDetailTemplate1Props {
  name: string
  slug: string
  badge?: string
  title: string
  description?: string
  icon?: LucideIcon
  stats?: BranchStat[]
  uspCards?: USPCard[]
  categories?: BranchCategory[]
  packages?: BranchPackage[]
  testimonial?: {
    initials: string
    quote: string
    authorName: string
    authorRole: string
    rating?: number
  }
  popularProducts?: PopularProduct[]
  ctaTitle?: string
  ctaDescription?: string
}
