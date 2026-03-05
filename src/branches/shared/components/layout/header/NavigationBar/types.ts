import type { Theme1, Setting } from '@/payload-types'

export type NavigationData = {
  mode: 'manual' | 'categories' | 'hybrid'
  items?: any[]
  specialItems?: any[]
  ctaButton?: {
    show?: boolean | null
    text?: string | null
    link?: string | null
  }
  categoryNavigation?: any
}

export type NavigationBarProps = {
  navigation: NavigationData
  theme: Theme1 | null
  settings?: Setting | null
}
