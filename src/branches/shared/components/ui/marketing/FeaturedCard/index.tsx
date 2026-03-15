import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedCardProps } from './types'

/**
 * FeaturedCard - Full-width featured item card
 *
 * Horizontal card with large image and content overlay.
 * Used by: construction (featured project), blog (featured post),
 * experiences (featured experience), any archive with a highlight item.
 */
export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  badge,
  meta,
  href,
  ctaText = 'Bekijk',
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl bg-navy ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        {imageUrl && (
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px]">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-center p-6 md:p-10">
          {badge && (
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              {badge}
            </span>
          )}

          <h3 className="text-2xl font-bold text-white md:text-3xl">
            {title}
          </h3>

          {description && (
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              {description}
            </p>
          )}

          {/* Meta info */}
          {meta && meta.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {meta.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5 text-sm text-white/60">
                  {item.icon && <span>{item.icon}</span>}
                  {item.text}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
              {ctaText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default FeaturedCard
