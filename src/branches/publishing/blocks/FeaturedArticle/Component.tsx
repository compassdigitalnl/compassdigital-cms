import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import type { FeaturedArticleProps } from './types'

export async function FeaturedArticleComponent(props: FeaturedArticleProps) {
  const { heading, article: articleProp, showExcerpt = true, showAuthor = true } = props

  const payload = await getPayload({ config })

  let article: any = null

  // If article is selected, use it (may be an ID or an object)
  if (articleProp) {
    if (typeof articleProp === 'object' && articleProp !== null && articleProp.id) {
      article = articleProp
    } else if (typeof articleProp === 'number') {
      const result = await payload.findByID({
        collection: 'blog-posts',
        id: articleProp,
        depth: 2,
      })
      article = result
    }
  }

  // If no article selected, auto-pick the latest featured article
  if (!article) {
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { featured: { equals: true } },
        ],
      },
      limit: 1,
      sort: '-publishedAt',
      depth: 2,
    })
    article = result.docs[0] || null
  }

  // Final fallback: latest published article
  if (!article) {
    const result = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 1,
      sort: '-publishedAt',
      depth: 2,
    })
    article = result.docs[0] || null
  }

  if (!article) return null

  const featuredImage =
    article.featuredImage && typeof article.featuredImage === 'object'
      ? article.featuredImage
      : null
  const imageUrl = featuredImage?.url || null

  const author =
    article.author && typeof article.author === 'object' ? article.author : null

  const category =
    article.categories &&
    Array.isArray(article.categories) &&
    article.categories.length > 0 &&
    typeof article.categories[0] === 'object'
      ? article.categories[0]
      : null

  const readingTime = article.readingTime || null

  const categorySlug =
    category && typeof category === 'object' && 'slug' in category
      ? category.slug
      : 'algemeen'
  const url = `/blog/${categorySlug}/${article.slug}`

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl">
              {heading}
            </h2>
          </div>
        )}

        <a
          href={url}
          className="group block overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)]/30"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image - left side on desktop, top on mobile */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-base-100)] lg:aspect-auto lg:w-1/2">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={article.title || ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <span className="text-8xl">{article.featuredImageEmoji || '📰'}</span>
                </div>
              )}

              {/* Category badge overlay */}
              {category && typeof category === 'object' && 'title' in category && (
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {category.title as React.ReactNode}
                  </span>
                </div>
              )}
            </div>

            {/* Content - right side on desktop */}
            <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
              <h3 className="mb-4 text-2xl font-extrabold text-[var(--color-base-1000)] transition-colors group-hover:text-[var(--color-primary)] md:text-3xl lg:text-4xl">
                {article.title}
              </h3>

              {showExcerpt && article.excerpt && (
                <p className="mb-6 text-base text-[var(--color-base-600)] line-clamp-3 md:text-lg">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Meta */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-base-500)]">
                {showAuthor && author && (
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                      {(author.name || author.email || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-[var(--color-base-700)]">
                      {author.name || author.email}
                    </span>
                  </span>
                )}
                {readingTime && (
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {readingTime} min leestijd
                  </span>
                )}
                {publishedDate && (
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {publishedDate}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div>
                <span className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover,var(--color-primary))]">
                  Lees meer
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  )
}
