/**
 * Publishing Components Index
 *
 * Barrel export for all publishing branch components.
 */

// === Existing components ===
export { ArticleCard } from './ArticleCard'
export type { ArticleCardProps } from './ArticleCard'

export { PremiumBadge, PremiumIcon } from './PremiumBadge'
export type { PremiumBadgeProps } from './PremiumBadge'

export { BlogPostWithPaywall } from './BlogPostWithPaywall'

export { PaywallOverlay } from './PaywallOverlay'

// Knowledge Base
export * from './KnowledgeBase'

// Magazines
export * from './magazines'

// === New components (Phase 2) ===
export { ArticleGrid } from './ArticleGrid'
export type { ArticleGridProps } from './ArticleGrid'

export { CategoryNav } from './CategoryNav'
export type { CategoryNavProps, CategoryNavCategory } from './CategoryNav'

export { AuthorCard } from './AuthorCard'
export type { AuthorCardProps, AuthorCardAuthor } from './AuthorCard'

export { ReadingProgress } from './ReadingProgress'
export type { ReadingProgressProps } from './ReadingProgress'

// Digital Library
export * from './library'
