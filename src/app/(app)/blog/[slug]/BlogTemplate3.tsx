'use client'

import type { BlogPost } from '@/payload-types'
import { Calendar, User, Sparkles } from 'lucide-react'

interface BlogTemplate3Props {
  post: BlogPost
}

export default function BlogTemplate3({ post }: BlogTemplate3Props) {
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
      {/* Premium: Wide Layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Categories - Premium Badge */}
        {categoryBadges && categoryBadges.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
            {categoryBadges.map((cat, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title - Extra Large */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '32px',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h1>

        {/* Meta - Premium */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}
          >
            <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {authorName}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}
          >
            <Calendar className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {publishDate}
            </span>
          </div>
        </div>

        {/* Featured Image - Full Width */}
        {featuredImageUrl && (
          <div
            style={{
              width: 'calc(100% + 80px)',
              marginLeft: '-40px',
              aspectRatio: '21/9',
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '64px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={featuredImageUrl}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Excerpt - Large Quote Style */}
        {post.excerpt && (
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto 64px',
              fontSize: '24px',
              lineHeight: 1.7,
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              textAlign: 'center',
              fontStyle: 'italic',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb, 59, 130, 246), 0.03) 0%, rgba(var(--color-primary-rgb, 59, 130, 246), 0.08) 100%)',
              border: '2px solid color-mix(in srgb, var(--color-primary) 15%, white)',
              borderRadius: '20px',
            }}
          >
            "{post.excerpt}"
          </div>
        )}

        {/* Content - Wide */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            fontSize: '19px',
            lineHeight: 1.9,
            color: 'var(--color-text-secondary)',
          }}
          className="blog-content-premium"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Premium Footer */}
        <div
          style={{
            maxWidth: '900px',
            margin: '80px auto 0',
            paddingTop: '40px',
            borderTop: '2px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
              color: 'white',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(var(--color-primary-rgb, 59, 130, 246), 0.3)',
            }}
          >
            <Sparkles className="w-5 h-5" />
            Premium Content
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </div>
  )
}
