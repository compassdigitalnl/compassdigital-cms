'use client'

/**
 * Sprint 7: Article Card Component
 *
 * Card component for displaying blog posts in kennisbank and archive pages
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, FileText, Video, Download, GraduationCap, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BlogPost, Media } from '@/payload-types'
import { PremiumBadge } from '@/branches/content/components/PremiumBadge'
import { calculateReadingTime } from '@/branches/content/utils/calculateReadingTime'

export interface ArticleCardProps {
  /**
   * Blog post data
   */
  post: BlogPost

  /**
   * Card variant
   * - default: Standard card with image
   * - compact: Smaller card without image
   * - featured: Larger card with prominent image
   */
  variant?: 'default' | 'compact' | 'featured'

  /**
   * Show premium badge
   */
  showPremiumBadge?: boolean

  /**
   * Show reading time
   */
  showReadingTime?: boolean

  /**
   * Show excerpt
   */
  showExcerpt?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Get content type icon and label
 */
function getContentTypeInfo(contentType: string): { icon: LucideIcon; label: string } {
  const contentTypeMap: Record<string, { icon: LucideIcon; label: string }> = {
    article: { icon: FileText, label: 'Artikel' },
    guide: { icon: BookOpen, label: 'Productgids' },
    elearning: { icon: GraduationCap, label: 'E-learning' },
    download: { icon: Download, label: 'Download' },
    video: { icon: Video, label: 'Video' },
  }

  return contentTypeMap[contentType] || contentTypeMap.article
}

/**
 * Article Card Component
 *
 * Displays a blog post in a card format with image, title, excerpt, and metadata
 *
 * @example
 * ```tsx
 * <ArticleCard
 *   post={blogPost}
 *   variant="default"
 *   showPremiumBadge
 *   showReadingTime
 * />
 * ```
 */
export function ArticleCard({
  post,
  variant = 'default',
  showPremiumBadge = true,
  showReadingTime = true,
  showExcerpt = true,
  className = '',
}: ArticleCardProps) {
  // Get category (first one)
  const category =
    post.categories && Array.isArray(post.categories) && post.categories.length > 0
      ? typeof post.categories[0] === 'string'
        ? null
        : post.categories[0]
      : null

  // Get image URL
  const featuredImage = post.featuredImage
    ? typeof post.featuredImage === 'string'
      ? null
      : (post.featuredImage as Media)
    : null
  const imageUrl = featuredImage?.url || null

  // Get emoji fallback
  const emoji = post.featuredImageEmoji || '📄'

  // Reading time
  const readingTime = showReadingTime ? calculateReadingTime(post) : null

  // Premium status
  const isPremium = post.contentAccess?.accessLevel === 'premium'

  // Content type
  const contentType = getContentTypeInfo(post.contentType || 'article')

  // Build URL
  const slug = post.slug || ''
  const categorySlug = category?.slug || 'algemeen'
  const url = `/blog/${categorySlug}/${slug}`

  if (variant === 'compact') {
    return (
      <Link
        href={url}
        className={`
          group block
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-lg p-4
          hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700
          transition-all duration-200
          ${className}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Emoji Icon */}
          <div className="text-3xl flex-shrink-0">{emoji}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              {/* Content Type */}
              <span className="flex items-center gap-1">
                <contentType.icon className="w-3.5 h-3.5" />
                {contentType.label}
              </span>

              {/* Reading Time */}
              {readingTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime.text}
                  </span>
                </>
              )}

              {/* Premium Badge */}
              {showPremiumBadge && isPremium && (
                <>
                  <span>•</span>
                  <PremiumBadge variant="subtle" size="sm" icon="lock" text="Pro" pill />
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={url}
        className={`
          group block
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-2xl overflow-hidden
          hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700
          transition-all duration-300
          ${className}
        `}
      >
        {/* Image */}
        <div className="relative aspect-[21/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">{emoji}</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {showPremiumBadge && isPremium && (
              <PremiumBadge variant="solid" size="md" icon="crown" text="Pro" pill />
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-medium text-gray-900 dark:text-white">
              <contentType.icon className="w-4 h-4" />
              {contentType.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Category */}
          {category && (
            <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
              {category.title}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-4">
            {post.title}
          </h2>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          {readingTime && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <Clock className="w-4 h-4" />
              {readingTime.text}
            </div>
          )}
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={url}
      className={`
        group block
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        rounded-xl overflow-hidden
        hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700
        transition-all duration-200
        ${className}
      `}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{emoji}</span>
          </div>
        )}

        {/* Premium Badge Overlay */}
        {showPremiumBadge && isPremium && (
          <div className="absolute top-3 right-3">
            <PremiumBadge variant="solid" size="sm" icon="lock" text="Pro" pill />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Content Type */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {category.title}
            </span>
          )}
          {category && <span className="text-gray-400">•</span>}
          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <contentType.icon className="w-3.5 h-3.5" />
            {contentType.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        {readingTime && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {readingTime.text}
          </div>
        )}
      </div>
    </Link>
  )
}
