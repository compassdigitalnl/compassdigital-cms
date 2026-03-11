/**
 * B-17c Pricing Gradient Component
 *
 * E-commerce pricing table with gradient featured card.
 * Supports 4 variants: three-tier, two-column, comparison, with-faq.
 * Uses BillingToggle client component for monthly/yearly interactivity.
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { BillingToggle } from './BillingToggle'
import type { PricingGradientBlock } from '@/payload-types'

const gradientClasses: Record<string, string> = {
  navy: 'bg-gradient-to-br from-navy to-navy-light',
  teal: 'bg-gradient-to-br from-teal to-teal-dark',
  purple: 'bg-gradient-to-br from-purple-700 to-purple-900',
  blue: 'bg-gradient-to-br from-blue-600 to-blue-800',
}

const glowClasses: Record<string, string> = {
  navy: 'from-white/20 to-transparent',
  teal: 'from-white/20 to-transparent',
  purple: 'from-white/15 to-transparent',
  blue: 'from-white/20 to-transparent',
}

const badgeGradientClasses: Record<string, string> = {
  navy: 'bg-gradient-to-r from-teal to-teal-dark',
  teal: 'bg-gradient-to-r from-navy to-navy-light',
  purple: 'bg-gradient-to-r from-teal to-teal-dark',
  blue: 'bg-gradient-to-r from-teal to-teal-dark',
}

export const PricingGradientComponent: React.FC<PricingGradientBlock> = ({
  header,
  billingToggle,
  plans,
  faq,
  variant = 'three-tier',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!plans || plans.length === 0) return null

  const showToggle = billingToggle?.enabled !== false

  const gridClass =
    variant === 'two-column'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center'

  const renderPlanCard = (
    plan: NonNullable<PricingGradientBlock['plans']>[number],
    index: number,
    isYearly: boolean,
  ) => {
    const isFeatured = plan.isFeatured === true
    const color = (plan.gradientColor as string) || 'navy'
    const hasCustomPrice = !!plan.customPrice
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    const period = isYearly ? '/jaar' : '/maand'

    if (isFeatured) {
      return (
        <div
          key={plan.id || index}
          className={`relative ${gradientClasses[color] || gradientClasses.navy} text-white rounded-2xl p-8 scale-100 lg:scale-[1.05] shadow-xl z-10 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col`}
        >
          {/* Decorative glow */}
          <div
            className={`absolute right-[-60px] top-[-60px] w-[280px] h-[280px] rounded-full bg-gradient-radial ${glowClasses[color] || glowClasses.navy} pointer-events-none`}
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)`,
            }}
          />

          {/* Featured badge */}
          {plan.featuredBadge && (
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${badgeGradientClasses[color] || badgeGradientClasses.navy} text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap`}
            >
              {plan.featuredBadge}
            </div>
          )}

          {/* Plan name */}
          <h3 className="font-display text-xl font-bold mb-2 relative z-10">{plan.name}</h3>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-white/80 mb-6 relative z-10">{plan.description}</p>
          )}

          {/* Price */}
          <div className="mb-6 relative z-10">
            {hasCustomPrice ? (
              <span className="font-display text-3xl md:text-4xl font-bold">{plan.customPrice}</span>
            ) : price != null ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">&euro;</span>
                <span className="font-display text-5xl font-bold">{price}</span>
                <span className="text-sm text-white/70">{period}</span>
              </div>
            ) : (
              <span className="font-display text-3xl font-bold">Gratis</span>
            )}
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
              {plan.features.map((feature, fIdx) => (
                <li
                  key={feature.id || fIdx}
                  className={`flex items-start gap-3 ${
                    feature.enabled === false ? 'opacity-40 line-through' : ''
                  }`}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                    <Icon
                      name={feature.enabled === false ? 'X' : 'Check'}
                      size={12}
                      className="text-teal-light"
                    />
                  </span>
                  <span className="text-sm text-white/90">{feature.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <Link
            href={plan.ctaUrl || '#'}
            className="btn w-full justify-center mt-auto bg-white text-navy font-bold hover:bg-white/90 transition-colors relative z-10"
          >
            {plan.ctaText || 'Start gratis trial'}
          </Link>
        </div>
      )
    }

    // Normal (non-featured) card
    return (
      <div
        key={plan.id || index}
        className="relative bg-white border-2 border-grey-light rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
        {/* Plan name */}
        <h3 className="font-display text-xl font-bold text-navy mb-2">{plan.name}</h3>

        {/* Description */}
        {plan.description && (
          <p className="text-sm text-grey-dark mb-6">{plan.description}</p>
        )}

        {/* Price */}
        <div className="mb-6">
          {hasCustomPrice ? (
            <span className="font-display text-3xl md:text-4xl font-bold text-navy">
              {plan.customPrice}
            </span>
          ) : price != null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-navy">&euro;</span>
              <span className="font-display text-5xl font-bold text-navy">{price}</span>
              <span className="text-sm text-grey-mid">{period}</span>
            </div>
          ) : (
            <span className="font-display text-3xl font-bold text-navy">Gratis</span>
          )}
        </div>

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature, fIdx) => (
              <li
                key={feature.id || fIdx}
                className={`flex items-start gap-3 ${
                  feature.enabled === false ? 'opacity-40 line-through' : ''
                }`}
              >
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    feature.enabled === false ? 'bg-gray-200' : 'bg-teal/10'
                  }`}
                >
                  <Icon
                    name={feature.enabled === false ? 'X' : 'Check'}
                    size={12}
                    className={feature.enabled === false ? 'text-gray-400' : 'text-teal'}
                  />
                </span>
                <span
                  className={feature.enabled === false ? 'text-gray-400 text-sm' : 'text-gray-700 text-sm'}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          href={plan.ctaUrl || '#'}
          className="btn btn-outline-primary w-full justify-center mt-auto"
        >
          {plan.ctaText || 'Start gratis trial'}
        </Link>
      </div>
    )
  }

  const renderComparisonTable = (isYearly: boolean) => {
    // Collect all unique features across plans
    const allFeatures: string[] = []
    plans.forEach((plan) => {
      plan.features?.forEach((f) => {
        if (f.text && !allFeatures.includes(f.text)) {
          allFeatures.push(f.text)
        }
      })
    })

    return (
      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-6 py-4 text-sm font-bold text-grey-mid border-b-2 border-grey-light">
                Features
              </th>
              {plans.map((plan, index) => {
                const isFeatured = plan.isFeatured === true
                const color = (plan.gradientColor as string) || 'navy'
                return (
                  <th
                    key={plan.id || index}
                    className={`px-6 py-4 text-center border-b-2 border-grey-light ${
                      isFeatured ? 'text-white' : ''
                    }`}
                  >
                    <div
                      className={`rounded-t-xl p-4 -mx-2 ${
                        isFeatured ? `${gradientClasses[color] || gradientClasses.navy}` : ''
                      }`}
                    >
                      <div className={`text-lg font-bold ${isFeatured ? 'text-white' : 'text-navy'}`}>
                        {plan.name}
                      </div>
                      <div className={`text-sm mt-1 ${isFeatured ? 'text-white/80' : 'text-grey-mid'}`}>
                        {plan.customPrice
                          ? plan.customPrice
                          : (isYearly ? plan.yearlyPrice : plan.monthlyPrice) != null
                            ? `€${isYearly ? plan.yearlyPrice : plan.monthlyPrice}${isYearly ? '/jaar' : '/maand'}`
                            : 'Gratis'}
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((featureText, fIdx) => (
              <tr key={fIdx} className="border-b border-grey-light hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-700">{featureText}</td>
                {plans.map((plan, pIdx) => {
                  const feature = plan.features?.find((f) => f.text === featureText)
                  const isIncluded = feature ? feature.enabled !== false : false
                  const isFeatured = plan.isFeatured === true

                  return (
                    <td key={plan.id || pIdx} className="px-6 py-3 text-center">
                      {isIncluded ? (
                        <span
                          className={`inline-flex w-5 h-5 rounded-full items-center justify-center ${
                            isFeatured ? 'bg-teal/20' : 'bg-teal/10'
                          }`}
                        >
                          <Icon name="Check" size={12} className="text-teal" />
                        </span>
                      ) : (
                        <span className="inline-flex w-5 h-5 rounded-full bg-gray-100 items-center justify-center">
                          <Icon name="X" size={12} className="text-gray-300" />
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-6 py-4" />
              {plans.map((plan, index) => (
                <td key={plan.id || index} className="px-6 py-4 text-center">
                  <Link
                    href={plan.ctaUrl || '#'}
                    className={`btn text-sm ${
                      plan.isFeatured ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                  >
                    {plan.ctaText || 'Start gratis trial'}
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  const renderFAQ = () => {
    if (!faq || faq.length === 0) return null

    return (
      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="font-display text-xl md:text-2xl text-navy text-center mb-8">
          Veelgestelde vragen
        </h3>
        <div className="space-y-4">
          {faq.map((item, index) => (
            <details
              key={item.id || index}
              className="group bg-grey-light rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-navy hover:text-teal transition-colors">
                <span>{item.question}</span>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className="text-grey-mid transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-grey-dark leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    )
  }

  const renderContent = (isYearly: boolean) => {
    if (variant === 'comparison') {
      return renderComparisonTable(isYearly)
    }

    return (
      <>
        <div className={gridClass}>
          {plans.map((plan, index) => renderPlanCard(plan, index, isYearly))}
        </div>
        {variant === 'with-faq' && renderFAQ()}
      </>
    )
  }

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {(header?.badge || header?.title || header?.description) && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {header.badge && (
              <span className="inline-flex text-xs uppercase tracking-wider text-teal bg-teal/10 px-3 py-1 rounded-full font-semibold mb-4">
                {header.badge}
              </span>
            )}
            {header.title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{header.title}</h2>
            )}
            {header.description && (
              <p className="text-grey-dark text-sm md:text-base">{header.description}</p>
            )}
          </div>
        )}

        {/* Plans with optional billing toggle */}
        {showToggle ? (
          <BillingToggle saveBadge={billingToggle?.saveBadge}>
            {(isYearly) => renderContent(isYearly)}
          </BillingToggle>
        ) : (
          renderContent(false)
        )}
      </div>
    </AnimationWrapper>
  )
}

export default PricingGradientComponent
