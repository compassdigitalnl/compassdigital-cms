import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  formatPrice,
  formatDuration,
  formatLevel,
  calculateDiscount,
  formatLessonType,
  formatRating,
} from '@/branches/onderwijs/lib/courseUtils'
import type { CourseDetailProps } from './types'

/**
 * CourseDetailTemplate - Detail pagina voor een cursus (/cursussen/[slug])
 *
 * Async server component. Breadcrumbs, cursus header, 2-kolom layout:
 * Links: InstructorCard, LearningOutcomes, CurriculumSections, beschrijving, reviews
 * Rechts: sticky EnrollmentSidebar
 * Onderaan: gerelateerde cursussen
 */

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={sizeClass}
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

function LessonTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'video':
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
      )
    case 'reading':
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    case 'quiz':
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      )
    case 'assignment':
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    default:
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
  }
}

export async function CourseDetailTemplate({ course }: CourseDetailProps) {
  const payload = await getPayload({ config })

  // Fetch reviews for this course
  let reviews: any[] = []
  try {
    const reviewsResult = await payload.find({
      collection: 'content-reviews',
      where: {
        and: [
          { branch: { equals: 'onderwijs' } },
          { course: { equals: course.id } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 10,
      sort: '-createdAt',
    })
    reviews = reviewsResult.docs
  } catch (e) {
    /* fail silently */
  }

  // Fetch related courses (same category, different slug)
  let relatedCourses: any[] = []
  try {
    const categoryId = typeof course.category === 'object' ? course.category?.id : course.category
    const result = await payload.find({
      collection: 'courses',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: course.id } },
          ...(categoryId ? [{ category: { equals: categoryId } }] : []),
        ],
      },
      limit: 3,
      sort: '-studentCount',
    })
    relatedCourses = result.docs
  } catch (e) {
    /* fail silently */
  }

  // Extract data
  const thumbnail = typeof course.thumbnail === 'object' ? course.thumbnail : null
  const category = typeof course.category === 'object' ? course.category : null
  const instructor = typeof course.instructor === 'object' ? course.instructor : null
  const instructorPhoto = instructor && typeof instructor.photo === 'object' ? instructor.photo : null
  const discount = course.originalPrice && course.price
    ? calculateDiscount(course.price, course.originalPrice)
    : 0
  const sections = course.sections || []
  const learningOutcomes = course.learningOutcomes || []
  const requirements = course.requirements || []
  const includes = course.includes || []

  // Calculate total lessons count across all sections
  const totalLessonsCount = sections.reduce((total: number, section: any) => {
    return total + (section.lessons?.length || 0)
  }, 0)

  // Calculate review breakdown
  const reviewBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => Math.round(r.rating) === star).length,
    percentage: reviews.length > 0
      ? Math.round((reviews.filter((r: any) => Math.round(r.rating) === star).length / reviews.length) * 100)
      : 0,
  }))

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/cursussen" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Cursussen
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/cursussen?category=${encodeURIComponent(category.slug)}`}
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>{course.title}</span>
        </nav>
      </div>

      {/* Course Header */}
      <section
        className="py-8 md:py-12"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            {category && (
              <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                {category.name}
              </span>
            )}
            <h1
              className="text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
            >
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="mt-3 text-lg text-white/80">{course.subtitle}</p>
            )}
            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {course.rating > 0 && (
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-yellow-300">{formatRating(course.rating)}</span>
                  <StarRating rating={course.rating} />
                  {course.reviewCount > 0 && (
                    <span className="text-white/60">({course.reviewCount} reviews)</span>
                  )}
                </span>
              )}
              {course.studentCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  {course.studentCount.toLocaleString('nl-NL')} studenten
                </span>
              )}
              {course.duration && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(course.duration)}
                </span>
              )}
              {course.level && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  {formatLevel(course.level)}
                </span>
              )}
              {course.lastUpdated && (
                <span className="text-white/60">
                  Bijgewerkt {new Date(course.lastUpdated).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Instructor Card */}
            {instructor && (
              <div
                className="flex items-start gap-4 rounded-xl border p-5"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                {instructorPhoto?.url ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image src={instructorPhoto.url} alt={instructor.name || ''} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {(instructor.name || '?')[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>Docent</div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {instructor.name || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim()}
                  </h3>
                  {instructor.role && (
                    <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>{instructor.role}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    {instructor.avgRating > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        {formatRating(instructor.avgRating)} beoordeling
                      </span>
                    )}
                    {instructor.totalStudents > 0 && (
                      <span>{instructor.totalStudents.toLocaleString('nl-NL')} studenten</span>
                    )}
                    {instructor.courseCount > 0 && (
                      <span>{instructor.courseCount} cursussen</span>
                    )}
                  </div>
                  {instructor.shortDescription && (
                    <p className="mt-2 line-clamp-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      {instructor.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Learning Outcomes */}
            {learningOutcomes.length > 0 && (
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Wat leer je?
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {learningOutcomes.map((outcome: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ color: '#22c55e' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        {outcome.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Sections */}
            {sections.length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Curriculum
                </h2>
                <p className="mb-4 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  {sections.length} {sections.length === 1 ? 'sectie' : 'secties'} &middot; {totalLessonsCount} lessen
                  {course.duration ? ` \u00b7 ${formatDuration(course.duration)} totaal` : ''}
                </p>
                <div className="space-y-2">
                  {sections.map((section: any, sIdx: number) => {
                    const sectionLessons = section.lessons || []
                    return (
                      <details
                        key={sIdx}
                        className="group rounded-xl border overflow-hidden"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}
                        {...(sIdx === 0 ? { open: true } : {})}
                      >
                        <summary
                          className="flex cursor-pointer items-center justify-between p-4"
                          style={{ backgroundColor: 'var(--color-grey-light, #f8fafc)' }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                              {section.sectionNumber || sIdx + 1}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                              {section.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                              {sectionLessons.length} {sectionLessons.length === 1 ? 'les' : 'lessen'}
                            </span>
                            <svg
                              className="h-4 w-4 transition-transform group-open:rotate-180"
                              style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </summary>
                        <div style={{ backgroundColor: 'var(--color-white, #ffffff)' }}>
                          {sectionLessons.map((lesson: any, lIdx: number) => {
                            const lessonInfo = formatLessonType(lesson.type || 'video')
                            return (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between border-t px-4 py-3"
                                style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}
                              >
                                <div className="flex items-center gap-3">
                                  <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                    <LessonTypeIcon type={lesson.type || 'video'} />
                                  </span>
                                  <span className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <span
                                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                                      style={{
                                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                        color: '#2563EB',
                                      }}
                                    >
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                  <span>{lessonInfo.label}</span>
                                  {lesson.duration && <span>{lesson.duration}</span>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </details>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {course.shortDescription && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Over deze cursus
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {course.shortDescription}
                </p>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Vereisten
                </h2>
                <ul className="space-y-2">
                  {requirements.map((req: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            {(reviews.length > 0 || (course.rating && course.rating > 0)) && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Beoordelingen
                </h2>

                {/* Review breakdown */}
                <div
                  className="mb-6 flex flex-col gap-6 rounded-xl border p-6 md:flex-row md:items-center"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: '#f59e0b' }}>
                      {formatRating(course.rating || 0)}
                    </div>
                    <StarRating rating={course.rating || 0} size="md" />
                    <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      {course.reviewCount || reviews.length} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {reviewBreakdown.map((item) => (
                      <div key={item.star} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-right text-xs font-medium" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {item.star}
                        </span>
                        <svg className="h-3.5 w-3.5 shrink-0" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.percentage}%`, backgroundColor: '#f59e0b' }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual reviews */}
                {reviews.length > 0 && (
                  <div className="space-y-4">
                    {reviews.map((review: any) => {
                      const photo = typeof review.authorPhoto === 'object' ? review.authorPhoto : null
                      return (
                        <div
                          key={review.id}
                          className="rounded-xl border p-5"
                          style={{
                            borderColor: 'var(--color-grey, #e2e8f0)',
                            backgroundColor: 'var(--color-white, #ffffff)',
                          }}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            {photo?.url ? (
                              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                <Image src={photo.url} alt={review.authorName || ''} fill className="object-cover" sizes="40px" />
                              </div>
                            ) : (
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                              >
                                {(review.authorName || '?')[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                                  {review.authorName}
                                </span>
                                {review.verified && (
                                  <span
                                    className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
                                  >
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Geverifieerd
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRating rating={review.rating} />
                                {review.createdAt && (
                                  <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                    {new Date(review.createdAt).toLocaleDateString('nl-NL')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                            {review.quote}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: Enrollment sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Course preview / price card */}
            <div
              className="overflow-hidden rounded-xl border"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {/* Thumbnail */}
              {thumbnail?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={thumbnail.url}
                    alt={thumbnail.alt || course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Price */}
                <div className="mb-4">
                  {course.originalPrice && course.originalPrice > course.price ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                          {formatPrice(course.price)}
                        </span>
                        <span className="text-lg line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {formatPrice(course.originalPrice)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: '#ef4444' }}>
                          {discount}% korting
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(course.price)}
                    </div>
                  )}
                  {course.discountEndsAt && new Date(course.discountEndsAt) > new Date() && (
                    <div className="mt-2 rounded-lg p-2 text-center text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                      Aanbieding verloopt op {new Date(course.discountEndsAt).toLocaleDateString('nl-NL')}
                    </div>
                  )}
                </div>

                {/* Enroll CTA */}
                <div className="space-y-2">
                  <Link
                    href={`/cursussen/${course.slug}/inschrijven`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                    </svg>
                    Nu inschrijven
                  </Link>
                </div>

                {/* Quick info */}
                <div className="mt-4 space-y-2">
                  {course.duration && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Duur</span>
                      <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {formatDuration(course.duration)}
                      </span>
                    </div>
                  )}
                  {course.totalLessons && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Lessen</span>
                      <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {course.totalLessons}
                      </span>
                    </div>
                  )}
                  {course.level && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Niveau</span>
                      <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {formatLevel(course.level)}
                      </span>
                    </div>
                  )}
                  {course.language && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Taal</span>
                      <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {course.language === 'nederlands' ? 'Nederlands' : 'Engels'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Includes list */}
                {includes.length > 0 && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                    <h4 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Wat krijg je?
                    </h4>
                    <ul className="space-y-1.5">
                      {includes.map((item: any, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Onze garanties
              </h3>
              <ul className="space-y-2">
                {[
                  '30 dagen niet-goed-geld-terug',
                  'Levenslang toegang',
                  course.certificate ? 'Certificaat bij voltooiing' : null,
                  'Toegang op desktop en mobiel',
                ].filter(Boolean).map((guarantee) => (
                  <li key={guarantee!} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    {guarantee}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Vergelijkbare cursussen
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((relCourse) => {
                const relThumbnail = typeof relCourse.thumbnail === 'object' ? relCourse.thumbnail : null
                const relCategory = typeof relCourse.category === 'object' ? relCourse.category : null
                return (
                  <Link
                    key={relCourse.id}
                    href={`/cursussen/${relCourse.slug}`}
                    className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                    style={{
                      borderColor: 'var(--color-grey, #e2e8f0)',
                      backgroundColor: 'var(--color-white, #ffffff)',
                    }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {relThumbnail?.url ? (
                        <Image
                          src={relThumbnail.url}
                          alt={relThumbnail.alt || relCourse.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}>
                          <svg className="h-12 w-12" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {relCategory && (
                        <div className="mb-1 text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{relCategory.name}</div>
                      )}
                      <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {relCourse.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        {relCourse.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs">
                            <StarRating rating={relCourse.rating} />
                            <span style={{ color: '#f59e0b' }}>{formatRating(relCourse.rating)}</span>
                          </span>
                        )}
                      </div>
                      {relCourse.price != null && (
                        <div className="mt-2 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                          {formatPrice(relCourse.price)}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetailTemplate
