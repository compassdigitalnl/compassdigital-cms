import React from 'react'
import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { LibraryEditionCard } from '../LibraryEditionCard/Component'
import type { LibraryMagazineGridProps } from './types'

export const LibraryMagazineGrid: React.FC<LibraryMagazineGridProps> = ({
  magazine,
  editions,
  className = '',
}) => {
  return (
    <div className={className}>
      {/* Back link */}
      <Link
        href="/account/bibliotheek"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-base-500,#64748b)] no-underline transition-colors hover:text-[var(--color-primary,#7c3aed)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Terug naar bibliotheek
      </Link>

      {/* Magazine header */}
      <div className="mb-8 flex items-start gap-5">
        {/* Cover */}
        <div className="hidden h-32 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-base-200,#f3f4f6)] md:flex">
          {magazine.coverUrl ? (
            <img
              src={magazine.coverUrl}
              alt={magazine.name}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <BookOpen
              className="h-8 w-8 text-[var(--color-primary,#7c3aed)]"
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="mb-1 font-heading text-xl font-extrabold text-[var(--color-base-900,#0f172a)] md:text-2xl">
            {magazine.name}
          </h1>
          {magazine.tagline && (
            <p className="mb-2 text-sm text-[var(--color-base-500,#64748b)]">
              {magazine.tagline}
            </p>
          )}
          <span className="text-xs text-[var(--color-base-400,#94a3b8)]">
            {editions.length} {editions.length === 1 ? 'editie' : 'edities'} beschikbaar
          </span>
        </div>
      </div>

      {/* Editions grid */}
      {editions.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-4">
          {editions.map((edition) => (
            <LibraryEditionCard
              key={edition.editionIndex}
              magazineSlug={magazine.slug}
              editionIndex={edition.editionIndex}
              title={edition.title}
              issueNumber={edition.issueNumber}
              year={edition.year}
              coverUrl={edition.coverUrl}
              pageCount={edition.pageCount}
              publishDate={edition.publishDate}
              isAvailable={edition.isAvailable}
              progress={edition.progress}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen
            className="mb-3 h-12 w-12 text-[var(--color-base-300,#cbd5e1)]"
            strokeWidth={1}
          />
          <p className="text-sm text-[var(--color-base-500,#64748b)]">
            Er zijn nog geen digitale edities beschikbaar voor dit tijdschrift.
          </p>
        </div>
      )}
    </div>
  )
}
