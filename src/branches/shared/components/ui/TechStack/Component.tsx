'use client'

import React from 'react'
import { getIcon } from '@/utilities/getIcon'
import { Code2 } from 'lucide-react'
import type { TechStackProps } from './types'

/**
 * TechStack — Technology/skill pills with dynamic Lucide icons.
 *
 * Displays the tech stack used in a project as a grid of pills or cards.
 * All colors use CSS theme variables via Tailwind mappings.
 */

const categoryStyles: Record<string, string> = {
  frontend: 'border-blue/30 bg-blue/5',
  backend: 'border-purple/30 bg-purple/5',
  platform: 'border-teal/30 bg-teal/5',
  integration: 'border-amber/30 bg-amber/5',
  design: 'border-coral/30 bg-coral/5',
}

const categoryIconColors: Record<string, string> = {
  frontend: 'text-blue',
  backend: 'text-purple',
  platform: 'text-teal',
  integration: 'text-amber',
  design: 'text-coral',
}

export const TechStack: React.FC<TechStackProps> = ({
  technologies,
  title,
  variant = 'pills',
  className = '',
}) => {
  if (!technologies || technologies.length === 0) return null

  return (
    <div className={className}>
      {title && (
        <h3
          className="mb-4 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--grey-dark)' }}
        >
          {title}
        </h3>
      )}
      <div className={`flex flex-wrap ${variant === 'cards' ? 'gap-3' : 'gap-2'}`}>
        {technologies.map((tech, i) => {
          const IconComponent = tech.icon ? getIcon(tech.icon, Code2) : Code2
          const cat = tech.category || 'platform'
          const borderBg = categoryStyles[cat] || categoryStyles.platform
          const iconColor = categoryIconColors[cat] || categoryIconColors.platform

          if (variant === 'cards') {
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 transition-shadow hover:shadow-sm ${borderBg}`}
                style={{ borderRadius: 'var(--r-sm)' }}
              >
                {IconComponent && <IconComponent className={`h-4 w-4 ${iconColor}`} />}
                <span className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
                  {tech.name}
                </span>
              </div>
            )
          }

          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold ${borderBg}`}
              style={{ borderRadius: 'var(--r-full)', color: 'var(--navy)' }}
            >
              {IconComponent && <IconComponent className={`h-3 w-3 ${iconColor}`} />}
              {tech.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default TechStack
