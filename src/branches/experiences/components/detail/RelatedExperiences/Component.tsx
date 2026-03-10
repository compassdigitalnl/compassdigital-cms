import React from 'react'
import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'
import type { RelatedExperiencesProps, RelatedExperience } from './types'

export const RelatedExperiences: React.FC<RelatedExperiencesProps> = ({
  title = 'Combineer dit uitje met',
  experiences,
  className = '',
}) => {
  if (experiences.length === 0) return null

  return (
    <section className={className}>
      <h3
        className="mb-2.5 text-base"
        style={{
          color: 'var(--color-navy, #1a2b4a)',
          fontFamily: 'var(--font-serif, Georgia, serif)',
        }}
      >
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {experiences.map((exp) => (
          <RelatedCard key={exp.slug} experience={exp} />
        ))}
      </div>
    </section>
  )
}

const RelatedCard: React.FC<{ experience: RelatedExperience }> = ({
  experience,
}) => {
  const {
    title,
    slug,
    category,
    thumbnail,
    duration,
    personRange,
    rating,
    pricePerPerson,
  } = experience

  return (
    <Link
      href={`/ervaringen/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-white no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="h-[80px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex h-[80px] w-full items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, var(--color-grey-light, #f3f4f6), var(--color-teal-light, #e6f7f6))',
          }}
        >
          <span className="text-2xl opacity-40">&#127919;</span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category */}
        {category && (
          <span
            className="mb-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-teal, #00a39b)' }}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h4
          className="mb-1.5 line-clamp-2 text-xs font-bold leading-snug"
          style={{ color: 'var(--color-navy, #1a2b4a)' }}
        >
          {title}
        </h4>

        {/* Meta row */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
          {duration && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
          )}
          {personRange && (
            <span className="inline-flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {personRange}
            </span>
          )}
          {rating !== undefined && rating > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Star
                className="h-3 w-3"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth={1.5}
              />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-1 border-t border-gray-100 pt-2">
          <span
            className="text-sm font-bold"
            style={{ color: 'var(--color-navy, #1a2b4a)' }}
          >
            &euro;{pricePerPerson.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-gray-400">p.p.</span>
        </div>
      </div>
    </Link>
  )
}
