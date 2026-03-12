import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { getIcon } from '@/utilities/getIcon'
import { AlertCircle } from 'lucide-react'
import type { TrustSignalsBlockProps, TrustSignalsVariant, TrustSignalsBackground, TrustSignalItem } from './types'

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

function TrustIcon({ icon, className }: { icon: string; className: string }) {
  const IconComponent = getIcon(icon, AlertCircle)
  if (!IconComponent) return null
  return <IconComponent className={className} />
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
                {item.icon && <TrustIcon icon={item.icon} className={`h-5 w-5 ${colors.icon}`} />}
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
                    <TrustIcon icon={item.icon} className={`${colors.icon} !h-8 !w-8`} />
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
