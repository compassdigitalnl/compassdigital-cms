import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Media } from '@/payload-types'

/**
 * B12 - Blog Preview Block Component
 *
 * Displays a grid of blog post cards with thumbnails, categories, and metadata.
 *
 * FEATURES:
 * - Responsive grid: 3 cols → 2 cols @900px → 1 col @640px
 * - Card hover effects (lift + shadow)
 * - Category badge overlay with backdrop blur
 * - Optional excerpt display
 * - Optional read time calculation
 * - Date formatting (Dutch locale)
 *
 * @see src/branches/shared/blocks/BlogPreview/config.ts
 * @see docs/refactoring/sprint-6/b12-blog-preview.html
 */

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  thumbnail?: string | Media | null
  category?: {
    title: string
  } | string | null
  publishedAt?: string
  content?: any // Lexical content for read time calculation
}

interface BlogPreviewBlockProps {
  title?: string
  description?: string
  columns?: '2' | '3'
  posts?: (string | BlogPost)[]
  showExcerpt?: boolean
  showReadTime?: boolean
  showCategory?: boolean
}

// Helper: Calculate estimated read time from Lexical content
function calculateReadTime(content: any): number {
  if (!content) return 0

  // Extract text from Lexical JSON structure
  const extractText = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (node.text) return node.text
    if (node.children) {
      return node.children.map((child: any) => extractText(child)).join(' ')
    }
    return ''
  }

  const text = extractText(content)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const wordsPerMinute = 200
  return Math.ceil(wordCount / wordsPerMinute)
}

// Type guard: Check if posts are populated (not just IDs)
function isPopulatedPost(post: any): post is BlogPost {
  return post && typeof post === 'object' && 'title' in post
}

export const BlogPreviewBlockComponent: React.FC<BlogPreviewBlockProps> = ({
  title,
  description,
  columns = '3',
  posts = [],
  showExcerpt = true,
  showReadTime = false,
  showCategory = true,
}) => {
  // Filter out unpopulated posts
  const populatedPosts = posts.filter(isPopulatedPost)

  if (populatedPosts.length === 0) {
    return null
  }

  // Map columns to Tailwind grid classes
  const gridClass = columns === '2' ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Section Header (optional) */}
        {(title || description) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base text-grey-dark max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className={`grid gap-6 ${gridClass}`}>
          {populatedPosts.map((post) => {
            // Extract thumbnail URL
            const thumbnailUrl =
              typeof post.thumbnail === 'object' && post.thumbnail?.url
                ? post.thumbnail.url
                : null

            const thumbnailAlt =
              typeof post.thumbnail === 'object' && post.thumbnail?.alt
                ? post.thumbnail.alt
                : post.title

            // Extract category title
            const categoryTitle =
              typeof post.category === 'object' && post.category?.title
                ? post.category.title
                : null

            // Calculate read time
            const readTime = showReadTime && post.content ? calculateReadTime(post.content) : 0

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white border border-grey rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-teal to-teal-light overflow-hidden">
                  {thumbnailUrl && (
                    <Image
                      src={thumbnailUrl}
                      alt={thumbnailAlt}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />
                  )}

                  {/* Category Badge */}
                  {showCategory && categoryTitle && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide rounded-md">
                      {categoryTitle}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-display text-lg text-navy mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {showExcerpt && post.excerpt && (
                    <p className="text-sm text-grey-dark leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-grey">
                    <div className="flex items-center gap-2 text-xs text-grey-mid">
                      <Calendar size={14} />
                      {post.publishedAt && (
                        <span>
                          {format(new Date(post.publishedAt), 'd MMM yyyy', {
                            locale: nl,
                          })}
                        </span>
                      )}
                      {readTime > 0 && (
                        <>
                          <span className="text-grey-mid">•</span>
                          <Clock size={14} />
                          <span>{readTime} min</span>
                        </>
                      )}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center gap-1 text-xs font-bold text-teal group-hover:gap-2 transition-all">
                      <span>Lees meer</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
