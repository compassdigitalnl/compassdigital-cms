/**
 * B-17 SubscriptionPricing Component
 *
 * Pricing cards/table with monthly/yearly toggle.
 * Shows savings badge for yearly plans.
 * Uses a client FrequencyToggle component for the interactive toggle.
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { FrequencyToggle } from './FrequencyToggle'
import type { SubscriptionPricingBlock } from '@/payload-types'

export const SubscriptionPricingComponent: React.FC<SubscriptionPricingBlock> = ({
  title,
  subtitle,
  frequency: frequencyOption = 'both',
  plans,
  variant = 'cards',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const [activeFrequency, setActiveFrequency] = useState<'monthly' | 'yearly'>(
    frequencyOption === 'yearly' ? 'yearly' : 'monthly',
  )

  if (!plans || plans.length === 0) return null

  const showToggle = frequencyOption === 'both'

  // Table variant
  if (variant === 'table') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="py-16 md:py-24 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h2>
              )}
              {subtitle && <p className="text-lg text-grey-mid">{subtitle}</p>}
            </div>
          )}

          {showToggle && (
            <FrequencyToggle frequency={activeFrequency} onChange={setActiveFrequency} />
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden border border-grey">
              <thead>
                <tr>
                  <th className="bg-secondary text-white px-6 py-4 text-left text-sm font-bold">
                    Pakket
                  </th>
                  <th className="bg-secondary text-white px-6 py-4 text-left text-sm font-bold">
                    Prijs
                  </th>
                  <th className="bg-secondary text-white px-6 py-4 text-left text-sm font-bold">
                    Features
                  </th>
                  <th className="bg-secondary text-white px-6 py-4 text-center text-sm font-bold">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => {
                  const price =
                    activeFrequency === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
                  const period =
                    activeFrequency === 'yearly' ? '/jaar' : plan.period || '/maand'

                  return (
                    <tr
                      key={plan.id || index}
                      className={`border-b border-grey ${plan.featured ? 'bg-primary/5' : 'bg-white'} hover:bg-grey-light transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy">{plan.name}</span>
                          {plan.featured && (
                            <span className="px-2 py-0.5 bg-primary rounded-full text-white text-[10px] font-bold">
                              Populair
                            </span>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-sm text-grey-mid mt-1">{plan.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-primary">{price}</span>
                        <span className="text-grey-mid text-sm ml-1">{period}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {plan.features
                            ?.filter((f) => f.included)
                            .slice(0, 3)
                            .map((f, fIdx) => (
                              <span
                                key={f.id || fIdx}
                                className="inline-flex items-center gap-1 text-xs text-grey-dark bg-grey-light rounded-full px-2 py-1"
                              >
                                <Icon name="Check" size={10} className="text-success" />
                                {f.text}
                              </span>
                            ))}
                          {(plan.features?.filter((f) => f.included).length || 0) > 3 && (
                            <span className="text-xs text-grey-mid">
                              +{(plan.features?.filter((f) => f.included).length || 0) - 3} meer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {plan.buttonLabel && plan.buttonLink && (
                          <Link
                            href={plan.buttonLink}
                            className={`btn text-sm ${plan.featured ? 'btn-primary' : 'btn-outline-primary'}`}
                          >
                            {plan.buttonLabel}
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Cards variant (default)
  const gridClass =
    plans.length <= 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'
      : plans.length === 4
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'

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
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h2>
            )}
            {subtitle && <p className="text-lg text-grey-mid max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        {showToggle && (
          <FrequencyToggle frequency={activeFrequency} onChange={setActiveFrequency} />
        )}

        <div className={gridClass}>
          {plans.map((plan, index) => {
            const isFeatured = plan.featured === true
            const price =
              activeFrequency === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
            const period =
              activeFrequency === 'yearly' ? '/jaar' : plan.period || '/maand'

            return (
              <div
                key={plan.id || index}
                className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${
                  isFeatured
                    ? 'border-2 border-primary lg:scale-105 z-10'
                    : 'border border-grey'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-sm font-bold whitespace-nowrap">
                    Populair
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-navy mb-2">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{price}</span>
                    <span className="text-grey-mid ml-1">{period}</span>
                  </div>

                  {/* Savings badge for yearly */}
                  {activeFrequency === 'yearly' && plan.monthlyPrice && plan.yearlyPrice && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                        <Icon name="TrendingDown" size={12} />
                        Bespaar t.o.v. maandelijks
                      </span>
                    </div>
                  )}

                  {plan.description && (
                    <p className="text-sm text-grey-mid mb-6">{plan.description}</p>
                  )}

                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, fIdx) => (
                        <li key={feature.id || fIdx} className="flex items-start gap-3">
                          {feature.included ? (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success flex items-center justify-center text-white text-xs mt-0.5">
                              <Icon name="Check" size={12} />
                            </span>
                          ) : (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-grey-light flex items-center justify-center text-grey-mid text-xs mt-0.5">
                              <Icon name="X" size={12} />
                            </span>
                          )}
                          <span
                            className={
                              feature.included
                                ? 'text-grey-dark'
                                : 'text-grey-mid line-through'
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

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

export default SubscriptionPricingComponent
