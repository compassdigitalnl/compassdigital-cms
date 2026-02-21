'use client'

import type { BlogPost, BlogCategory } from '@/payload-types'
import { Calendar, User, Clock } from 'lucide-react'
import { PrevNextNavigation } from '@/branches/shared/components/blog/PrevNextNavigation'
import { ReadingProgressBar } from '@/branches/shared/components/blog/ReadingProgressBar'

interface BlogTemplate2Props {
  post: BlogPost
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
  category: BlogCategory
}

export default function BlogTemplate2({ post, prevPost, nextPost, category }: BlogTemplate2Props) {
  const featuredImageUrl =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage.url
      : null

  const authorName =
    typeof post.author === 'object' && post.author !== null
      ? post.author.name || 'Anonymous'
      : 'Anonymous'

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No date'

  const categoryBadges =
    post.categories &&
    Array.isArray(post.categories) &&
    post.categories
      .map((cat) => (typeof cat === 'object' && cat !== null ? cat : null))
      .filter((c) => c !== null)

  return (
    <div className="px-4 lg:px-0" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Minimal: Single Column, Centered */}
      <article className="max-w-2xl mx-auto">
        {/* Categories */}
        {categoryBadges && categoryBadges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4 lg:mb-6">
            {categoryBadges.map((cat, idx) => (
              <span
                key={idx}
                className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
                style={{
                  background: 'var(--color-surface, #F3F4F6)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-3xl lg:text-5xl font-bold leading-tight mb-6 lg:mb-8 text-center"
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {post.title}
        </h1>

        {/* Meta - Centered */}
        <div
          className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-8 lg:mb-10 pb-4 lg:pb-6"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <User className="w-4 h-4" />
            <span className="text-sm">{authorName}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{publishDate}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <Clock className="w-4 h-4" />
            <span className="text-sm">5 min</span>
          </div>
        </div>

        {/* Featured Image */}
        {featuredImageUrl && (
          <div className="w-full aspect-video rounded-xl lg:rounded-2xl overflow-hidden mb-8 lg:mb-10">
            <img
              src={featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div
            className="text-base lg:text-xl leading-relaxed mb-8 lg:mb-10 text-center italic"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div
          className="text-base lg:text-lg leading-relaxed lg:leading-loose blog-content-minimal"
          style={{ color: 'var(--color-text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Previous/Next Navigation */}
        <PrevNextNavigation
          prevPost={prevPost}
          nextPost={nextPost}
          category={category}
          className="mt-12"
        />
      </article>
    </div>
  )
}
