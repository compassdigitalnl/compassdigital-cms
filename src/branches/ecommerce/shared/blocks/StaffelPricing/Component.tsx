/**
 * B-19 StaffelPricing Component
 *
 * Volume/bulk pricing tiers display.
 * Table: standard pricing table with rows per tier.
 * Cards: stepped cards showing quantity ranges with visual hierarchy.
 * Uses theme variables for all colors.
 */
import React from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { StaffelPricingBlock } from '@/payload-types'

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return '-'
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const formatRange = (min: number | null | undefined, max: number | null | undefined): string => {
  const minVal = min || 1
  if (!max) return `${minVal}+`
  return `${minVal} - ${max}`
}

export const StaffelPricingComponent: React.FC<StaffelPricingBlock> = ({
  title,
  subtitle,
  tiers,
  variant = 'table',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!tiers || tiers.length === 0) return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center mb-10">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
              )}
              {subtitle && <p className="text-lg text-grey-mid">{subtitle}</p>}
            </div>
          )}

          {variant === 'table' ? (
            /* Table variant */
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-xl overflow-hidden border border-grey">
                <thead>
                  <tr>
                    <th className="bg-secondary text-white px-6 py-4 text-left text-sm font-bold">
                      Aantal
                    </th>
                    <th className="bg-secondary text-white px-6 py-4 text-right text-sm font-bold">
                      Prijs per stuk
                    </th>
                    <th className="bg-secondary text-white px-6 py-4 text-right text-sm font-bold">
                      Korting
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier, index) => (
                    <tr
                      key={tier.id || index}
                      className={`border-b border-grey bg-white hover:bg-gray-50 transition-colors ${
                        index === tiers.length - 1 ? 'bg-primary/5 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Icon name="Package" size={16} className="text-primary" />
                          {formatRange(tier.minQuantity, tier.maxQuantity)} stuks
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                        {formatPrice(tier.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {tier.discount ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                            <Icon name="TrendingDown" size={12} />
                            {tier.discount}
                          </span>
                        ) : (
                          <span className="text-grey-mid text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards variant */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tiers.map((tier, index) => {
                const isLast = index === tiers.length - 1
                const isBestDeal = isLast && tiers.length > 1

                return (
                  <div
                    key={tier.id || index}
                    className={`relative rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      isBestDeal
                        ? 'bg-primary text-white border-2 border-primary shadow-md'
                        : 'bg-white border-2 border-grey hover:border-primary'
                    }`}
                  >
                    {isBestDeal && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-success rounded-full text-white text-[10px] font-bold whitespace-nowrap">
                        Beste deal
                      </div>
                    )}

                    <div
                      className={`text-sm font-medium mb-2 ${isBestDeal ? 'text-white/80' : 'text-grey-mid'}`}
                    >
                      {formatRange(tier.minQuantity, tier.maxQuantity)} stuks
                    </div>

                    <div
                      className={`text-3xl font-bold mb-1 ${isBestDeal ? 'text-white' : 'text-gray-900'}`}
                    >
                      {formatPrice(tier.price)}
                    </div>

                    <div
                      className={`text-xs ${isBestDeal ? 'text-white/70' : 'text-grey-mid'}`}
                    >
                      per stuk
                    </div>

                    {tier.discount && (
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            isBestDeal
                              ? 'bg-white/20 text-white'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {tier.discount}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default StaffelPricingComponent
