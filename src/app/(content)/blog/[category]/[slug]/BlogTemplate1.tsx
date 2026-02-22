'use client'

import type { BlogPost, Product, BlogCategory } from '@/payload-types'
import { Icon } from '@/branches/shared/components/common/Icon'
import Link from 'next/link'
import { TableOfContents } from '@/branches/shared/components/features/blog/blog/TableOfContents'
import { ShareButtons } from '@/branches/shared/components/features/blog/blog/ShareButtons'
import { AuthorBox } from '@/branches/shared/components/features/blog/blog/AuthorBox'
import { RelatedArticles } from '@/branches/shared/components/features/blog/blog/RelatedArticles'
import { PrevNextNavigation } from '@/branches/shared/components/features/blog/blog/PrevNextNavigation'
import { ReadingProgressBar } from '@/branches/shared/components/features/blog/blog/ReadingProgressBar'
import { BlogPostWithPaywall } from '@/branches/content/components/BlogPostWithPaywall'

interface BlogTemplate1Props {
  post: BlogPost
  relatedPosts?: BlogPost[]
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
  category: BlogCategory
}

export default function BlogTemplate1({ post, relatedPosts = [], prevPost, nextPost, category }: BlogTemplate1Props) {
  // Get category info (already passed as prop, but keep for backwards compatibility)
  const firstCategory = post.categories?.[0]
  const categoryName = typeof firstCategory === 'object' && firstCategory !== null ? firstCategory.name : 'Blog'
  const categorySlug = typeof firstCategory === 'object' && firstCategory !== null ? firstCategory.slug : 'blog'

  // Format date
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  // Related products
  const relatedProducts = post.relatedProducts || []

  // Get featured tag info
  const getFeaturedTagInfo = () => {
    switch (post.featuredTag) {
      case 'guide':
        return { icon: 'BookOpen', label: 'Handleiding', color: 'var(--color-info)' }
      case 'new':
        return { icon: 'Sparkles', label: 'Nieuw', color: 'var(--color-success)' }
      case 'featured':
        return { icon: 'Star', label: 'Uitgelicht', color: 'var(--color-warning)' }
      case 'tip':
        return { icon: 'Lightbulb', label: 'Tip', color: '#8b5cf6' }
      case 'news':
        return { icon: 'Newspaper', label: 'Nieuws', color: 'var(--color-info)' }
      default:
        return null
    }
  }

  const featuredTag = getFeaturedTagInfo()

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Two-column layout: Main content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start pb-16">
        {/* ═══ MAIN CONTENT ═══ */}
        <main>
          {/* Hero Image/Emoji */}
          <div className="relative w-full h-[360px] rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-8xl mb-7 overflow-hidden">
            {/* Featured Tag Badge */}
            {featuredTag && (
              <div
                className="absolute top-5 left-5 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
                style={{ background: featuredTag.color }}
              >
                <Icon name={featuredTag.icon as any} size={13} />
                {featuredTag.label}
              </div>
            )}

            {/* Emoji or Image */}
            {post.featuredImageEmoji || '📄'}
          </div>

          {/* Meta Bar */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
            {/* Category Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100">
              <Icon name="Tag" size={13} />
              {categoryName}
            </span>

            {/* Date */}
            {publishDate && (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Icon name="Calendar" size={14} />
                {publishDate}
              </span>
            )}

            {/* Reading Time */}
            {post.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon name="Clock" size={14} />
                  {post.readingTime} min leestijd
                </span>
              </>
            )}

            {/* View Count */}
            {post.viewCount && post.viewCount > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon name="Eye" size={14} />
                  {post.viewCount.toLocaleString('nl-NL')} keer bekeken
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Intro/Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-7 pb-7 border-b border-gray-200">
              {post.excerpt}
            </p>
          )}

          {/* Article Content (with Paywall for Premium) */}
          {post.content && <BlogPostWithPaywall post={post} className="mb-10" />}

          {/* Bottom Section: Tags + Share */}
          <div className="pt-8 border-t border-gray-200 mt-10">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {post.tags.map((tagItem, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${encodeURIComponent(tagItem.tag || '')}`}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                  >
                    {tagItem.tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            {post.enableShare !== false && <ShareButtons title={post.title} url={currentUrl} />}
          </div>

          {/* Author Box */}
          {post.author && <AuthorBox author={post.author} authorBio={post.authorBio} className="mt-7" />}

          {/* Related Articles */}
          {relatedPosts && relatedPosts.length > 0 && (
            <RelatedArticles posts={relatedPosts} className="mt-12" />
          )}

          {/* Previous/Next Navigation */}
          <PrevNextNavigation
            prevPost={prevPost}
            nextPost={nextPost}
            category={category}
            className="mt-8"
          />
        </main>

        {/* ═══ SIDEBAR ═══ */}
        <aside className="flex flex-col gap-5">
          {/* Table of Contents */}
          {post.enableTOC !== false && <TableOfContents />}

          {/* Related Products Sidebar */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 font-extrabold text-sm text-gray-900 mb-4">
                <Icon name="Package" size={16} className="text-teal-600" />
                Gerelateerde producten
              </div>

              <div className="flex flex-col gap-0">
                {relatedProducts.slice(0, 3).map((product, index) => {
                  if (typeof product === 'string') return null
                  const prod = product as Product

                  return (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className={`flex gap-3 py-3 items-center hover:opacity-80 transition-opacity ${
                        index < relatedProducts.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      {/* Product Image/Emoji */}
                      <div className="w-13 h-13 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🧤
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {prod.brand && (
                          <div className="text-xs font-bold uppercase tracking-wide text-teal-600">
                            {typeof prod.brand === 'object' ? prod.brand.name : prod.brand}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {prod.title}
                        </div>
                      </div>

                      {/* Price */}
                      {prod.price && (
                        <div className="text-sm font-extrabold text-gray-900 flex-shrink-0">
                          €{prod.price.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h4 className="text-lg font-extrabold text-white mb-2">Producten nodig?</h4>
              <p className="text-sm text-white/60 mb-4">
                Bekijk ons complete assortiment medische supplies
              </p>
              <Link
                href="/products/"
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors"
              >
                <Icon name="ShoppingCart" size={16} />
                Naar de shop
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
