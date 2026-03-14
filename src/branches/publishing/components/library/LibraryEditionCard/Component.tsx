import React from 'react'
import Link from 'next/link'
import { BookOpen, FileText, Calendar } from 'lucide-react'
import type { LibraryEditionCardProps } from './types'

export const LibraryEditionCard: React.FC<LibraryEditionCardProps> = ({
  magazineSlug,
  editionIndex,
  title,
  issueNumber,
  year,
  coverUrl,
  pageCount,
  publishDate,
  isAvailable = true,
  progress,
  className = '',
}) => {
  const hasProgress = typeof progress === 'number' && progress > 0 && progress < 100
  const isCompleted = typeof progress === 'number' && progress >= 100
  const href = `/account/bibliotheek/${magazineSlug}/${editionIndex}`

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const cardContent = (
    <>
      {/* Cover image */}
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-t-[13px] bg-[var(--color-base-200,#f3f4f6)]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full rounded-t-[13px] object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpen className="h-10 w-10 text-[var(--color-primary,#7c3aed)]" strokeWidth={1.5} />
        )}

        {/* Page count badge */}
        {pageCount && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
            <FileText className="h-2.5 w-2.5" />
            {pageCount} pag.
          </span>
        )}

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center rounded-t-[13px] bg-black/40">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[var(--color-base-800,#1e293b)]">
              <Calendar className="h-3 w-3" />
              {formattedDate || 'Binnenkort'}
            </span>
          </div>
        )}

        {/* Completed badge */}
        {isCompleted && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Gelezen
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="mb-0.5 font-heading text-[13px] font-extrabold leading-snug text-[var(--color-base-900,#0f172a)] line-clamp-2">
          {title}
        </h3>

        <div className="mb-2 flex items-center gap-2 text-[11px] text-[var(--color-base-500,#64748b)]">
          {issueNumber && <span>Nr. {issueNumber}</span>}
          {issueNumber && year && <span aria-hidden="true">&middot;</span>}
          {year && <span>{year}</span>}
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div className="mb-2 mt-auto">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-medium text-[var(--color-base-500,#64748b)]">
                Voortgang
              </span>
              <span className="text-[10px] font-bold text-[var(--color-primary,#7c3aed)]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-base-200,#e2e8f0)]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-1">
          {isAvailable ? (
            <span
              className="inline-flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-[12px] font-bold text-white transition-opacity group-hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              {hasProgress ? 'Verder lezen' : isCompleted ? 'Opnieuw lezen' : 'Lezen'}
            </span>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-base-300,#d1d5db)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-base-400,#94a3b8)]">
              Binnenkort beschikbaar
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (!isAvailable) {
    return (
      <div
        className={`
          flex flex-col overflow-hidden rounded-[14px] border-[1.5px] bg-white opacity-75
          ${className}
        `}
        style={{ borderColor: 'var(--color-base-200, #e2e8f0)' }}
      >
        {cardContent}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`
        group flex flex-col overflow-hidden rounded-[14px] border-[1.5px] bg-white
        no-underline transition-all duration-[250ms]
        hover:-translate-y-[3px] hover:border-[var(--color-primary,#7c3aed)]
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
        ${className}
      `}
      style={{ borderColor: 'var(--color-base-200, #e2e8f0)' }}
      aria-label={`${title}${issueNumber ? ` — Nr. ${issueNumber}` : ''} ${hasProgress ? `(${Math.round(progress)}% gelezen)` : ''}`}
    >
      {cardContent}
    </Link>
  )
}
