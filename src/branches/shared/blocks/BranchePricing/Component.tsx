import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type {
  BranchePricingBlockProps,
  BranchePricingBgColor,
  BranchePricingPlan,
  BranchePricingFeature,
} from './types'

/**
 * Branche Pricing Block Component
 *
 * Displays pricing tiers for a specific branch with optional competitor comparison.
 * Featured plans get a highlighted border, badge, and scale effect.
 */

/* --- Background Classes ------------------------------------------------- */

function getBgClasses(bg: BranchePricingBgColor): string {
  switch (bg) {
    case 'gradient':
      return 'bg-gradient-to-br from-teal-50 to-teal-100'
    case 'light-grey':
      return 'bg-grey-light'
    case 'white':
    default:
      return 'bg-white'
  }
}

/* --- Grid Classes ------------------------------------------------------- */

function getGridClasses(count: number): string {
  switch (count) {
    case 1:
      return 'grid-cols-1 max-w-md mx-auto'
    case 2:
      return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
    case 3:
      return 'grid-cols-1 md:grid-cols-3'
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1 md:grid-cols-3'
  }
}

/* --- Check Icon --------------------------------------------------------- */

const CheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green shrink-0"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* --- X Icon ------------------------------------------------------------- */

const XIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-coral shrink-0"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* --- Component ---------------------------------------------------------- */

export const BranchePricingBlockComponent: React.FC<BranchePricingBlockProps> = ({
  title,
  subtitle,
  plans,
  competitorComparison,
  ctaText,
  bgColor = 'white',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentBg = (bgColor || 'white') as BranchePricingBgColor
  const planItems = (plans as BranchePricingPlan[]) || []

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`branche-pricing-block py-16 md:py-24 ${getBgClasses(currentBg)}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          {title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-lg text-grey-dark">{subtitle}</p>}
        </div>

        {/* Pricing cards grid */}
        {planItems.length > 0 && (
          <div className={`grid ${getGridClasses(planItems.length)} gap-6 md:gap-8 items-stretch`}>
            {planItems.map((plan, idx) => {
              const isFeatured = plan.featured === true
              const features = (plan.features as BranchePricingFeature[]) || []

              return (
                <div
                  key={plan.id || idx}
                  className={`
                    relative rounded-2xl p-8 transition-all duration-300
                    ${
                      isFeatured
                        ? 'bg-white border-2 border-teal shadow-lg scale-105 z-10'
                        : 'bg-white border border-grey-light shadow-sm hover:shadow-lg'
                    }
                  `}
                >
                  {/* Featured badge */}
                  {isFeatured && plan.badge && (
                    <span className="absolute top-0 right-4 -translate-y-1/2 bg-teal text-white rounded-full px-3 py-1 text-sm font-medium">
                      {plan.badge}
                    </span>
                  )}

                  {/* Plan name */}
                  <h3 className="text-lg font-semibold text-navy">{plan.name}</h3>

                  {/* Price + period */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-navy">{plan.price}</span>
                    {plan.period && <span className="text-lg text-grey-mid">{plan.period}</span>}
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-grey-dark mt-2">{plan.description}</p>
                  )}

                  {/* Divider */}
                  <div className="border-t border-grey-light my-6" />

                  {/* Features list */}
                  {features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, fIdx) => {
                        const isIncluded = feature.included !== false

                        return (
                          <li
                            key={feature.id || fIdx}
                            className="flex items-start gap-3"
                          >
                            {isIncluded ? <CheckIcon /> : <XIcon />}
                            <span
                              className={`text-sm ${
                                isIncluded ? 'text-grey-dark' : 'text-grey-mid line-through'
                              }`}
                            >
                              {feature.text}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {/* CTA button */}
                  <a
                    href={plan.buttonLink || '#'}
                    className={`btn block w-full text-center ${
                      isFeatured ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                  >
                    {plan.buttonLabel || 'Start nu'}
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {/* Competitor comparison */}
        {competitorComparison?.enabled && competitorComparison?.text && (
          <div className="text-center mt-10 md:mt-14">
            <p className="text-grey-dark text-lg">
              <span className="line-through text-grey-mid">{competitorComparison.text}</span>
            </p>
          </div>
        )}

        {/* Bottom CTA text */}
        {ctaText && (
          <p className="text-center text-grey-mid mt-8 text-sm">{ctaText}</p>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default BranchePricingBlockComponent
