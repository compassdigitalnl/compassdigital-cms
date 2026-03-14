import React from 'react'
import type { InstructorCardProps } from './types'
import { formatRating } from '../../lib/courseUtils'

export const InstructorCard: React.FC<InstructorCardProps> = ({
  instructor,
  className = '',
}) => {
  const {
    name,
    title,
    role,
    photo,
    bio,
    shortBio,
    avgRating,
    totalStudents,
    courseCount,
  } = instructor

  const photoUrl = photo && typeof photo === 'object' ? photo.url : undefined
  const displayBio = shortBio || bio

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8 ${className}`}
    >
      <h2 className="mb-5 flex items-center gap-2.5 text-xl font-extrabold text-[var(--color-base-1000)]">
        <svg
          className="h-6 w-6 text-[var(--color-primary)]"
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
        Docent
      </h2>

      <div className="flex gap-4">
        {/* Avatar */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-sky-400 text-xl font-bold text-white">
            {initials}
          </div>
        )}

        <div className="flex-1">
          {/* Name & Title */}
          <h3 className="text-base font-bold text-[var(--color-base-1000)]">{name}</h3>
          {(title || role) && (
            <p className="mb-2 text-xs text-[var(--color-base-500)]">{title || role}</p>
          )}

          {/* Stats */}
          <div className="mb-3 flex flex-wrap gap-4">
            {avgRating != null && avgRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
                <svg className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-semibold text-amber-600">{formatRating(avgRating)}</span>
                beoordeling
              </div>
            )}
            {totalStudents != null && totalStudents > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
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
                {totalStudents.toLocaleString('nl-NL')} studenten
              </div>
            )}
            {courseCount != null && courseCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {courseCount} {courseCount === 1 ? 'cursus' : 'cursussen'}
              </div>
            )}
          </div>

          {/* Bio excerpt */}
          {displayBio && (
            <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--color-base-600)]">
              {displayBio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
