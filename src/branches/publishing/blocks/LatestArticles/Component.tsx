import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import type { LatestArticlesProps } from './types'

export async function LatestArticlesComponent(props: LatestArticlesProps) {
  const {
    heading,
    limit = 6,
    columns = '3',
    categoryFilter,
    showPremiumBadge = true,
  } = props

  const payload = await getPayload({ config })

  // Build where clause
  const whereConditions: any[] = [{ status: { equals: 'published' } }]

  // Optional category filter
  if (categoryFilter && Array.isArray(categoryFilter) && categoryFilter.length > 0) {
    const categoryIds = categoryFilter.map((c) => (typeof c === 'object' ? c.id : c)).filter(Boolean)
    if (categoryIds.length > 0) {
      whereConditions.push({ categories: { in: categoryIds } })
    }
  }

  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: whereConditions,
    },
    limit: limit || 6,
    sort: '-publishedAt',
    depth: 2,
  })

  const articles = result.docs

  if (articles.length === 0) return null

  const gridColsClasses: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3']

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

        <div className={`grid ${gridClass} gap-6`}>
          {articles.map((article: any) => {
            const featuredImage =
              article.featuredImage && typeof article.featuredImage === 'object'
                ? article.featuredImage
                : null
            const imageUrl = featuredImage?.url || null

            const category =
              article.categories &&
              Array.isArray(article.categories) &&
              article.categories.length > 0 &&
              typeof article.categories[0] === 'object'
                ? article.categories[0]
                : null

            const isPremium = article.contentAccess?.accessLevel === 'premium'
            const readingTime = article.readingTime || null

            const categorySlug =
              category && typeof category === 'object' && 'slug' in category
                ? category.slug
                : 'algemeen'
            const url = `/blog/${categorySlug}/${article.slug}`

            const publishedDate = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : null

            return (
              <a
                key={article.id}
                href={url}
                className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-base-100)]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={article.title || ''}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl">{article.featuredImageEmoji || '📄'}</span>
                    </div>
                  )}

                  {/* Premium badge */}
                  {showPremiumBadge && isPremium && (
                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Pro
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category badge */}
                  {category && typeof category === 'object' && 'title' in category && (
                    <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {category.title as React.ReactNode}
                    </span>
                  )}

                  <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)] line-clamp-2 transition-colors group-hover:text-[var(--color-primary)]">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="mb-4 text-sm text-[var(--color-base-600)] line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-base-500)]">
                    {readingTime && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {readingTime} min leestijd
                      </span>
                    )}
                    {publishedDate && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {publishedDate}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
