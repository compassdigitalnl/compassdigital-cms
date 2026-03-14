import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatRating } from '@/branches/onderwijs/lib/courseUtils'
import type { DocentenArchiveProps } from './types'

/**
 * DocentenArchiveTemplate - Overzicht van alle docenten (/docenten)
 *
 * Server component. Grid van InstructorCard components.
 * Fetcht content-team where branch: 'onderwijs'.
 */

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

export function DocentenArchiveTemplate({ team }: DocentenArchiveProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Docenten</span>
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
            Onze docenten
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Leer van ervaren professionals. Onze docenten zijn experts in hun vakgebied en delen hun kennis met passie.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{team.length}</div>
              <div className="text-sm text-white/60">{team.length === 1 ? 'Docent' : 'Docenten'}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {team.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member: any) => {
              const photo = typeof member.photo === 'object' ? member.photo : null
              return (
                <div
                  key={member.id}
                  className="overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {photo?.url ? (
                      <Image
                        src={photo.url}
                        alt={photo.alt || member.name || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}
                      >
                        <svg className="h-16 w-16" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        color: 'var(--color-navy, #1a2b4a)',
                        fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                      }}
                    >
                      {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
                    </h3>
                    {member.role && (
                      <p className="mt-1 text-sm font-medium" style={{ color: '#2563EB' }}>
                        {member.role}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      {member.avgRating > 0 && (
                        <span className="flex items-center gap-1">
                          <StarRating rating={member.avgRating} />
                          <span className="font-semibold" style={{ color: '#f59e0b' }}>{formatRating(member.avgRating)}</span>
                        </span>
                      )}
                      {member.totalStudents > 0 && (
                        <span>{member.totalStudents.toLocaleString('nl-NL')} studenten</span>
                      )}
                      {member.courseCount > 0 && (
                        <span>{member.courseCount} {member.courseCount === 1 ? 'cursus' : 'cursussen'}</span>
                      )}
                    </div>

                    {/* Bio */}
                    {member.shortDescription && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        {member.shortDescription}
                      </p>
                    )}

                    {/* Certifications */}
                    {member.certifications && member.certifications.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {member.certifications.slice(0, 3).map((cert: any, i: number) => (
                          <span
                            key={i}
                            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: 'rgba(37, 99, 235, 0.08)',
                              color: '#2563EB',
                            }}
                          >
                            {typeof cert === 'string' ? cert : cert.text || cert.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
              Nog geen docenten
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
              Er zijn nog geen docenten beschikbaar. Neem contact met ons op voor meer informatie.
            </p>
          </div>
        )}

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Word docent bij ons
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Ben je expert in jouw vakgebied en wil je je kennis delen? Neem contact met ons op om meer te weten te komen over het geven van cursussen.
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

export default DocentenArchiveTemplate
