'use client'

import React from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { FeatureItem, FeaturesLayout, FeaturesIconStyle } from './types'

/**
 * B-03 Features Grid (Client Component)
 *
 * Client component for dynamic Lucide icon loading.
 * Renders feature cards with configurable layout, icon styles, and card variants.
 */

interface FeaturesGridProps {
  features: FeatureItem[]
  layout: FeaturesLayout
  iconStyle: FeaturesIconStyle
  backgroundStyle?: 'light' | 'white' | 'navy' | null
}

const gridClasses: Record<FeaturesLayout, string> = {
  'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  list: 'grid-cols-1 max-w-3xl',
  split: 'grid-cols-1',
}

const iconContainerClasses: Record<FeaturesIconStyle, { light: string; dark: string }> = {
  glow: {
    light: 'bg-teal/10 text-teal',
    dark: 'bg-white/10 text-teal-light',
  },
  solid: {
    light: 'bg-teal text-white shadow-md shadow-teal/20',
    dark: 'bg-teal text-white shadow-md shadow-teal/30',
  },
  outlined: {
    light: 'border-2 border-teal/30 text-teal bg-white',
    dark: 'border-2 border-white/30 text-white bg-white/5',
  },
}

export function FeaturesGrid({ features, layout, iconStyle, backgroundStyle }: FeaturesGridProps) {
  const isDark = backgroundStyle === 'navy'
  const isCards = layout === 'grid-3' || layout === 'grid-4'
  const colorMode = isDark ? 'dark' : 'light'

  return (
    <div className={`grid ${gridClasses[layout]} gap-5 md:gap-6`}>
      {features.map((feature, idx) => {
        const IconComponent = getIcon(feature.icon, AlertCircle)!
        const hasLink = !!feature.link
        const Wrapper = hasLink ? Link : 'div'
        const wrapperProps = hasLink ? { href: feature.link! } : {}

        // Card mode for grid layouts
        if (isCards) {
          return (
            <Wrapper
              key={feature.id || idx}
              {...(wrapperProps as any)}
              className={`group relative rounded-xl p-6 transition-all duration-200 ${
                hasLink ? 'cursor-pointer' : ''
              } ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10'
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconContainerClasses[iconStyle][colorMode]}`}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3
                className={`text-base font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-navy'
                } ${hasLink ? 'group-hover:text-teal transition-colors' : ''}`}
              >
                {feature.title}
              </h3>

              {/* Description */}
              {feature.description && (
                <p
                  className={`text-[13px] leading-relaxed ${
                    isDark ? 'text-white/60' : 'text-gray-500'
                  }`}
                >
                  {feature.description}
                </p>
              )}

              {/* Link arrow */}
              {hasLink && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal group-hover:gap-2.5 transition-all">
                  Meer info
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Wrapper>
          )
        }

        // List mode
        return (
          <Wrapper
            key={feature.id || idx}
            {...(wrapperProps as any)}
            className={`group flex gap-4 items-start py-3 ${
              hasLink ? 'cursor-pointer hover:translate-x-1 transition-transform' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconContainerClasses[iconStyle][colorMode]}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-navy'
                } ${hasLink ? 'group-hover:text-teal transition-colors' : ''}`}
              >
                {feature.title}
              </h3>
              {feature.description && (
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
              )}
            </div>
          </Wrapper>
        )
      })}
    </div>
  )
}
