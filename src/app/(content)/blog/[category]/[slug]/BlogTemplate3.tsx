'use client'

import type { BlogPost, BlogCategory } from '@/payload-types'
import { Calendar, User, Sparkles } from 'lucide-react'
import { PrevNextNavigation } from '@/components/blog/PrevNextNavigation'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'

interface BlogTemplate3Props {
  post: BlogPost
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
  category: BlogCategory
}

export default function BlogTemplate3({ post, prevPost, nextPost, category }: BlogTemplate3Props) {
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

      {/* Premium: Wide Mobile-First Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Categories - Premium Badge */}
        {categoryBadges && categoryBadges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6 lg:mb-8">
            {categoryBadges.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold uppercase tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #D97706 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title - Extra Large */}
        <h1
          className="text-3xl lg:text-6xl font-extrabold leading-tight mb-6 lg:mb-10 text-center"
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h1>

        {/* Meta - Premium */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 justify-center items-center mb-8 lg:mb-16">
          <div
            className="flex items-center gap-3 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl"
            style={{
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
            }}
          >
            <User className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-sm lg:text-base font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {authorName}
            </span>
          </div>
          <div
            className="flex items-center gap-3 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl"
            style={{
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-sm lg:text-base font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {publishDate}
            </span>
          </div>
        </div>

        {/* Featured Image - Full Width on mobile, extra wide on desktop */}
        {featuredImageUrl && (
          <div
            className="w-full lg:w-[calc(100%+5rem)] lg:-ml-10 aspect-video lg:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden mb-8 lg:mb-16"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt - Large Quote Style */}
        {post.excerpt && (
          <div
            className="max-w-4xl mx-auto mb-10 lg:mb-16 text-lg lg:text-2xl leading-relaxed lg:leading-loose font-medium italic text-center p-6 lg:p-10 rounded-2xl"
            style={{
              color: 'var(--color-text-primary)',
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0.08) 100%)',
              border: '2px solid rgba(59, 130, 246, 0.15)',
            }}
          >
            "{post.excerpt}"
          </div>
        )}

        {/* Content - Wide */}
        <div
          className="max-w-4xl mx-auto text-base lg:text-lg leading-relaxed lg:leading-loose blog-content-premium"
          style={{ color: 'var(--color-text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Previous/Next Navigation */}
        <div className="max-w-4xl mx-auto">
          <PrevNextNavigation
            prevPost={prevPost}
            nextPost={nextPost}
            category={category}
            className="mt-12"
          />
        </div>

        {/* Premium Footer */}
        <div
          className="max-w-4xl mx-auto mt-12 lg:mt-20 pt-8 lg:pt-10 text-center"
          style={{ borderTop: '2px solid var(--color-border)' }}
        >
          <div
            className="inline-flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl text-sm lg:text-base font-semibold"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
            Premium Content
          </div>
        </div>
      </div>
    </div>
  )
}
