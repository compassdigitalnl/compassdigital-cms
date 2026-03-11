import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { TrustSignalsBlockProps, TrustSignalsVariant, TrustSignalsBackground, TrustSignalItem } from './types'

/**
 * B-40 TrustSignals Block Component (Server)
 *
 * USP/trust indicators. Horizontal: inline row. Cards: grid cards.
 * Icons + short text. Dark background support.
 */

const iconPaths: Record<string, string> = {
  'shield-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  truck: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  headphones: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0016 5.5V3.935',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  check: 'M5 13l4 4L19 7',
  heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
}

const bgStyles: Record<TrustSignalsBackground, string> = {
  white: 'bg-white',
  grey: 'bg-grey-light',
  navy: 'bg-navy',
}

const textStyles: Record<TrustSignalsBackground, { title: string; description: string; icon: string }> = {
  white: { title: 'text-navy', description: 'text-grey-dark', icon: 'text-teal' },
  grey: { title: 'text-navy', description: 'text-grey-dark', icon: 'text-teal' },
  navy: { title: 'text-white', description: 'text-white/70', icon: 'text-teal-light' },
}

function IconSvg({ icon, className }: { icon: string; className: string }) {
  const path = iconPaths[icon]
  if (!path) {
    // Treat as emoji or text
    return <span className={`text-2xl ${className}`}>{icon}</span>
  }
  return (
    <svg className={`h-6 w-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
    </svg>
  )
}

export const TrustSignalsBlockComponent: React.FC<TrustSignalsBlockProps> = ({
  items,
  variant = 'horizontal',
  backgroundColor = 'white',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validItems = (items || []) as TrustSignalItem[]
  if (validItems.length === 0) return null

  const currentVariant = (variant || 'horizontal') as TrustSignalsVariant
  const currentBg = (backgroundColor || 'white') as TrustSignalsBackground
  const colors = textStyles[currentBg]

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`trust-signals-block py-8 md:py-12 ${bgStyles[currentBg]}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Horizontal layout */}
        {currentVariant === 'horizontal' && (
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {validItems.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-2.5">
                {item.icon && <IconSvg icon={item.icon} className={colors.icon} />}
                <div>
                  <span className={`text-sm font-semibold ${colors.title}`}>{item.title}</span>
                  {item.description && (
                    <span className={`ml-1.5 text-xs ${colors.description}`}>
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards layout */}
        {currentVariant === 'cards' && (
          <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${Math.min(validItems.length, 4)}`}>
            {validItems.map((item, index) => (
              <div
                key={item.id || index}
                className={`rounded-xl p-6 text-center ${
                  currentBg === 'navy'
                    ? 'bg-white/10 backdrop-blur-sm'
                    : 'border border-grey bg-white'
                }`}
              >
                {item.icon && (
                  <div className="mb-3 flex justify-center">
                    <IconSvg icon={item.icon} className={`${colors.icon} !h-8 !w-8`} />
                  </div>
                )}
                <h3 className={`text-sm font-bold ${colors.title}`}>{item.title}</h3>
                {item.description && (
                  <p className={`mt-1 text-xs ${colors.description}`}>{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default TrustSignalsBlockComponent
