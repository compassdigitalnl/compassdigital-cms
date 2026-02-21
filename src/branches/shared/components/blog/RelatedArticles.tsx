'use client'
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/Icon'
import type { BlogPost } from '@/payload-types'

interface RelatedArticlesProps {
  posts: BlogPost[]
  className?: string
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ posts, className = '' }) => {
  if (!posts || posts.length === 0) {
    return null
  }

  // Get category color gradient
  const getCategoryGradient = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-50 to-blue-100'
      case 'green':
        return 'from-green-50 to-green-100'
      case 'coral':
        return 'from-red-50 to-red-100'
      case 'amber':
        return 'from-amber-50 to-amber-100'
      case 'purple':
        return 'from-purple-50 to-purple-100'
      default:
        return 'from-teal-50 to-teal-100'
    }
  }

  return (
    <section className={`mt-12 pt-10 border-t border-gray-200 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Icon name="BookOpen" size={22} className="text-teal-600" />
        <h2 className="text-2xl font-extrabold text-gray-900">Gerelateerde artikelen</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((post) => {
          const category = post.categories?.[0]
          const categorySlug =
            typeof category === 'object' && category !== null ? category.slug : 'algemeen'
          const categoryName =
            typeof category === 'object' && category !== null ? category.name : 'Algemeen'
          const categoryColor =
            typeof category === 'object' && category !== null ? category.color : 'teal'

          return (
            <Link
              key={post.id}
              href={`/blog/${categorySlug}/${post.slug}`}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
            >
              {/* Image */}
              <div
                className={`h-40 flex items-center justify-center text-5xl bg-gradient-to-br ${getCategoryGradient(categoryColor)}`}
              >
                {post.featuredImageEmoji || '📄'}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
                  {categoryName}
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-auto">{post.excerpt}</p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 pt-4 mt-3 border-t border-gray-100 text-xs text-gray-500">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {post.readingTime} min
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
