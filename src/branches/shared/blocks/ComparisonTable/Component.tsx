import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { CompetitorComparisonBlockProps, ComparisonValue } from './types'

/**
 * Competitor Comparison Block Component
 *
 * Feature comparison table: "CompassDigital vs competitors".
 * - Responsive: horizontal scroll on mobile
 * - Our column highlighted with blue header + light blue stripe
 * - Values rendered as colored icons (check / cross / tilde) or custom text
 * - CTA button in our column footer
 */

/* ─── Value Badge ────────────────────────────────────────────────── */

function ValueBadge({ value, customValue }: { value: ComparisonValue; customValue?: string | null }) {
  switch (value) {
    case 'yes':
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )
    case 'no':
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-coral-50 text-coral">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )
    case 'partial':
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      )
    case 'custom':
      return (
        <span className="text-sm font-medium text-gray-700">
          {customValue || '-'}
        </span>
      )
    default:
      return <span className="text-gray-400">-</span>
  }
}

/* ─── Background Classes ─────────────────────────────────────────── */

function getSectionBg(bg?: string | null): string {
  return bg === 'light-grey' ? 'bg-grey-light' : 'bg-white'
}

/* ─── Component ──────────────────────────────────────────────────── */

export const CompetitorComparisonBlockComponent: React.FC<CompetitorComparisonBlockProps> = ({
  title,
  subtitle,
  competitors,
  features,
  highlightColumn = true,
  bgColor,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const competitorList = (competitors as Array<{ name: string; id?: string | null }>) || []
  const featureList = (features as Array<{
    name: string
    ourValue?: ComparisonValue | null
    ourCustomValue?: string | null
    competitorValues?: Array<{
      value?: ComparisonValue | null
      customValue?: string | null
      id?: string | null
    }> | null
    id?: string | null
  }>) || []

  if (featureList.length === 0) return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`competitor-comparison-block py-16 md:py-24 ${getSectionBg(bgColor)}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          {title && (
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-navy mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-grey-dark leading-relaxed">{subtitle}</p>
          )}
        </div>

        {/* Responsive table wrapper */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle sm:px-0 px-4">
            <table className="min-w-full border-separate border-spacing-0">
              {/* ─── Header Row ─────────────────────────────────── */}
              <thead>
                <tr>
                  {/* Empty corner cell */}
                  <th className="sticky left-0 z-10 bg-white px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    Feature
                  </th>

                  {/* Our column header */}
                  <th
                    className={`px-4 py-4 text-center text-sm font-bold border-b ${
                      highlightColumn
                        ? 'bg-teal text-white rounded-t-lg'
                        : 'bg-gray-100 text-gray-900 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base">CompassDigital</span>
                      {highlightColumn && (
                        <span className="text-[10px] font-medium uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          Aanbevolen
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Competitor column headers */}
                  {competitorList.map((competitor, idx) => (
                    <th
                      key={competitor.id || idx}
                      className="px-4 py-4 text-center text-sm font-bold bg-gray-100 text-gray-700 border-b border-gray-200"
                    >
                      {competitor.name}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ─── Feature Rows ───────────────────────────────── */}
              <tbody>
                {featureList.map((feature, rowIdx) => {
                  const isEven = rowIdx % 2 === 0
                  const competitorVals = feature.competitorValues || []

                  return (
                    <tr key={feature.id || rowIdx} className="group">
                      {/* Feature name */}
                      <td
                        className={`sticky left-0 z-10 px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100 ${
                          isEven ? 'bg-gray-50' : 'bg-white'
                        } group-hover:bg-gray-100 transition-colors`}
                      >
                        {feature.name}
                      </td>

                      {/* Our value */}
                      <td
                        className={`px-4 py-3 text-center border-b border-gray-100 ${
                          highlightColumn
                            ? isEven
                              ? 'bg-teal-50'
                              : 'bg-teal/5'
                            : isEven
                              ? 'bg-gray-50'
                              : 'bg-white'
                        } group-hover:bg-teal/10 transition-colors`}
                      >
                        <div className="flex items-center justify-center">
                          <ValueBadge
                            value={(feature.ourValue || 'yes') as ComparisonValue}
                            customValue={feature.ourCustomValue}
                          />
                        </div>
                      </td>

                      {/* Competitor values */}
                      {competitorList.map((_, compIdx) => {
                        const compVal = competitorVals[compIdx]
                        return (
                          <td
                            key={compIdx}
                            className={`px-4 py-3 text-center border-b border-gray-100 ${
                              isEven ? 'bg-gray-50' : 'bg-white'
                            } group-hover:bg-gray-100 transition-colors`}
                          >
                            <div className="flex items-center justify-center">
                              <ValueBadge
                                value={(compVal?.value || 'no') as ComparisonValue}
                                customValue={compVal?.customValue}
                              />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>

              {/* ─── CTA Footer Row ─────────────────────────────── */}
              <tfoot>
                <tr>
                  <td className="px-4 py-5" />
                  <td className={`px-4 py-5 text-center ${highlightColumn ? 'bg-teal/5 rounded-b-lg' : ''}`}>
                    <a
                      href="/contact"
                      className="btn btn-primary"
                    >
                      Start gratis
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </td>
                  {competitorList.map((_, idx) => (
                    <td key={idx} className="px-4 py-5" />
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default CompetitorComparisonBlockComponent
