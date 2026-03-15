'use client'

import { useState } from 'react'
import type { Product } from '@/payload-types'
import { Check, Gift, User, Zap } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

type VariantValue = NonNullable<NonNullable<(Product & { variantOptions?: any[] })['variantOptions']>[number]['values']>[number]

interface SubscriptionPricingTableProps {
  product: Product
  onSelectionChange?: (selection: VariantValue | null) => void
}

export function SubscriptionPricingTable({ product, onSelectionChange }: SubscriptionPricingTableProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantValue | null>(null)
  const { displayPrice, formatPriceStr } = usePriceMode()

  // Get all subscription variants from variant options
  const subscriptionVariants: VariantValue[] = []
  ;((product as any).variantOptions || []).forEach((option: any) => {
    option.values?.forEach((value: any) => {
      if (value.subscriptionType) {
        subscriptionVariants.push(value)
      }
    })
  })

  if (subscriptionVariants.length === 0) {
    return null
  }

  const handleSelection = (variant: VariantValue) => {
    setSelectedVariant(variant)
    if (onSelectionChange) {
      onSelectionChange(variant)
    }
  }

  const getSubscriptionIcon = (type: string | null | undefined) => {
    switch (type) {
      case 'personal':
        return <User className="w-5 h-5" />
      case 'gift':
        return <Gift className="w-5 h-5" />
      case 'trial':
        return <Zap className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getSubscriptionTypeLabel = (type: string | null | undefined) => {
    switch (type) {
      case 'personal':
        return 'Persoonlijk'
      case 'gift':
        return 'Cadeau'
      case 'trial':
        return 'Proef'
      default:
        return 'Abonnement'
    }
  }

  const calculatePrice = (variant: VariantValue) => {
    const basePrice = product.price || 0
    const modifier = variant.priceModifier || 0
    return basePrice + modifier
  }

  const calculateDiscountedPrice = (variant: VariantValue) => {
    const fullPrice = calculatePrice(variant)
    if (variant.discountPercentage && variant.discountPercentage > 0) {
      return fullPrice * (1 - variant.discountPercentage / 100)
    }
    return fullPrice
  }

  return (
    <div className="space-y-6">
      {/* Magazine Title Header */}
      {product.magazineTitle && (
        <div className="text-center py-4 bg-gradient-to-r from-teal to-teal-400 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {product.magazineTitle}
          </h2>
          <p className="text-white/80 mt-1">
            Kies uw abonnement
          </p>
        </div>
      )}

      {/* Subscription Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-navy">
          ℹ️ Dit is een abonnementsproduct. U ontvangt meerdere edities gedurende de looptijd van uw abonnement.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionVariants.map((variant) => {
          const isSelected = selectedVariant?.value === variant.value
          const fullPrice = calculatePrice(variant)
          const discountedPrice = calculateDiscountedPrice(variant)
          const hasDiscount = variant.discountPercentage && variant.discountPercentage > 0
          const isPopular = variant.subscriptionType === 'personal' // Personal is usually most popular

          return (
            <button
              key={variant.value}
              onClick={() => handleSelection(variant)}
              className={`
                relative p-6 rounded-xl border-2 text-left transition-all
                ${isSelected
                  ? 'border-teal bg-teal-50 shadow-lg scale-105'
                  : 'border-grey-light bg-white hover:border-teal-400 hover:shadow-md'
                }
                ${isPopular && !isSelected ? 'ring-2 ring-teal-200' : ''}
              `}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal text-white text-xs font-bold rounded-full">
                  POPULAIR
                </div>
              )}

              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-teal rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Type Icon & Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`${isSelected ? 'text-teal' : 'text-grey-dark'}`}>
                  {getSubscriptionIcon(variant.subscriptionType)}
                </div>
                <h3 className="text-lg font-bold text-navy">
                  {getSubscriptionTypeLabel(variant.subscriptionType)}
                </h3>
              </div>

              {/* Variant Label */}
              <p className="text-sm text-grey-dark mb-4">
                {variant.label}
              </p>

              {/* Issues Count */}
              {variant.issues && (
                <div className="mb-4 pb-4 border-b border-grey-light">
                  <p className="text-2xl font-bold text-navy">
                    {variant.issues} edities
                  </p>
                  <p className="text-xs text-grey-mid">
                    per abonnement
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-1 mb-4">
                {hasDiscount && (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-navy">
                        €{formatPriceStr(discountedPrice, product.taxClass as any)}
                      </span>
                      <span className="text-lg text-grey-mid line-through">
                        €{formatPriceStr(fullPrice, product.taxClass as any)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-green">
                      Bespaar {variant.discountPercentage}%
                    </p>
                  </>
                )}
                {!hasDiscount && (
                  <div className="text-2xl font-bold text-navy">
                    €{formatPriceStr(fullPrice, product.taxClass as any)}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-grey-dark">
                  <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                  <span>{variant.issues} edities per jaar</span>
                </li>
                {variant.autoRenew && (
                  <li className="flex items-start gap-2 text-sm text-grey-dark">
                    <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                    <span>Automatisch verlengd</span>
                  </li>
                )}
                {!variant.autoRenew && (
                  <li className="flex items-start gap-2 text-sm text-grey-dark">
                    <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                    <span>Eenmalig abonnement</span>
                  </li>
                )}
                {variant.subscriptionType === 'gift' && (
                  <li className="flex items-start gap-2 text-sm text-grey-dark">
                    <Gift className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>Inclusief cadeaukaart</span>
                  </li>
                )}
              </ul>

              {/* Stock Status */}
              {variant.stockLevel !== undefined && variant.stockLevel !== null && (
                <div className="text-xs">
                  {variant.stockLevel > 0 ? (
                    <span className="text-green">
                      ✓ Beschikbaar
                    </span>
                  ) : (
                    <span className="text-coral">
                      ✗ Uitverkocht
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedVariant && (
        <div className="bg-grey-light rounded-lg p-4 border border-grey-light">
          <h4 className="font-semibold text-navy mb-2">
            Uw keuze:
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grey-dark">
                {getSubscriptionTypeLabel(selectedVariant.subscriptionType)} - {selectedVariant.label}
              </p>
              <p className="text-xs text-grey-mid">
                {selectedVariant.issues} edities
                {selectedVariant.autoRenew ? ' (automatisch verlengd)' : ' (eenmalig)'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-navy">
                €{formatPriceStr(calculateDiscountedPrice(selectedVariant), product.taxClass as any)}
              </p>
              {selectedVariant.discountPercentage && selectedVariant.discountPercentage > 0 && (
                <p className="text-xs text-green">
                  Bespaar {selectedVariant.discountPercentage}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
