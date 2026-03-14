import type { BlogPost } from '@/payload-types'

export interface ArticleGridProps {
  /**
   * Array of blog posts to display
   */
  articles: BlogPost[]

  /**
   * Number of columns in the grid
   * @default 3
   */
  columns?: 2 | 3 | 4

  /**
   * Show premium badge on premium articles
   * @default true
   */
  showPremiumBadge?: boolean

  /**
   * Message to display when there are no articles
   * @default 'Geen artikelen gevonden'
   */
  emptyMessage?: string

  /**
   * Additional CSS classes
   */
  className?: string
}
