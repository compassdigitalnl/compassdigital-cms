'use client'

import React from 'react'
import { getIcon } from '@/utilities/getIcon'
import { CheckCircle2 } from 'lucide-react'
import type { ProjectTimelineProps } from './types'

/**
 * ProjectTimeline — Vertical timeline showing project phases.
 *
 * Each phase shows an icon, title, description and optional duration.
 * Connected with a vertical line. All colors use CSS theme variables.
 */

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  phases,
  title,
  className = '',
}) => {
  if (!phases || phases.length === 0) return null

  return (
    <div className={className}>
      {title && (
        <h3
          className="mb-6 font-display text-xl font-bold"
          style={{ color: 'var(--navy)' }}
        >
          {title}
        </h3>
      )}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-5 top-0 h-full w-0.5"
          style={{ backgroundColor: 'var(--grey)' }}
        />

        <div className="space-y-6">
          {phases.map((phase, i) => {
            const isLast = i === phases.length - 1
            const IconComponent = phase.icon
              ? getIcon(phase.icon, CheckCircle2)
              : CheckCircle2

            return (
              <div key={i} className="relative flex gap-4 pl-0">
                {/* Icon dot */}
                <div
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: isLast ? 'var(--gradient-primary)' : 'var(--white)',
                    border: isLast ? 'none' : '2px solid var(--teal)',
                    boxShadow: 'var(--sh-sm)',
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: isLast ? 'white' : 'var(--teal)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline gap-3">
                    <h4
                      className="text-sm font-bold"
                      style={{ color: 'var(--navy)' }}
                    >
                      {phase.title}
                    </h4>
                    {phase.duration && (
                      <span
                        className="text-xs font-medium"
                        style={{ color: 'var(--grey-mid)' }}
                      >
                        {phase.duration}
                      </span>
                    )}
                  </div>
                  {phase.description && (
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{ color: 'var(--grey-dark)' }}
                    >
                      {phase.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProjectTimeline
