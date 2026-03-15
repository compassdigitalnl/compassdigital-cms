import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import type { KnowledgeBasePreviewProps } from './types'

const contentTypeLabels: Record<string, { label: string; emoji: string }> = {
  article: { label: 'Artikel', emoji: '📄' },
  guide: { label: 'Productgids', emoji: '📊' },
  elearning: { label: 'E-learning', emoji: '🎓' },
  download: { label: 'Download', emoji: '📥' },
  video: { label: 'Video', emoji: '🎥' },
}

export async function KnowledgeBasePreviewComponent(props: KnowledgeBasePreviewProps) {
  const { heading = 'Kennisbank', limit = 6, showFilters = false, showStats = true } = props

  const payload = await getPayload({ config })

  // Fetch knowledge base items: blog posts with a specific contentType set (not just 'article')
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        {
          contentType: {
            in: ['guide', 'elearning', 'download', 'video'],
          },
        },
      ],
    },
    limit: limit || 6,
    sort: '-publishedAt',
    depth: 2,
  })

  const items = result.docs

  // Also fetch total counts for stats
  let totalArticles = 0
  let premiumArticles = 0
  let totalReadingTime = 0

  if (showStats) {
    const allResult = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            contentType: {
              in: ['guide', 'elearning', 'download', 'video'],
            },
          },
        ],
      },
      limit: 0, // Just get totalDocs count
    })
    totalArticles = allResult.totalDocs

    const premiumResult = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            contentType: {
              in: ['guide', 'elearning', 'download', 'video'],
            },
          },
          { 'contentAccess.accessLevel': { equals: 'premium' } },
        ],
      },
      limit: 0,
    })
    premiumArticles = premiumResult.totalDocs

    // Calculate total reading time from fetched items (estimate based on average)
    totalReadingTime = items.reduce((acc: number, item: any) => {
      return acc + (item.readingTime || 5)
    }, 0)
    // Extrapolate for total
    if (items.length > 0) {
      const avgReadingTime = totalReadingTime / items.length
      totalReadingTime = Math.round(avgReadingTime * totalArticles)
    }
  }

  // Get unique content types for filters
  const activeContentTypes = showFilters
    ? [...new Set(items.map((item: any) => item.contentType).filter(Boolean))]
    : []

  if (items.length === 0 && !showStats) return null

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          {heading && (
            <h2 className="mb-4 text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl">
              {heading}
            </h2>
          )}

          {/* Stats bar */}
          {showStats && totalArticles > 0 && (
            <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-6 rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-50)] px-6 py-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="font-bold text-[var(--color-base-1000)]">{totalArticles}</span>
                <span className="text-[var(--color-base-600)]">artikelen</span>
              </div>
              {premiumArticles > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <span className="font-bold text-[var(--color-base-1000)]">{premiumArticles}</span>
                  <span className="text-[var(--color-base-600)]">premium</span>
                </div>
              )}
              {totalReadingTime > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="font-bold text-[var(--color-base-1000)]">{totalReadingTime}</span>
                  <span className="text-[var(--color-base-600)]">min leestijd totaal</span>
                </div>
              )}
            </div>
          )}

          {/* Content type filters */}
          {showFilters && activeContentTypes.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              {activeContentTypes.map((type: string) => {
                const info = contentTypeLabels[type] || { label: type, emoji: '📄' }
                return (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-1.5 text-xs font-medium text-[var(--color-base-700)]"
                  >
                    <span>{info.emoji}</span>
                    {info.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any) => {
              const featuredImage =
                item.featuredImage && typeof item.featuredImage === 'object'
                  ? item.featuredImage
                  : null
              const imageUrl = featuredImage?.url || null

              const contentTypeInfo = contentTypeLabels[item.contentType] || contentTypeLabels.article
              const isPremium = item.contentAccess?.accessLevel === 'premium'
              const readingTime = item.readingTime || null

              const category =
                item.categories &&
                Array.isArray(item.categories) &&
                item.categories.length > 0 &&
                typeof item.categories[0] === 'object'
                  ? item.categories[0]
                  : null

              const categorySlug =
                category && typeof category === 'object' && 'slug' in category
                  ? category.slug
                  : 'algemeen'
              const url = `/blog/${categorySlug}/${item.slug}`

              return (
                <a
                  key={item.id}
                  href={url}
                  className="group overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-base-100)]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title || ''}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl">{contentTypeInfo.emoji}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-base-0)]/90 px-2.5 py-1 text-xs font-medium text-[var(--color-base-700)] backdrop-blur-sm">
                        {contentTypeInfo.emoji} {contentTypeInfo.label}
                      </span>
                      {isPremium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-2 text-base font-bold text-[var(--color-base-1000)] line-clamp-2 transition-colors group-hover:text-[var(--color-primary)]">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="mb-3 text-sm text-[var(--color-base-600)] line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}

                    {readingTime && (
                      <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {readingTime} min leestijd
                      </div>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* CTA Link */}
        <div className="mt-10 text-center">
          <a
            href="/knowledge-base"
            className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover,var(--color-primary))]"
          >
            Bekijk de volledige kennisbank
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
