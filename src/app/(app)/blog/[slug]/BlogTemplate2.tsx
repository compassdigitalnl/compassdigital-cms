'use client'

import type { BlogPost } from '@/payload-types'
import { Calendar, User, Clock } from 'lucide-react'

interface BlogTemplate2Props {
  post: BlogPost
}

export default function BlogTemplate2({ post }: BlogTemplate2Props) {
  const featuredImageUrl =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage.url
      : null

  const authorName =
    typeof post.author === 'object' && post.author !== null ? post.author.name || 'Anonymous' : 'Anonymous'

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
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Minimal: Single Column, Centered */}
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Categories */}
        {categoryBadges && categoryBadges.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
            {categoryBadges.map((cat, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'var(--color-surface, #F3F4F6)',
                  color: 'var(--color-text-muted)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '24px',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
          }}
        >
          {post.title}
        </h1>

        {/* Meta - Centered */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '40px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
            <User className="w-4 h-4" />
            <span style={{ fontSize: '14px' }}>{authorName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
            <Calendar className="w-4 h-4" />
            <span style={{ fontSize: '14px' }}>{publishDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
            <Clock className="w-4 h-4" />
            <span style={{ fontSize: '14px' }}>5 min</span>
          </div>
        </div>

        {/* Featured Image */}
        {featuredImageUrl && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '40px',
            }}
          >
            <img
              src={featuredImageUrl}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div
            style={{
              fontSize: '19px',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '40px',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            fontSize: '18px',
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
          }}
          className="blog-content-minimal"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>
    </div>
  )
}
