'use client'

import type { BlogPost } from '@/payload-types'
import { Calendar, User, Clock, Share2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface BlogTemplate1Props {
  post: BlogPost
  relatedPosts?: BlogPost[]
}

export default function BlogTemplate1({ post, relatedPosts = [] }: BlogTemplate1Props) {
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
      {/* Magazine: 2-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '64px',
          marginBottom: '64px',
        }}
        className="blog-magazine-layout"
      >
        {/* Main Content */}
        <div>
          {/* Categories */}
          {categoryBadges && categoryBadges.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {categoryBadges.map((cat, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
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
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '24px',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '2px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
              <User className="w-4 h-4" />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{authorName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
              <Calendar className="w-4 h-4" />
              <span style={{ fontSize: '14px' }}>{publishDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
              <Clock className="w-4 h-4" />
              <span style={{ fontSize: '14px' }}>5 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '16px',
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
                fontSize: '20px',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                marginBottom: '40px',
                fontStyle: 'italic',
                padding: '24px',
                background: 'var(--color-surface, #F9FAFB)',
                borderLeft: '4px solid var(--color-primary)',
                borderRadius: '8px',
              }}
            >
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            style={{
              fontSize: '17px',
              lineHeight: 1.9,
              color: 'var(--color-text-secondary)',
            }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Share Buttons */}
          <div
            style={{
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '2px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Deel dit artikel:
              </span>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Share2 className="w-4 h-4" />
                Delen
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Author Card */}
          <div
            style={{
              padding: '24px',
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '12px',
                color: 'var(--color-text-primary)',
              }}
            >
              Over de auteur
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
              Geschreven door <strong>{authorName}</strong>
            </p>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div
              style={{
                padding: '24px',
                background: 'var(--color-surface, white)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: 'var(--color-text-primary)',
                }}
              >
                Gerelateerde artikelen
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {relatedPosts.slice(0, 3).map((relPost) => {
                  const relImg =
                    typeof relPost.featuredImage === 'object' && relPost.featuredImage !== null
                      ? relPost.featuredImage.url
                      : null
                  return (
                    <Link
                      key={relPost.id}
                      href={`/blog/${relPost.slug}`}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        textDecoration: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-surface, #F9FAFB)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {relImg && (
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={relImg}
                            alt={relPost.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            marginBottom: '4px',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {relPost.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 500 }}>
                            Lees meer
                          </span>
                          <ArrowRight className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .blog-magazine-layout {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </div>
  )
}
