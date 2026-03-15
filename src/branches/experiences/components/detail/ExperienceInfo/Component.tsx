import React from 'react'
import { Star, Clock, Users, MapPin, CalendarCheck, Lightbulb, Check } from 'lucide-react'
import type { ExperienceInfoProps } from './types'

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  clock: Clock,
  users: Users,
  'map-pin': MapPin,
  calendar: CalendarCheck,
}

const resolveMetaIcon = (name?: string) => {
  if (!name) return null
  return iconMap[name.toLowerCase()] || null
}

export const ExperienceInfo: React.FC<ExperienceInfoProps> = ({
  category,
  categoryIcon,
  title,
  rating,
  reviewCount,
  topReview,
  duration,
  personRange,
  location,
  availability,
  description,
  included,
  tip,
  className = '',
}) => {
  const metaItems = [
    { icon: 'clock', label: 'Duur', value: duration },
    { icon: 'users', label: 'Personen', value: personRange },
    { icon: 'map-pin', label: 'Locatie', value: location },
    { icon: 'calendar', label: 'Beschikbaar', value: availability },
  ].filter((item) => item.value)

  return (
    <div className={`rounded-2xl border bg-white p-6 md:p-8 ${className}`} style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
      {/* Category badge */}
      {category && (
        <span
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
        >
          {categoryIcon && <span className="text-sm">{categoryIcon}</span>}
          {category}
        </span>
      )}

      {/* Title */}
      <h1
        className="mb-4 font-serif text-2xl font-bold md:text-3xl"
        style={{ color: 'var(--color-navy, #1a2b4a)' }}
      >
        {title}
      </h1>

      {/* Rating row */}
      {rating !== undefined && rating > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold text-white"
            style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
          >
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < Math.round(rating / 2) ? '#f59e0b' : 'none'}
                stroke={i < Math.round(rating / 2) ? '#f59e0b' : '#d1d5db'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          {reviewCount !== undefined && reviewCount > 0 && (
            <span className="text-sm text-grey-mid">
              {reviewCount} beoordelingen
            </span>
          )}
          {topReview && (
            <span className="text-sm italic text-grey-mid">
              &ldquo;{topReview}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Meta row: 4-column grid */}
      {metaItems.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {metaItems.map((item) => {
            const Icon = resolveMetaIcon(item.icon)
            return (
              <div key={item.icon} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-teal-light, #e6f7f6)' }}
                >
                  {Icon && (
                    <Icon
                      className="h-5 w-5"
                      style={{ color: 'var(--color-teal, #00a39b)' } as React.CSSProperties}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-grey-mid">
                    {item.label}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mb-6">
          <p className="text-[15px] leading-relaxed text-grey-dark">{description}</p>
        </div>
      )}

      {/* Included items */}
      {included && included.length > 0 && (
        <div className="mb-6">
          <h3
            className="mb-3 text-base font-bold"
            style={{ color: 'var(--color-navy, #1a2b4a)' }}
          >
            Wat is inbegrepen?
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {included.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-teal-light, #e6f7f6)' }}
                >
                  {item.icon ? (
                    <span className="text-xs">{item.icon}</span>
                  ) : (
                    <Check
                      className="h-3.5 w-3.5"
                      style={{ color: 'var(--color-teal, #00a39b)' } as React.CSSProperties}
                    />
                  )}
                </div>
                <span className="text-sm text-grey-dark">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip box */}
      {tip && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-800">{tip.title}</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-700">{tip.content}</p>
        </div>
      )}
    </div>
  )
}
