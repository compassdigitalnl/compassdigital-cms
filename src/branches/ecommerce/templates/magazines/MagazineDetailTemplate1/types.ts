import type { MagazineStat } from '@/branches/ecommerce/components/magazines/MagazineHero/types'
import type { MagazineUSPCard } from '@/branches/ecommerce/components/magazines/MagazineUSPCards/types'
import type { MagazineIssue } from '@/branches/ecommerce/components/magazines/MagazineIssueGrid/types'
import type { SubscriptionPlan, TrustItem } from '@/branches/ecommerce/components/magazines/MagazinePricingPlans/types'

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
  plans?: SubscriptionPlan[]
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
