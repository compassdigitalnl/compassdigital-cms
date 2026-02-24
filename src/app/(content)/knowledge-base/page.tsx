'use client'

/**
 * Sprint 7: Kennisbank Page
 *
 * Knowledge base page with filtering, search, and premium content support
 */

import React, { useState, useMemo, useEffect } from 'react'
import type { BlogPost, BlogCategory } from '@/payload-types'
import {
  KnowledgeBaseHero,
  KnowledgeBaseFilters,
  KnowledgeBaseGrid,
} from '@/branches/content/components/KnowledgeBase'
import { calculateReadingTime } from '@/branches/content/utils/calculateReadingTime'

export default function KennisbankPage() {
  // State
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeContentType, setActiveContentType] = useState<string | null>(null)
  const [activeAccessLevel, setActiveAccessLevel] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        // Fetch posts
        const postsResponse = await fetch(
          '/api/blog-posts?limit=100&where[status][equals]=published&depth=1',
        )
        const postsData = await postsResponse.json()

        // Fetch categories
        const categoriesResponse = await fetch('/api/blog-categories?limit=50')
        const categoriesData = await categoriesResponse.json()

        setPosts(postsData.docs || [])
        setCategories(categoriesData.docs || [])
      } catch (error) {
        console.error('Error fetching kennisbank data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalArticles = posts.length
    const premiumArticles = posts.filter(
      (p) => p.contentAccess?.accessLevel === 'premium',
    ).length

    const totalReadingTime = posts.reduce((sum, post) => {
      const readingTime = calculateReadingTime(post)
      return sum + readingTime.minutes
    }, 0)

    return {
      totalArticles,
      premiumArticles,
      totalReadingTime,
    }
  }, [posts])

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(query)
        const excerptMatch = post.excerpt?.toLowerCase().includes(query)
        const tagsMatch = post.tags?.some((tag) => tag.tag?.toLowerCase().includes(query))
        return titleMatch || excerptMatch || tagsMatch
      })
    }

    // Filter by content type
    if (activeContentType) {
      filtered = filtered.filter((post) => post.contentType === activeContentType)
    }

    // Filter by access level
    if (activeAccessLevel) {
      filtered = filtered.filter(
        (post) => post.contentAccess?.accessLevel === activeAccessLevel,
      )
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((post) => {
        if (!post.categories) return false
        return post.categories.some((cat) => {
          if (typeof cat === 'string') return false
          return (cat as BlogCategory).slug === activeCategory
        })
      })
    }

    // Sort by publishedAt (newest first)
    filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })

    return filtered
  }, [posts, searchQuery, activeContentType, activeAccessLevel, activeCategory])

  // Category filter options with counts
  const categoryOptions = useMemo(() => {
    return categories.map((category) => {
      const count = posts.filter((post) => {
        if (!post.categories) return false
        return post.categories.some((cat) => {
          if (typeof cat === 'string') return cat === category.id
          return cat.id === category.id
        })
      }).length

      return {
        slug: category.slug || '',
        title: category.name || category.title || '',
        count,
      }
    })
  }, [categories, posts])

  // Content type counts
  const contentTypeCounts = useMemo(() => {
    return {
      article: posts.filter((p) => p.contentType === 'article').length,
      guide: posts.filter((p) => p.contentType === 'guide').length,
      elearning: posts.filter((p) => p.contentType === 'elearning').length,
      download: posts.filter((p) => p.contentType === 'download').length,
      video: posts.filter((p) => p.contentType === 'video').length,
    }
  }, [posts])

  // Access level counts
  const accessLevelCounts = useMemo(() => {
    return {
      free: posts.filter((p) => p.contentAccess?.accessLevel === 'free').length,
      premium: posts.filter((p) => p.contentAccess?.accessLevel === 'premium').length,
    }
  }, [posts])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <KnowledgeBaseHero
        totalArticles={stats.totalArticles}
        premiumArticles={stats.premiumArticles}
        totalReadingTime={stats.totalReadingTime}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-10">
          <KnowledgeBaseFilters
            activeContentType={activeContentType}
            activeAccessLevel={activeAccessLevel}
            activeCategory={activeCategory}
            categories={categoryOptions}
            onContentTypeChange={setActiveContentType}
            onAccessLevelChange={setActiveAccessLevel}
            onCategoryChange={setActiveCategory}
            contentTypeCounts={contentTypeCounts}
            accessLevelCounts={accessLevelCounts}
          />
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {filteredPosts.length === posts.length
              ? `Alle ${posts.length} artikelen`
              : `${filteredPosts.length} van ${posts.length} artikelen`}
          </div>
        )}

        {/* Grid */}
        <KnowledgeBaseGrid
          articles={filteredPosts}
          isLoading={isLoading}
          emptyMessage={
            searchQuery
              ? `Geen resultaten gevonden voor "${searchQuery}"`
              : 'Geen artikelen gevonden'
          }
          showPremiumBadges
        />
      </div>
    </div>
  )
}
