/**
 * B-16 Pricing Component
 *
 * Pricing comparison cards with feature checkmarks/crosses.
 * Featured plan gets highlighted border + "Populair" badge.
 * Uses theme variables for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { PricingBlock } from '@/payload-types'

const columnClasses: Record<string, string> = {
  '2': 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto',
  '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto',
  '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto',
}

export const PricingComponent: React.FC<PricingBlock> = ({
  title,
  subtitle,
  plans,
  columns = '3',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!plans || plans.length === 0) return null

  const gridClass = columnClasses[columns || '3'] || columnClasses['3']

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-16 md:py-24 px-4 bg-grey-light"
    >
      <div className="container mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-grey-mid max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Plans Grid */}
        <div className={gridClass}>
          {plans.map((plan, index) => {
            const isFeatured = plan.featured === true

            return (
              <div
                key={plan.id || index}
                className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${
                  isFeatured
                    ? 'border-2 border-primary lg:scale-105 z-10'
                    : 'border border-grey'
                }`}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-sm font-bold whitespace-nowrap">
                    Populair
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  {/* Plan name */}
                  <h3 className="text-xl font-bold text-navy mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-grey-mid ml-1">{plan.period}</span>
                    )}
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-sm text-grey-mid mb-6">{plan.description}</p>
                  )}

                  {/* Features */}
                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, fIdx) => (
                        <li key={feature.id || fIdx} className="flex items-start gap-3">
                          {feature.included ? (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              <Icon name="Check" size={12} />
                            </span>
                          ) : (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-grey-light flex items-center justify-center text-grey-mid text-xs font-bold mt-0.5">
                              <Icon name="X" size={12} />
                            </span>
                          )}
                          <span
                            className={
                              feature.included ? 'text-grey-dark' : 'text-grey-mid line-through'
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  {plan.buttonLabel && plan.buttonLink && (
                    <Link
                      href={plan.buttonLink}
                      className={`btn w-full justify-center mt-auto ${
                        isFeatured ? 'btn-primary' : 'btn-outline-primary'
                      }`}
                    >
                      {plan.buttonLabel}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default PricingComponent
