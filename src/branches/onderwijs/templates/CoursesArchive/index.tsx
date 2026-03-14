import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatDuration, formatLevel, calculateDiscount, formatRating } from '@/branches/onderwijs/lib/courseUtils'
import type { CoursesArchiveProps } from './types'

/**
 * CoursesArchiveTemplate - Overzicht van alle cursussen (/cursussen)
 *
 * Layout: Page header met gradient + stats, 2-kolom met filters sidebar + CourseCard grid.
 * Server component die data ontvangt van de page route.
 */

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'gevorderd', label: 'Gevorderd' },
  { value: 'expert', label: 'Expert' },
]

const priceRanges = [
  { label: 'Gratis', min: 0, max: 0 },
  { label: 'Tot \u20ac25', min: 0.01, max: 25 },
  { label: '\u20ac25 - \u20ac50', min: 25, max: 50 },
  { label: '\u20ac50 - \u20ac100', min: 50, max: 100 },
  { label: '\u20ac100+', min: 100, max: 99999 },
]

const ratingOptions = [
  { label: '4+ sterren', value: 4 },
  { label: '3+ sterren', value: 3 },
]

const sortOptions = [
  { value: 'populair', label: 'Populairste' },
  { value: 'nieuwste', label: 'Nieuwste' },
  { value: 'prijs-laag', label: 'Prijs (laag)' },
  { value: 'prijs-hoog', label: 'Prijs (hoog)' },
  { value: 'beoordeling', label: 'Beoordeling' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="h-3.5 w-3.5"
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: star <= Math.round(rating) ? '#f59e0b' : 'var(--color-grey, #e2e8f0)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  )
}

export function CoursesArchiveTemplate({
  courses,
  categories,
  totalPages,
  currentPage,
  totalDocs,
  filters,
}: CoursesArchiveProps) {
  // Build query string helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters?.q) params.set('q', filters.q)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.level) params.set('level', filters.level)
    if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.minRating) params.set('minRating', String(filters.minRating))
    if (filters?.sort) params.set('sort', filters.sort)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    return '/cursussen' + (qs ? '?' + qs : '')
  }

  const buildPriceUrl = (min: number, max: number) => {
    const params = new URLSearchParams()
    if (filters?.q) params.set('q', filters.q)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.level) params.set('level', filters.level)
    if (filters?.minRating) params.set('minRating', String(filters.minRating))
    if (filters?.sort) params.set('sort', filters.sort)

    const isActive = filters?.minPrice === min && filters?.maxPrice === max
    if (!isActive) {
      params.set('minPrice', String(min))
      params.set('maxPrice', String(max))
    }
    params.delete('page')
    const qs = params.toString()
    return '/cursussen' + (qs ? '?' + qs : '')
  }

  const paginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters?.q) params.set('q', filters.q)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.level) params.set('level', filters.level)
    if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.minRating) params.set('minRating', String(filters.minRating))
    if (filters?.sort) params.set('sort', filters.sort)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return '/cursussen' + (qs ? '?' + qs : '')
  }

  const hasActiveFilters =
    filters?.q ||
    filters?.category ||
    filters?.level ||
    filters?.minPrice != null ||
    filters?.maxPrice != null ||
    filters?.minRating

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Cursussen</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Cursussen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek ons cursusaanbod en ontwikkel je vaardigheden met expert-begeleiding.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalDocs}</div>
              <div className="text-sm text-white/60">Cursussen beschikbaar</div>
            </div>
            {categories.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{categories.length}</div>
                <div className="text-sm text-white/60">{categories.length === 1 ? 'Categorie' : 'Categorieën'}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Category filter */}
            {categories.length > 0 && (
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Categorie
                </h3>
                <div className="space-y-2">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={buildFilterUrl('category', filters?.category === cat.slug ? '' : cat.slug)}
                      className="flex items-center justify-between gap-2 text-sm transition-colors"
                      style={{
                        color: filters?.category === cat.slug ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded border"
                          style={{
                            borderColor: filters?.category === cat.slug ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                            backgroundColor: filters?.category === cat.slug ? 'var(--color-primary)' : 'transparent',
                          }}
                        >
                          {filters?.category === cat.slug && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {cat.name}
                      </span>
                      {cat.courseCount > 0 && (
                        <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {cat.courseCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Level filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Niveau
              </h3>
              <div className="space-y-2">
                {levelOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildFilterUrl('level', filters?.level === opt.value ? '' : opt.value)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.level === opt.value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.level === opt.value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.level === opt.value ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.level === opt.value && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Prijsklasse
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => {
                  const isActive = filters?.minPrice === range.min && filters?.maxPrice === range.max
                  return (
                    <Link
                      key={range.label}
                      href={buildPriceUrl(range.min, range.max)}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded border"
                        style={{
                          borderColor: isActive ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        }}
                      >
                        {isActive && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {range.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Rating filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Beoordeling
              </h3>
              <div className="space-y-2">
                {ratingOptions.map((opt) => {
                  const isActive = filters?.minRating === opt.value
                  return (
                    <Link
                      key={opt.value}
                      href={buildFilterUrl('minRating', isActive ? '' : String(opt.value))}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded border"
                        style={{
                          borderColor: isActive ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        }}
                      >
                        {isActive && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {opt.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Link
                href="/cursussen"
                className="flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                  color: 'var(--color-grey-dark, #475569)',
                }}
              >
                Filters wissen
              </Link>
            )}
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Results count + sort */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                {totalDocs} {totalDocs === 1 ? 'cursus' : 'cursussen'} gevonden
              </p>
              <div className="flex items-center gap-2">
                {sortOptions.map((sortOpt) => (
                  <Link
                    key={sortOpt.value}
                    href={buildFilterUrl('sort', sortOpt.value)}
                    className="hidden rounded-lg px-3 py-1.5 text-xs font-medium transition-colors md:block"
                    style={{
                      backgroundColor: filters?.sort === sortOpt.value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                      color: filters?.sort === sortOpt.value ? '#fff' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    {sortOpt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Course grid */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => {
                  const thumbnail = typeof course.thumbnail === 'object' ? course.thumbnail : null
                  const category = typeof course.category === 'object' ? course.category : null
                  const instructor = typeof course.instructor === 'object' ? course.instructor : null
                  const instructorPhoto = instructor && typeof instructor.photo === 'object' ? instructor.photo : null
                  const discount = course.originalPrice && course.price
                    ? calculateDiscount(course.price, course.originalPrice)
                    : 0

                  return (
                    <Link
                      key={course.id}
                      href={`/cursussen/${course.slug}`}
                      className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        {thumbnail?.url ? (
                          <Image
                            src={thumbnail.url}
                            alt={thumbnail.alt || course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}
                          >
                            <svg className="h-12 w-12" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                            </svg>
                          </div>
                        )}
                        {/* Discount badge */}
                        {discount > 0 && (
                          <span
                            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: '#ef4444' }}
                          >
                            -{discount}%
                          </span>
                        )}
                        {/* Bestseller badge */}
                        {course.studentCount > 1000 && (
                          <span
                            className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: '#f59e0b' }}
                          >
                            Bestseller
                          </span>
                        )}
                        {/* Level badge */}
                        {course.level && (
                          <span
                            className="absolute bottom-3 left-3 rounded px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: '#ffffff',
                            }}
                          >
                            {formatLevel(course.level)}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Category */}
                        {category && (
                          <div className="mb-1 text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                            {category.name}
                          </div>
                        )}

                        {/* Title */}
                        <h3
                          className="mb-2 line-clamp-2 text-base font-semibold leading-tight"
                          style={{
                            color: 'var(--color-navy, #1a2b4a)',
                            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                          }}
                        >
                          {course.title}
                        </h3>

                        {/* Instructor */}
                        {instructor && (
                          <div className="mb-3 flex items-center gap-2">
                            {instructorPhoto?.url ? (
                              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                                <Image
                                  src={instructorPhoto.url}
                                  alt={instructor.name || ''}
                                  fill
                                  className="object-cover"
                                  sizes="24px"
                                />
                              </div>
                            ) : (
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                              >
                                {(instructor.name || '?')[0]}
                              </div>
                            )}
                            <span className="text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                              {instructor.name || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim()}
                            </span>
                          </div>
                        )}

                        {/* Meta: rating, students, duration */}
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {course.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <StarRating rating={course.rating} />
                              <span className="font-semibold" style={{ color: '#f59e0b' }}>{formatRating(course.rating)}</span>
                              {course.reviewCount > 0 && (
                                <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>({course.reviewCount})</span>
                              )}
                            </span>
                          )}
                          {course.studentCount > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                              </svg>
                              {course.studentCount.toLocaleString('nl-NL')}
                            </span>
                          )}
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatDuration(course.duration)}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-between border-t pt-3" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                          <div>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                {formatPrice(course.originalPrice)}
                              </span>
                            )}
                            <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                              {formatPrice(course.price)}
                            </div>
                          </div>
                          <span
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity group-hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Bekijk cursus
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div
                className="rounded-xl border p-12 text-center"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <svg
                  className="mx-auto mb-4 h-16 w-16"
                  style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Geen cursussen gevonden
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  Pas je filters aan of bekijk al onze cursussen.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/cursussen"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Alle cursussen bekijken
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={paginationUrl(currentPage - 1)}
                    className="flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                      color: 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    Vorige
                  </Link>
                )}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link
                    key={i}
                    href={paginationUrl(i + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: currentPage === i + 1 ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                      color: currentPage === i + 1 ? '#fff' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    {i + 1}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={paginationUrl(currentPage + 1)}
                    className="flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                      color: 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    Volgende
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Niet gevonden wat je zoekt?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Neem contact met ons op voor advies over welke cursus het beste bij jouw leerdoelen past.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            Neem contact op
          </Link>
        </section>
      </div>
    </div>
  )
}

export default CoursesArchiveTemplate
