import React from 'react'
import type { LearningOutcomesProps } from './types'

export const LearningOutcomes: React.FC<LearningOutcomesProps> = ({
  outcomes,
  className = '',
}) => {
  if (!outcomes || outcomes.length === 0) return null

  return (
    <div
      className={`rounded-xl border border-teal-100 bg-teal-50/50 p-6 md:p-8 ${className}`}
    >
      <h2 className="mb-5 flex items-center gap-2.5 text-xl font-extrabold text-[var(--color-base-1000)]">
        <svg
          className="h-6 w-6 text-[var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Wat leer je?
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {outcomes.map((outcome, index) => (
          <div
            key={index}
            className="flex gap-3 rounded-lg bg-white/60 p-3"
          >
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-3 w-3 text-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[13px] leading-relaxed text-[var(--color-base-800)]">
              {outcome}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
