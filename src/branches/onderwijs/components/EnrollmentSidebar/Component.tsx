'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { EnrollmentSidebarProps } from './types'
import { formatPrice, formatDuration, calculateDiscount } from '../../lib/courseUtils'

export const EnrollmentSidebar: React.FC<EnrollmentSidebarProps> = ({ course }) => {
  const {
    title,
    slug,
    thumbnail,
    price,
    originalPrice,
    discountPercentage,
    discountEndsAt,
    duration,
    totalLessons,
    certificate,
    includes,
  } = course

  const thumbnailUrl =
    thumbnail && typeof thumbnail === 'object' ? thumbnail.url : undefined

  const discount =
    discountPercentage ||
    (originalPrice && originalPrice > price ? calculateDiscount(price, originalPrice) : 0)

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!discountEndsAt) return

    const calculateTimeLeft = () => {
      const diff = new Date(discountEndsAt).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}u`)
      } else {
        setTimeLeft(`${hours}u ${minutes}m`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [discountEndsAt])

  // Default includes if none provided
  const featureList = includes && includes.length > 0
    ? includes.map((item) => item.text)
    : [
        duration ? `${duration} uur video` : null,
        totalLessons ? `${totalLessons} lessen` : null,
        certificate ? 'Certificaat bij voltooiing' : null,
        'Levenslang toegang',
        'Toegang op mobiel',
        'Downloadbare bronnen',
      ].filter(Boolean) as string[]

  const iconForFeature = (text: string) => {
    const lower = text.toLowerCase()
    if (lower.includes('video') || lower.includes('uur'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )
    if (lower.includes('les'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    if (lower.includes('certificaat'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    if (lower.includes('levenslang'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      )
    if (lower.includes('mobiel'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      )
    if (lower.includes('download'))
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      )
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }

  return (
    <div className="sticky top-24 overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-lg">
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-[200px] w-full object-cover"
        />
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5">
          <svg
            className="h-16 w-16 text-[var(--color-primary)]/30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      )}

      <div className="p-6">
        {/* Price section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-[var(--color-base-1000)]">
              {formatPrice(price)}
            </span>
            {originalPrice != null && originalPrice > price && (
              <span className="text-sm text-[var(--color-base-400)] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                -{discount}%
              </span>
            )}
          </div>

          {/* Timer */}
          {timeLeft && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-coral">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Aanbieding verloopt over {timeLeft}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={`/cursussen/${slug}/inschrijven`}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
          Inschrijven
        </Link>

        {/* Features list */}
        <div className="mb-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-base-500)]">
            Wat krijg je?
          </h4>
          <ul className="space-y-2.5">
            {featureList.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-[13px] text-[var(--color-base-700)]"
              >
                <span className="text-[var(--color-primary)]">
                  {iconForFeature(feature)}
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Guarantees */}
        <div className="border-t border-[var(--color-base-100)] pt-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: 'shield', label: '30 dagen retour' },
              { icon: 'infinity', label: 'Levenslang toegang' },
              { icon: 'award', label: 'Certificaat' },
              { icon: 'smartphone', label: 'Mobiel toegankelijk' },
            ].map((guarantee) => (
              <div
                key={guarantee.label}
                className="flex items-center gap-1.5 text-[11px] text-[var(--color-base-500)]"
              >
                <svg
                  className="h-3 w-3 text-green"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {guarantee.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
