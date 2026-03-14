import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { AuthorCardProps } from './types'

/**
 * AuthorCard — Author display card
 *
 * Server component that shows the author's avatar (or initials fallback),
 * name, bio excerpt, and article count badge.
 * Links to the author filter page when a slug is provided.
 *
 * @example
 * ```tsx
 * <AuthorCard
 *   author={{
 *     name: 'Jan de Vries',
 *     bio: 'Hoofdredacteur en specialist in digitale media.',
 *     avatar: '/media/authors/jan.jpg',
 *     articleCount: 42,
 *     slug: 'jan-de-vries',
 *   }}
 * />
 * ```
 */
export const AuthorCard: React.FC<AuthorCardProps> = ({ author, className = '' }) => {
  const { name, bio, avatar, articleCount, slug } = author

  // Generate initials from name (first letter of first two words)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  const content = (
    <div
      className={`group flex items-start gap-4 rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5 md:p-6 transition-all duration-200 hover:shadow-md hover:border-[var(--color-base-300)] ${className}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatar ? (
          <div className="relative h-14 w-14 overflow-hidden rounded-full md:h-16 md:w-16">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#2563eb] text-lg font-bold text-white md:h-16 md:w-16 md:text-xl">
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <h4 className="text-base font-bold text-[var(--color-base-1000)] transition-colors group-hover:text-[var(--color-primary)] md:text-lg">
          {name}
        </h4>

        {/* Bio */}
        {bio && (
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-base-600)] line-clamp-2">
            {bio}
          </p>
        )}

        {/* Article count badge */}
        {typeof articleCount === 'number' && articleCount > 0 && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-base-100)] px-3 py-1 text-xs font-medium text-[var(--color-base-600)]">
            <FileText className="h-3 w-3" />
            {articleCount} {articleCount === 1 ? 'artikel' : 'artikelen'}
          </span>
        )}
      </div>
    </div>
  )

  // Wrap in link if slug is provided
  if (slug) {
    return (
      <Link href={`/blog?auteur=${slug}`} className="block no-underline">
        {content}
      </Link>
    )
  }

  return content
}

export default AuthorCard
