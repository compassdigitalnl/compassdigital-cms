'use client'

import type { BlogPost } from '@/payload-types'
import { Calendar, User, Clock, Share2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface BlogTemplate1Props {
  post: BlogPost
  relatedPosts?: BlogPost[]
}

export default function BlogTemplate1({ post, relatedPosts = [] }: BlogTemplate1Props) {
  const [showRelated, setShowRelated] = useState(false)

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
    <div className="pb-24 lg:pb-8" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Magazine: Mobile-first Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-[2fr,1fr] gap-8 lg:gap-16">
        {/* Main Content */}
        <article>
          {/* Categories */}
          {categoryBadges && categoryBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
              {categoryBadges.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold uppercase tracking-wide"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                  }}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-3xl lg:text-5xl font-extrabold leading-tight mb-4 lg:mb-6"
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div
            className="flex flex-wrap gap-3 lg:gap-6 mb-6 lg:mb-8 pb-4 lg:pb-6"
            style={{ borderBottom: '2px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{authorName}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{publishDate}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <Clock className="w-4 h-4" />
              <span className="text-sm">5 min lezen</span>
            </div>
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="w-full aspect-video rounded-xl lg:rounded-2xl overflow-hidden mb-6 lg:mb-10">
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
              className="text-base lg:text-xl leading-relaxed font-medium italic mb-6 lg:mb-10 p-4 lg:p-6 rounded-xl lg:rounded-2xl"
              style={{
                color: 'var(--color-text-secondary)',
                background: 'var(--color-surface, #F9FAFB)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="text-base lg:text-lg leading-relaxed lg:leading-loose blog-content"
            style={{ color: 'var(--color-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Desktop Share Buttons */}
          <div
            className="hidden lg:flex mt-16 pt-8 items-center gap-4"
            style={{ borderTop: '2px solid var(--color-border)' }}
          >
            <span
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Deel dit artikel:
            </span>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <Share2 className="w-4 h-4" />
              Delen
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 lg:space-y-6">
          {/* Author Card */}
          <div
            className="p-4 lg:p-6 rounded-xl lg:rounded-2xl"
            style={{
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3
              className="text-sm lg:text-base font-bold mb-2 lg:mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Over de auteur
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Geschreven door <strong>{authorName}</strong>
            </p>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div
              className="rounded-xl lg:rounded-2xl overflow-hidden"
              style={{
                background: 'var(--color-surface, white)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Mobile: Collapsible Header */}
              <button
                onClick={() => setShowRelated(!showRelated)}
                className="lg:hidden w-full p-4 flex items-center justify-between"
              >
                <h3
                  className="text-base font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Gerelateerde artikelen
                </h3>
                {showRelated ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Desktop: Always visible header */}
              <h3
                className="hidden lg:block text-lg font-bold p-6 pb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Gerelateerde artikelen
              </h3>

              {/* Related Posts List */}
              <div
                className={`
                  ${showRelated ? 'block' : 'hidden'} lg:block
                  px-4 pb-4 lg:px-6 lg:pb-6 space-y-3 lg:space-y-4
                `}
              >
                {relatedPosts.slice(0, 3).map((relPost) => {
                  const relImg =
                    typeof relPost.featuredImage === 'object' && relPost.featuredImage !== null
                      ? relPost.featuredImage.url
                      : null
                  return (
                    <Link
                      key={relPost.id}
                      href={`/blog/${relPost.slug}`}
                      className="flex gap-3 p-2 lg:p-3 rounded-lg transition-colors hover:bg-gray-50"
                    >
                      {relImg && (
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={relImg}
                            alt={relPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm lg:text-base font-semibold leading-snug mb-1 line-clamp-2"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {relPost.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span
                            className="text-xs lg:text-sm font-medium"
                            style={{ color: 'var(--color-primary)' }}
                          >
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
        </aside>
      </div>

      {/* MOBILE: Sticky Share Button */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-50"
        style={{
          background: 'white',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <button
          className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-opacity active:opacity-80"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          <Share2 className="w-5 h-5" />
          Deel dit artikel
        </button>
      </div>
    </div>
  )
}
