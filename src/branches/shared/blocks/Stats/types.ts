import type { BlockAnimationProps } from '../_shared/types'

export interface StatsItem {
  icon?: string | null
  value: string
  label: string
  suffix?: string | null
  description?: string | null
  id?: string | null
}

export interface StatsBlockProps extends BlockAnimationProps {
  blockType: 'stats'
  title?: string | null
  description?: string | null
  stats?: StatsItem[] | null
  /** Legacy field name — some existing pages may use 'items' */
  items?: StatsItem[] | null
  columns?: '2' | '3' | '4' | null
  /** Legacy field — mapped to columns */
  variant?: 'inline' | 'cards' | 'large' | null
  backgroundColor?: 'white' | 'grey' | 'tealGradient' | 'navyGradient' | null
}
