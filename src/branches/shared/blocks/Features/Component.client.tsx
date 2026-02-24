'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

/**
 * B02 - Features Block Component (Client)
 *
 * Client component for dynamic Lucide icon loading.
 *
 * FEATURES:
 * - Dynamic icon import from Lucide React
 * - 3 icon styles with different backgrounds
 * - Responsive grid layouts
 * - Fallback to AlertCircle if icon not found
 *
 * @see docs/refactoring/sprint-9/shared/b02-features.html
 */

interface Feature {
  icon: string
  title: string
  description?: string
}

interface FeaturesClientProps {
  features: Feature[]
  variant: string
  iconStyle: string
  alignment: string
}

export function FeaturesBlockComponent({
  features,
  variant,
  iconStyle,
  alignment,
}: FeaturesClientProps) {
  const gridCols = {
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    list: 'grid-cols-1',
  }

  const iconStyleClasses = {
    glow: 'w-12 h-12 rounded-full bg-teal-glow flex items-center justify-center text-teal',
    solid: 'w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white',
    outlined: 'w-12 h-12 rounded-full border-2 border-teal flex items-center justify-center text-teal',
  }

  // Helper to get Lucide icon component
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.AlertCircle
    return IconComponent
  }

  return (
    <div className={`grid ${gridCols[variant as keyof typeof gridCols] || gridCols['grid-3']} gap-6 md:gap-8`}>
      {features.map((feature, idx) => {
        const IconComponent = getIcon(feature.icon)

        return (
          <div
            key={idx}
            className={`feature-item ${
              variant === 'list' ? 'flex gap-4 items-start' : ''
            } ${alignment === 'center' && variant !== 'list' ? 'text-center' : ''}`}
          >
            <div
              className={`${iconStyleClasses[iconStyle as keyof typeof iconStyleClasses] || iconStyleClasses.glow} ${
                alignment === 'center' && variant !== 'list' ? 'mx-auto mb-4' : 'mb-4'
              }`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div className={variant === 'list' ? 'flex-1' : ''}>
              <h3 className="text-base md:text-lg font-bold text-navy mb-2">{feature.title}</h3>
              {feature.description && (
                <p className="text-[13px] md:text-sm text-grey-dark leading-relaxed">
                  {feature.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
