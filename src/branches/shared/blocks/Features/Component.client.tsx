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
 * Renders the feature cards grid with configurable layout and icon styles.
 */

interface FeaturesGridProps {
  features: FeatureItem[]
  layout: FeaturesLayout
  iconStyle: FeaturesIconStyle
}

const gridClasses: Record<FeaturesLayout, string> = {
  'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  list: 'grid-cols-1',
  split: 'grid-cols-1',
}

const iconStyleClasses: Record<FeaturesIconStyle, string> = {
  glow: 'w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal',
  solid: 'w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white',
  outlined: 'w-12 h-12 rounded-full border-2 border-teal flex items-center justify-center text-teal',
}

export function FeaturesGrid({ features, layout, iconStyle }: FeaturesGridProps) {
  return (
    <div className={`grid ${gridClasses[layout]} gap-6 md:gap-8`}>
      {features.map((feature, idx) => {
        const IconComponent = getIcon(feature.icon, AlertCircle)!
        const hasLink = !!feature.link
        const Wrapper = hasLink ? Link : 'div'
        const wrapperProps = hasLink
          ? { href: feature.link! }
          : {}

        return (
          <Wrapper
            key={feature.id || idx}
            {...(wrapperProps as any)}
            className={`feature-item ${
              layout === 'list'
                ? 'flex gap-4 items-start'
                : 'text-center'
            } ${hasLink ? 'group hover:-translate-y-1 transition-transform cursor-pointer' : ''}`}
          >
            <div
              className={`${iconStyleClasses[iconStyle]} ${
                layout === 'list' ? 'shrink-0' : 'mx-auto mb-4'
              }`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div className={layout === 'list' ? 'flex-1' : ''}>
              <h3 className={`text-base md:text-lg font-bold text-navy mb-2 ${hasLink ? 'group-hover:text-teal transition-colors' : ''}`}>
                {feature.title}
              </h3>
              {feature.description && (
                <p className="text-[13px] md:text-sm text-grey-dark leading-relaxed">
                  {feature.description}
                </p>
              )}
              {hasLink && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal mt-2 group-hover:gap-2 transition-all">
                  Meer info
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          </Wrapper>
        )
      })}
    </div>
  )
}
