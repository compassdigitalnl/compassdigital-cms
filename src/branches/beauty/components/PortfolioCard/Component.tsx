import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { PortfolioCardProps } from './types'

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, className = '' }) => {
  const { title, slug, shortDescription, featuredImage, _status } = item

  if (_status && _status !== 'published') return null

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-base-100)]">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[var(--color-base-300)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--color-base-1000)]">{title}</h3>
        {shortDescription && (
          <p className="mt-1 text-sm text-[var(--color-base-700)] line-clamp-2">{shortDescription}</p>
        )}
        <Link
          href={`/portfolio/${slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:text-[var(--color-base-800)]"
        >
          Bekijk resultaat
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export default PortfolioCard
