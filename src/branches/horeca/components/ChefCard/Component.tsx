import React from 'react'
import Image from 'next/image'
import type { ChefCardProps } from './types'

export const ChefCard: React.FC<ChefCardProps> = ({ member, className = '' }) => {
  const { name, slug, role, avatar, bio, specialties, _status } = member

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
        <div className="flex flex-wrap justify-center gap-1.5">
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
    </article>
  )
}

export default ChefCard
