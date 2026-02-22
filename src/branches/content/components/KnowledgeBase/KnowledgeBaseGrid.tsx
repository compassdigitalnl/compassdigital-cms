'use client'

/**
 * Sprint 7: Knowledge Base Grid Component
 *
 * Grid layout for displaying filtered articles
 */

import React from 'react'
import type { BlogPost } from '@/payload-types'
import { ArticleCard } from '@/branches/content/components/ArticleCard'
import { BookOpen } from 'lucide-react'

export interface KnowledgeBaseGridProps {
  /**
   * Articles to display
   */
  articles: BlogPost[]

  /**
   * Loading state
   */
  isLoading?: boolean

  /**
   * Empty state message
   */
  emptyMessage?: string

  /**
   * Show premium badges
   */
  showPremiumBadges?: boolean
}

/**
 * Knowledge Base Grid Component
 *
 * Displays articles in a responsive grid layout
 */
export function KnowledgeBaseGrid({
  articles,
  isLoading = false,
  emptyMessage = 'Geen artikelen gevonden',
  showPremiumBadges = true,
}: KnowledgeBaseGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/9] bg-gray-300 dark:bg-gray-700" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Probeer een ander filter of zoekterm
        </p>
      </div>
    )
  }

  // Grid of articles
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          post={article}
          variant="default"
          showPremiumBadge={showPremiumBadges}
          showReadingTime
          showExcerpt
        />
      ))}
    </div>
  )
}
