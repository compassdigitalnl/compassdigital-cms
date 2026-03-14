import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { StylistCardProps } from './types'

export const StylistCard: React.FC<StylistCardProps> = ({
  stylist,
  showBookButton = true,
  className = '',
}) => {
  const { name, slug, role, avatar, bio, specialties, bookable, _status } = stylist

  if (_status && _status !== 'published') return null

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
            <div className="flex h-full w-full items-center justify-center text-3xl text-[var(--color-base-400)]">
              {name.charAt(0)}
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
        {bio && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-base-700)] line-clamp-3">{bio}</p>
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

      {/* Book Button */}
      {showBookButton && bookable && (
        <Link
          href={`/boeken?stylist=${slug}`}
          className="mt-auto block rounded-lg border border-[var(--color-primary)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:bg-[var(--color-primary)] hover:text-white"
        >
          Boek bij {name.split(' ')[0]}
        </Link>
      )}
    </article>
  )
}

export default StylistCard
