'use client'

/**
 * Sprint 7: Knowledge Base Hero Component
 *
 * Hero section for the kennisbank page with search and stats
 */

import React from 'react'
import { Search, BookOpen, GraduationCap, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface KnowledgeBaseHeroProps {
  /**
   * Total number of articles
   */
  totalArticles: number

  /**
   * Number of premium articles
   */
  premiumArticles: number

  /**
   * Search query value
   */
  searchQuery?: string

  /**
   * Search change handler
   */
  onSearchChange?: (query: string) => void

  /**
   * Total reading time (in minutes)
   */
  totalReadingTime?: number
}

/**
 * Knowledge Base Hero Component
 *
 * Displays hero section with search bar and statistics
 */
export function KnowledgeBaseHero({
  totalArticles,
  premiumArticles,
  searchQuery = '',
  onSearchChange,
  totalReadingTime,
}: KnowledgeBaseHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 py-16 sm:py-20">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Kennisbank
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Ontdek onze collectie expertgidsen, tutorials en resources. Van basiskennis tot
            geavanceerde technieken.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Zoek in kennisbank..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 focus:border-primary shadow-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Total Articles */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {totalArticles}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Artikelen</div>
          </div>

          {/* Premium Articles */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {premiumArticles}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pro Content</div>
          </div>

          {/* Total Reading Time */}
          {totalReadingTime && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {Math.round(totalReadingTime / 60)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Leestijd</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
