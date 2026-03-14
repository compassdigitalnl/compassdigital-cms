'use client'

import React, { useState } from 'react'
import type { CurriculumSectionProps } from './types'
import { formatLessonType } from '../../lib/courseUtils'

const LessonTypeIcon: React.FC<{ type: string; className?: string }> = ({
  type,
  className = '',
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    video: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    reading: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    quiz: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    assignment: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
  }

  return <>{iconMap[type] || iconMap.video}</>
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  sections,
  defaultOpenIndex = 0,
}) => {
  const [openSections, setOpenSections] = useState<Set<number>>(
    new Set(defaultOpenIndex >= 0 ? [defaultOpenIndex] : []),
  )

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (!sections || sections.length === 0) return null

  // Calculate total stats
  const totalLessons = sections.reduce(
    (sum, section) => sum + (section.lessons?.length ?? 0),
    0,
  )

  return (
    <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-[var(--color-base-1000)]">
          <svg
            className="h-6 w-6 text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          Curriculum
        </h2>
        <div className="flex gap-4 text-xs text-[var(--color-base-500)]">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            {sections.length} secties
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {totalLessons} lessen
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isOpen = openSections.has(index)
          const lessonCount = section.lessons?.length ?? 0

          return (
            <div
              key={section.id || index}
              className="overflow-hidden rounded-lg border border-[var(--color-base-200)]"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(index)}
                className="flex w-full items-center justify-between bg-[var(--color-base-50)] px-5 py-4 text-left transition-colors hover:bg-[var(--color-base-100)]"
              >
                <div className="flex-1">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-base-400)]">
                    Sectie {section.sectionNumber ?? index + 1}
                  </div>
                  <div className="text-sm font-bold text-[var(--color-base-1000)]">
                    {section.title}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[var(--color-base-400)]">
                    {lessonCount} {lessonCount === 1 ? 'les' : 'lessen'}
                  </span>
                  <svg
                    className={`h-5 w-5 text-[var(--color-base-400)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {/* Lessons */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
              >
                {section.lessons?.map((lesson, lessonIndex) => {
                  const lessonType = lesson.type || 'video'
                  const { label } = formatLessonType(lessonType)
                  const isVideo = lessonType === 'video'

                  return (
                    <div
                      key={lesson.id || lessonIndex}
                      className="flex items-center gap-3 border-t border-[var(--color-base-100)] px-5 py-3 transition-colors hover:bg-[var(--color-base-50)]"
                    >
                      {/* Lesson type icon */}
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${
                          isVideo
                            ? 'bg-[var(--color-primary)]/10'
                            : 'bg-[var(--color-base-100)]'
                        }`}
                      >
                        <LessonTypeIcon
                          type={lessonType}
                          className={`h-4 w-4 ${
                            isVideo
                              ? 'text-[var(--color-primary)]'
                              : 'text-[var(--color-base-400)]'
                          }`}
                        />
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1">
                        <div className="text-[13px] text-[var(--color-base-1000)]">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] text-[var(--color-base-400)]">{label}</div>
                      </div>

                      {/* Preview badge */}
                      {lesson.isPreview && (
                        <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          Preview
                        </span>
                      )}

                      {/* Duration */}
                      {lesson.duration && (
                        <span className="font-mono text-[11px] text-[var(--color-base-400)]">
                          {lesson.duration}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
