import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { ArticleGridProps } from './types'
import type { Media } from '@/payload-types'
import { PremiumBadge } from '@/branches/publishing/components/PremiumBadge'
import { calculateReadingTime } from '@/branches/publishing/utils/calculateReadingTime'

/**
 * ArticleGrid — Responsive grid of blog article cards
 *
 * Server component that renders a grid of articles with featured images,
 * category badges, titles, excerpts, reading time, premium badges, and author names.
 *
 * @example
 * ```tsx
 * <ArticleGrid
 *   articles={blogPosts}
 *   columns={3}
 *   showPremiumBadge
 *   emptyMessage="Geen artikelen gevonden"
 * />
 * ```
 */
export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  columns = 3,
  showPremiumBadge = true,
  emptyMessage = 'Geen artikelen gevonden',
  className = '',
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <p className="text-base text-[var(--color-base-500)]">{emptyMessage}</p>
      </div>
    )
  }

  const columnClasses: Record<2 | 3 | 4, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 md:gap-8 ${className}`}>
      {articles.map((article) => (
        <ArticleGridCard
          key={article.id}
          article={article}
          showPremiumBadge={showPremiumBadge}
        />
      ))}
    </div>
  )
}

/**
 * Individual article card within the grid
 */
function ArticleGridCard({
  article,
  showPremiumBadge,
}: {
  article: ArticleGridProps['articles'][number]
  showPremiumBadge: boolean
}) {
  // Resolve category
  const category =
    article.categories && Array.isArray(article.categories) && article.categories.length > 0
      ? typeof article.categories[0] === 'string'
        ? null
        : article.categories[0]
      : null

  const categoryTitle =
    category && typeof category === 'object' && 'title' in category
      ? (category.title as string)
      : null

  const categorySlug =
    category && typeof category === 'object' && 'slug' in category
      ? (category.slug as string)
      : 'algemeen'

  // Resolve image
  const featuredImage =
    article.featuredImage && typeof article.featuredImage !== 'string'
      ? (article.featuredImage as Media)
      : null
  const imageUrl = featuredImage?.url || null

  // Emoji fallback
  const emoji = article.featuredImageEmoji || ''

  // Reading time
  const readingTime = calculateReadingTime(article)

  // Premium status
  const isPremium = article.contentAccess?.accessLevel === 'premium'

  // Author
  const author =
    article.author && typeof article.author !== 'string' && typeof article.author === 'object'
      ? article.author
      : null
  const authorName =
    author && 'name' in author ? (author.name as string) : null

  // Build URL
  const slug = article.slug || ''
  const url = `/blog/${categorySlug}/${slug}`

  return (
    <Link
      href={url}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-base-400)] no-underline"
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-base-100)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title || ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl">{emoji}</span>
          </div>
        )}

        {/* Category Badge */}
        {categoryTitle && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[var(--color-primary)]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {categoryTitle}
          </span>
        )}

        {/* Premium Badge */}
        {showPremiumBadge && isPremium && (
          <div className="absolute right-3 top-3">
            <PremiumBadge variant="solid" size="sm" icon="lock" text="Pro" pill />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Title */}
        <h3 className="mb-2 text-lg font-bold leading-tight text-[var(--color-base-1000)] transition-colors group-hover:text-[var(--color-primary)] md:text-xl line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-base-600)] line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-3 border-t border-[var(--color-base-200)] pt-4 text-xs text-[var(--color-base-500)]">
          {/* Reading time */}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime.text}
          </span>

          {/* Author */}
          {authorName && (
            <>
              <span aria-hidden="true">|</span>
              <span className="truncate">{authorName}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ArticleGrid
