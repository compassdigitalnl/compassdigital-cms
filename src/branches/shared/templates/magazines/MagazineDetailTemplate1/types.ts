import type { MagazineStat } from '@/branches/shared/components/magazines/MagazineHero/types'
import type { MagazineUSPCard } from '@/branches/shared/components/magazines/MagazineUSPCards/types'
import type { MagazineIssue } from '@/branches/shared/components/magazines/MagazineIssueGrid/types'
import type { LucideIcon } from 'lucide-react'

export interface ServiceLink {
  icon: LucideIcon | string
  label: string
  href: string
}

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
  subscriptionCTA?: {
    title: string
    description?: string
    price?: string
    priceSuffix?: string
    buttonLabel?: string
    buttonHref?: string
  }
  serviceLinks?: ServiceLink[]
}
