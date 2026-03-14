import React from 'react'
import Image from 'next/image'
import type { PractitionerCardProps } from './types'

export const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  className = '',
}) => {
  const { name, slug, role, avatar, experience, specialties, bookable, _status } = practitioner

  if (_status && _status !== 'published') return null

  // Generate initials from name
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article
      className={`group flex h-full flex-col rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {/* Avatar */}
      <div className="mb-4 flex justify-center">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-[var(--color-base-100)]">
          {avatar?.url ? (
            <Image
              src={avatar.url}
              alt={avatar.alt || name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mb-4 flex-1 text-center">
        <h3 className="text-lg font-bold text-[var(--color-base-1000)]">{name}</h3>
        {role && (
          <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">{role}</p>
        )}
        {experience != null && experience > 0 && (
          <p className="mt-1 text-sm text-[var(--color-base-600)]">
            {experience} jaar ervaring
          </p>
        )}
      </div>

      {/* Specialties */}
      {specialties && specialties.length > 0 && (
        <div className="mb-4 flex flex-wrap justify-center gap-1.5">
          {specialties.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="rounded-full bg-[var(--color-base-100)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-700)]"
            >
              {s.specialty}
            </span>
          ))}
        </div>
      )}

      {/* Bookable indicator */}
      {bookable !== false && (
        <div className="mt-auto border-t border-[var(--color-base-200)] pt-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Online inplanbaar
          </span>
        </div>
      )}
    </article>
  )
}

export default PractitionerCard
