import React from 'react'
import type { PricingBlock } from '@/payload-types'

export const PricingBlockComponent: React.FC<PricingBlock> = ({ heading, intro, plans }) => {
  return (
    <section className="pricing py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">{intro}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                plan.highlighted ? 'transform lg:scale-105 z-10' : ''
              }`}
              style={{
                borderTop: plan.highlighted
                  ? '4px solid var(--color-accent, #ec4899)'
                  : '1px solid var(--color-primary, #3b82f6)',
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: 'var(--color-accent, #ec4899)' }}
                >
                  Meest Gekozen
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <p
                  className="text-4xl font-bold mb-1"
                  style={{ color: 'var(--color-primary, #3b82f6)' }}
                >
                  {plan.price}
                </p>
                {plan.period && <p className="text-gray-600">{plan.period}</p>}
              </div>

              {plan.description && (
                <p className="mb-6 text-gray-700 text-sm">{plan.description}</p>
              )}

              <ul className="space-y-3 mb-8">
                {plan.features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: 'var(--color-accent, #ec4899)' }}
                    >
                      ✓
                    </span>
                    <span className="text-gray-700">{f.feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted ? 'text-white' : 'border-2'
                }`}
                style={
                  plan.highlighted
                    ? { backgroundColor: 'var(--color-primary, #3b82f6)' }
                    : {
                        borderColor: 'var(--color-primary, #3b82f6)',
                        color: 'var(--color-primary, #3b82f6)',
                      }
                }
                onMouseEnter={(e) => {
                  if (!plan.highlighted) {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary, #3b82f6)'
                    e.currentTarget.style.color = 'white'
                  } else {
                    e.currentTarget.style.backgroundColor = 'var(--color-secondary, #8b5cf6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.highlighted) {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.color = 'var(--color-primary, #3b82f6)'
                  } else {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary, #3b82f6)'
                  }
                }}
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
