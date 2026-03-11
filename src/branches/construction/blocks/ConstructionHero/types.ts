import type { ConstructionHeroBlock, Media } from '@/payload-types'

/**
 * ConstructionHero Block Props
 *
 * Uses the Payload-generated ConstructionHeroBlock interface directly.
 * Re-exported here for convenience and to add any component-specific types.
 */
export type ConstructionHeroProps = ConstructionHeroBlock

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
