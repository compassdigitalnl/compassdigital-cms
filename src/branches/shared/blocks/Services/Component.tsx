'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { ServicesBlock } from '@/payload-types'

/**
 * B07 - Services Block Component (Client)
 *
 * Service grid with dynamic Lucide icons, color themes, and optional links.
 */

// Icon color mapping (Tailwind classes)
const iconColorMap = {
  teal: { bg: 'bg-teal-glow', color: 'text-teal' },
  blue: { bg: 'bg-blue-light', color: 'text-blue' },
  green: { bg: 'bg-green-light', color: 'text-green' },
  purple: { bg: 'bg-purple-light', color: 'text-purple' },
  amber: { bg: 'bg-amber-light', color: 'text-amber' },
  coral: { bg: 'bg-coral-light', color: 'text-coral' },
} as const

export const ServicesBlockComponent: React.FC<ServicesBlock> = ({
  subtitle,
  title,
  description,
  columns = '3',
  services,
}) => {
  // Get Lucide icon component (fallback to Package)
  const resolveIcon = (iconName: string) => {
    return getIcon(iconName, Package)!
  }

  // Grid column classes
  const gridClass = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header (conditional) */}
        {(title || subtitle || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            {subtitle && (
              <div className="text-xs font-bold uppercase tracking-wider text-teal mb-2">
                {subtitle}
              </div>
            )}
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl text-navy mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base text-grey-dark leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Services Grid */}
        <div className={`grid gap-5 ${gridClass}`}>
          {services?.map((service, index) => {
            const Icon = resolveIcon(service.icon)
            const colorTheme = iconColorMap[service.iconColor as keyof typeof iconColorMap] || iconColorMap.teal

            return (
              <div
                key={service.id || index}
                className={`
                  group
                  bg-white
                  border border-grey
                  rounded-xl
                  p-6
                  transition-all
                  duration-200
                  hover:shadow-md
                  hover:-translate-y-1
                  ${service.link ? 'cursor-pointer' : ''}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                    mb-4
                    ${colorTheme.bg}
                  `}
                >
                  <Icon className={`w-6 h-6 ${colorTheme.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-navy mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-grey-dark leading-relaxed mb-3">
                  {service.description}
                </p>

                {/* Link (conditional) */}
                {service.link && (
                  <Link
                    href={service.link}
                    className={`
                      inline-flex items-center
                      gap-1
                      text-sm font-semibold
                      transition-all
                      group-hover:gap-2
                      ${colorTheme.color}
                    `}
                  >
                    {service.linkText || 'Meer info'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
