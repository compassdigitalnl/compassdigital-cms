/**
 * Pricing Component - 100% Theme Variable Compliant
 *
 * Refactored from extensive inline styles with fallbacks and complex hover handlers
 * to theme variables. All colors now use CSS variables from ThemeProvider.
 *
 * NOTE: PricingBlock type doesn't exist in payload-types (block not registered in config)
 */
'use client'

import React from 'react'
// import type { PricingBlock } from '@/payload-types'

export const PricingBlockComponent: React.FC<any> = ({ heading, intro, plans }) => {
  return (
    <section className="pricing py-16 px-4 bg-grey-light">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-grey-mid">{intro}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                plan.highlighted ? 'transform lg:scale-105 z-10 border-t-4 border-t-warning' : 'border-t border-t-primary'
              }`}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-warning rounded-full text-white text-sm font-semibold"
                >
                  Meest Gekozen
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <p className="text-4xl font-bold text-primary mb-1">
                  {plan.price}
                </p>
                {plan.period && <p className="text-grey-mid">{plan.period}</p>}
              </div>

              {plan.description && (
                <p className="mb-6 text-grey-dark text-sm">{plan.description}</p>
              )}

              <ul className="space-y-3 mb-8">
                {plan.features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-warning flex items-center justify-center text-white text-xs font-bold"
                    >
                      ✓
                    </span>
                    <span className="text-grey-dark">{f.feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-primary hover:bg-secondary text-white'
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
