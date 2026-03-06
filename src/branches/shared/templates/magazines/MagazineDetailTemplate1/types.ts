import type { MagazineStat } from '@/branches/ecommerce/components/magazines/MagazineHero/types'
import type { MagazineUSPCard } from '@/branches/ecommerce/components/magazines/MagazineUSPCards/types'
import type { MagazineIssue } from '@/branches/ecommerce/components/magazines/MagazineIssueGrid/types'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { TrustItem } from '@/branches/shared/components/ui/checkout/TrustList/types'

export interface MagazineDetailTemplate1Props {
  name: string
  slug: string
  badge?: string
  title: string
  description?: string
  richDescription?: Record<string, unknown> | null
  logoUrl?: string | null
  stats?: MagazineStat[]
  uspCards?: MagazineUSPCard[]
  recentIssues?: MagazineIssue[]
  testimonial?: {
    initials: string
    quote: string
    authorName: string
    authorRole: string
    rating?: number
  }
  plans?: PricingPlan[]
  trustItems?: TrustItem[]
  subscriptionCTA?: {
    title: string
    description?: string
    price?: string
    priceSuffix?: string
    buttonLabel?: string
    buttonHref?: string
  }
}
