import React from 'react'
import Link from 'next/link'
import type { CourseCardProps } from './types'
import { formatPrice, formatDuration, formatLevel, formatRating } from '../../lib/courseUtils'

export const CourseCard: React.FC<CourseCardProps> = ({ course, className = '' }) => {
  const {
    title,
    slug,
    thumbnail,
    category,
    instructor,
    level,
    price,
    originalPrice,
    rating,
    reviewCount,
    studentCount,
    duration,
    featured,
    createdAt,
  } = course

  const thumbnailUrl =
    thumbnail && typeof thumbnail === 'object' ? thumbnail.url : undefined
  const thumbnailAlt =
    thumbnail && typeof thumbnail === 'object' ? thumbnail.alt : undefined

  const categoryName =
    category && typeof category === 'object' ? category.name : undefined

  const instructorName =
    instructor && typeof instructor === 'object' ? instructor.name : undefined
  const instructorInitials = instructorName
    ? instructorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  // Determine badge
  const isNew =
    createdAt && Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
  const isBestseller = (studentCount ?? 0) > 1000

  // Level badge colors
  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 border-green/20',
    gevorderd: 'bg-teal-100 text-teal-700 border-teal/20',
    expert: 'bg-teal-100 text-teal-700 border-teal/20',
  }

  return (
    <Link
      href={`/cursussen/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
      aria-label={title}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={thumbnailAlt || title}
            className="h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-[180px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5">
            <svg
              className="h-12 w-12 text-[var(--color-primary)]/30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {isBestseller ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Bestseller
          </span>
        ) : isNew ? (
          <span className="absolute left-3 top-3 rounded-full bg-green px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Nieuw
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {categoryName && (
          <span className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug text-[var(--color-base-1000)]">
          {title}
        </h3>

        {/* Instructor */}
        {instructorName && (
          <div className="mb-2.5 flex items-center gap-2 text-xs text-[var(--color-base-500)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-sky-400 text-[9px] font-bold text-white">
              {instructorInitials}
            </span>
            <span>{instructorName}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-3 border-t border-[var(--color-base-100)] pt-2.5 text-xs text-[var(--color-base-400)]">
          {/* Rating */}
          {rating != null && rating > 0 && (
            <span className="flex items-center gap-1 font-semibold text-amber-500">
              <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {formatRating(rating)}
            </span>
          )}

          {/* Student count */}
          {studentCount != null && studentCount > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {studentCount.toLocaleString('nl-NL')}
            </span>
          )}

          {/* Duration */}
          {duration != null && duration > 0 && (
            <span className="flex items-center gap-1">
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
              {formatDuration(duration)}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price + Level */}
      <div className="flex items-center justify-between border-t border-[var(--color-base-100)] bg-[var(--color-base-50)] px-4 py-3">
        <div className="font-mono text-lg font-extrabold text-[var(--color-primary)]">
          {originalPrice != null && originalPrice > price && (
            <span className="mr-1.5 text-xs font-normal text-[var(--color-base-400)] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {formatPrice(price)}
        </div>

        {level && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
              levelColors[level] || 'bg-[var(--color-base-100)] text-[var(--color-base-500)] border-[var(--color-base-200)]'
            }`}
          >
            {formatLevel(level)}
          </span>
        )}
      </div>
    </Link>
  )
}
