'use client'

/**
 * Sprint 7: Knowledge Base Filters Component
 *
 * Filter controls for the kennisbank page
 */

import React from 'react'
import { FileText, Video, Download, GraduationCap, BookOpen, Lock, Unlock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'

export interface KnowledgeBaseFiltersProps {
  /**
   * Active content type filter
   */
  activeContentType: string | null

  /**
   * Active access level filter
   */
  activeAccessLevel: string | null

  /**
   * Active category filter
   */
  activeCategory: string | null

  /**
   * Available categories
   */
  categories: Array<{ slug: string; title: string; count: number }>

  /**
   * Filter change handlers
   */
  onContentTypeChange: (type: string | null) => void
  onAccessLevelChange: (level: string | null) => void
  onCategoryChange: (category: string | null) => void

  /**
   * Content type counts
   */
  contentTypeCounts?: {
    article: number
    guide: number
    elearning: number
    download: number
    video: number
  }

  /**
   * Access level counts
   */
  accessLevelCounts?: {
    free: number
    premium: number
  }
}

interface ContentTypeOption {
  value: string
  label: string
  icon: LucideIcon
}

const contentTypes: ContentTypeOption[] = [
  { value: 'article', label: 'Artikelen', icon: FileText },
  { value: 'guide', label: 'Productgidsen', icon: BookOpen },
  { value: 'elearning', label: 'E-learning', icon: GraduationCap },
  { value: 'download', label: 'Downloads', icon: Download },
  { value: 'video', label: "Video's", icon: Video },
]

/**
 * Knowledge Base Filters Component
 *
 * Displays filter buttons for content type, access level, and categories
 */
export function KnowledgeBaseFilters({
  activeContentType,
  activeAccessLevel,
  activeCategory,
  categories,
  onContentTypeChange,
  onAccessLevelChange,
  onCategoryChange,
  contentTypeCounts,
  accessLevelCounts,
}: KnowledgeBaseFiltersProps) {
  return (
    <div className="space-y-8">
      {/* Content Type Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Type Content
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeContentType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onContentTypeChange(null)}
            className="rounded-full"
          >
            Alle types
          </Button>
          {contentTypes.map((type) => {
            const Icon = type.icon
            const count = contentTypeCounts?.[type.value as keyof typeof contentTypeCounts] || 0

            return (
              <Button
                key={type.value}
                variant={activeContentType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onContentTypeChange(type.value)}
                className="rounded-full gap-2"
              >
                <Icon className="w-3.5 h-3.5" />
                {type.label}
                {count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Access Level Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Toegang
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeAccessLevel === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAccessLevelChange(null)}
            className="rounded-full"
          >
            Alle content
          </Button>
          <Button
            variant={activeAccessLevel === 'free' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAccessLevelChange('free')}
            className="rounded-full gap-2"
          >
            <Unlock className="w-3.5 h-3.5" />
            Gratis
            {accessLevelCounts?.free && (
              <span className="ml-1 text-xs opacity-70">({accessLevelCounts.free})</span>
            )}
          </Button>
          <Button
            variant={activeAccessLevel === 'premium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAccessLevelChange('premium')}
            className="rounded-full gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            Pro
            {accessLevelCounts?.premium && (
              <span className="ml-1 text-xs opacity-70">({accessLevelCounts.premium})</span>
            )}
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Categorieën
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="rounded-full"
            >
              Alle categorieën
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={activeCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category.slug)}
                className="rounded-full"
              >
                {category.title}
                {category.count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({category.count})</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
