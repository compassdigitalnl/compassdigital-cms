'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import {
  Library,
  BookOpen,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { LibraryEditionCard } from '../LibraryEditionCard/Component'
import { RecentlyReadBanner } from '../RecentlyReadBanner/Component'
import type { LibraryOverviewProps } from './types'

export const LibraryOverview: React.FC<LibraryOverviewProps> = ({
  magazines,
  recentlyRead,
  latestEditions,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLatest = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 300
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-50,#fafafa)]">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden px-4 py-10 md:px-8 md:py-16"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <Library className="h-8 w-8 text-white/80" strokeWidth={1.5} />
            <h1 className="font-heading text-2xl font-extrabold text-white md:text-4xl">
              Mijn Digitale Bibliotheek
            </h1>
          </div>
          <p className="max-w-xl text-sm text-white/75 md:text-base">
            Al je tijdschriften op een plek. Lees je favoriete edities wanneer en waar je wilt.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        {/* Recently Read Section */}
        {recentlyRead.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 font-heading text-lg font-extrabold text-[var(--color-base-900,#0f172a)] md:text-xl">
              <Clock className="h-5 w-5 text-[var(--color-primary,#7c3aed)]" />
              Verder lezen
            </h2>
            <div className="flex flex-col gap-3">
              {recentlyRead.slice(0, 3).map((item) => (
                <RecentlyReadBanner
                  key={`${item.magazineSlug}-${item.editionIndex}`}
                  magazineSlug={item.magazineSlug}
                  magazineName={item.magazineName}
                  editionIndex={item.editionIndex}
                  editionTitle={item.editionTitle}
                  coverUrl={item.coverUrl}
                  currentPage={item.currentPage}
                  totalPages={item.totalPages}
                />
              ))}
            </div>
          </section>
        )}

        {/* My Magazines Section */}
        {magazines.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 font-heading text-lg font-extrabold text-[var(--color-base-900,#0f172a)] md:text-xl">
              <BookOpen className="h-5 w-5 text-[var(--color-primary,#7c3aed)]" />
              Mijn Tijdschriften
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {magazines.map((magazine) => (
                <Link
                  key={magazine.id}
                  href={`/account/bibliotheek/${magazine.slug}`}
                  className="
                    group flex items-center gap-4 rounded-[14px] border-[1.5px] bg-white p-4
                    no-underline transition-all duration-[250ms]
                    hover:-translate-y-[2px] hover:border-[var(--color-primary,#7c3aed)]
                    hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
                  "
                  style={{ borderColor: 'var(--color-base-200, #e2e8f0)' }}
                >
                  {/* Cover thumbnail */}
                  <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-base-200,#f3f4f6)]">
                    {magazine.coverUrl ? (
                      <img
                        src={magazine.coverUrl}
                        alt={magazine.name}
                        className="h-full w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <BookOpen
                        className="h-6 w-6 text-[var(--color-primary,#7c3aed)]"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-0.5 font-heading text-[15px] font-extrabold text-[var(--color-base-900,#0f172a)]">
                      {magazine.name}
                    </h3>
                    {magazine.tagline && (
                      <p className="mb-1.5 text-[12px] leading-snug text-[var(--color-base-500,#64748b)] line-clamp-1">
                        {magazine.tagline}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-[var(--color-base-500,#64748b)]">
                      <span>
                        {magazine.digitalEditions} digitale{' '}
                        {magazine.digitalEditions === 1 ? 'editie' : 'edities'}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{magazine.totalEditions} totaal</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-base-400,#94a3b8)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-primary,#7c3aed)]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Editions Section */}
        {latestEditions.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2.5 font-heading text-lg font-extrabold text-[var(--color-base-900,#0f172a)] md:text-xl">
                <Sparkles className="h-5 w-5 text-[var(--color-primary,#7c3aed)]" />
                Nieuwste Edities
              </h2>
              <div className="hidden items-center gap-1 md:flex">
                <button
                  onClick={() => scrollLatest('left')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-base-200,#e2e8f0)] bg-white text-[var(--color-base-500,#64748b)] transition-colors hover:border-[var(--color-primary,#7c3aed)] hover:text-[var(--color-primary,#7c3aed)]"
                  aria-label="Scroll naar links"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollLatest('right')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-base-200,#e2e8f0)] bg-white text-[var(--color-base-500,#64748b)] transition-colors hover:border-[var(--color-primary,#7c3aed)] hover:text-[var(--color-primary,#7c3aed)]"
                  aria-label="Scroll naar rechts"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:-mx-0 md:px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {latestEditions.map((edition) => (
                <div
                  key={`${edition.magazineSlug}-${edition.editionIndex}`}
                  className="w-[160px] flex-shrink-0 md:w-[200px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <LibraryEditionCard
                    magazineSlug={edition.magazineSlug}
                    editionIndex={edition.editionIndex}
                    title={edition.title}
                    coverUrl={edition.coverUrl}
                    publishDate={edition.publishDate}
                    isAvailable
                  />
                  <p className="mt-1.5 px-1 text-[11px] text-[var(--color-base-500,#64748b)]">
                    {edition.magazineName}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {magazines.length === 0 && recentlyRead.length === 0 && latestEditions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Library
              className="mb-4 h-16 w-16 text-[var(--color-base-300,#cbd5e1)]"
              strokeWidth={1}
            />
            <h2 className="mb-2 font-heading text-lg font-extrabold text-[var(--color-base-700,#334155)]">
              Je bibliotheek is nog leeg
            </h2>
            <p className="mb-6 max-w-sm text-sm text-[var(--color-base-500,#64748b)]">
              Zodra je een digitaal abonnement hebt, verschijnen je tijdschriften hier.
            </p>
            <Link
              href="/abonnement"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white no-underline transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              Bekijk abonnementen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
