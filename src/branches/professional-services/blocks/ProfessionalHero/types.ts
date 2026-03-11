import type { ProfessionalHeroBlock, Media } from '@/payload-types'

export type ProfessionalHeroProps = ProfessionalHeroBlock

export type AvatarColor = 'teal' | 'blue' | 'purple' | 'amber'
export type FloatingBadgeColor = 'green' | 'amber' | 'blue' | 'teal'
export type FloatingBadgePosition = 'bottom-left' | 'top-right'

export interface AvatarItem {
  initials: string
  color?: AvatarColor | null
  id?: string | null
}

export interface FloatingBadgeItem {
  title: string
  subtitle?: string | null
  icon?: string | null
  color?: FloatingBadgeColor | null
  position?: FloatingBadgePosition | null
  id?: string | null
}

export { Media }
