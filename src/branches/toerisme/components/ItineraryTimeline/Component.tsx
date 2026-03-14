import React from 'react'
import type { ItineraryTimelineProps } from './types'

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  days,
  className = '',
}) => {
  if (!days || days.length === 0) return null

  return (
    <div className={`${className}`}>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-[var(--color-base-200)] md:left-8" />

        <div className="space-y-6">
          {days.map((day, index) => (
            <div key={index} className="relative flex gap-4 md:gap-6">
              {/* Day number circle */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white md:h-16 md:w-16 md:text-base"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Dag {day.dayNumber}
              </div>

              {/* Content card */}
              <div className="flex-1 rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-4 shadow-sm md:p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-[var(--color-base-1000)] md:text-lg">
                    {day.title}
                  </h4>
                  {day.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {day.location}
                    </span>
                  )}
                </div>

                {/* Description — render as plain text if string, or note about richText */}
                {day.description && (
                  <div className="prose prose-sm max-w-none text-[var(--color-base-600)]">
                    {typeof day.description === 'string' ? (
                      <p>{day.description}</p>
                    ) : (
                      <p className="text-sm text-[var(--color-base-500)] italic">
                        Beschrijving beschikbaar op de detailpagina
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
