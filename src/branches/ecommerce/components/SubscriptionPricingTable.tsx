'use client'

import { useState } from 'react'
import type { Product } from '@/payload-types'
import { Check, Gift, User, Zap } from 'lucide-react'

type VariantValue = NonNullable<NonNullable<Product['variantOptions']>[number]['values']>[number]

interface SubscriptionPricingTableProps {
  product: Product
  onSelectionChange?: (selection: VariantValue | null) => void
}

export function SubscriptionPricingTable({ product, onSelectionChange }: SubscriptionPricingTableProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantValue | null>(null)

  // Get all subscription variants from variant options
  const subscriptionVariants: VariantValue[] = []
  product.variantOptions?.forEach((option) => {
    option.values?.forEach((value) => {
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
        <div className="text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {product.magazineTitle}
          </h2>
          <p className="text-blue-100 mt-1">
            Kies uw abonnement
          </p>
        </div>
      )}

      {/* Subscription Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
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
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                }
                ${isPopular && !isSelected ? 'ring-2 ring-blue-200' : ''}
              `}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  POPULAIR
                </div>
              )}

              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Type Icon & Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                  {getSubscriptionIcon(variant.subscriptionType)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {getSubscriptionTypeLabel(variant.subscriptionType)}
                </h3>
              </div>

              {/* Variant Label */}
              <p className="text-sm text-gray-600 mb-4">
                {variant.label}
              </p>

              {/* Issues Count */}
              {variant.issues && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">
                    {variant.issues} edities
                  </p>
                  <p className="text-xs text-gray-500">
                    per abonnement
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-1 mb-4">
                {hasDiscount && (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        €{discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        €{fullPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      Bespaar {variant.discountPercentage}%
                    </p>
                  </>
                )}
                {!hasDiscount && (
                  <div className="text-2xl font-bold text-gray-900">
                    €{fullPrice.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{variant.issues} edities per jaar</span>
                </li>
                {variant.autoRenew && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Automatisch verlengd</span>
                  </li>
                )}
                {!variant.autoRenew && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Eenmalig abonnement</span>
                  </li>
                )}
                {variant.subscriptionType === 'gift' && (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Gift className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Inclusief cadeaukaart</span>
                  </li>
                )}
              </ul>

              {/* Stock Status */}
              {variant.stockLevel !== undefined && (
                <div className="text-xs">
                  {variant.stockLevel > 0 ? (
                    <span className="text-green-600">
                      ✓ Beschikbaar
                    </span>
                  ) : (
                    <span className="text-red-600">
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
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">
            Uw keuze:
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {getSubscriptionTypeLabel(selectedVariant.subscriptionType)} - {selectedVariant.label}
              </p>
              <p className="text-xs text-gray-500">
                {selectedVariant.issues} edities
                {selectedVariant.autoRenew ? ' (automatisch verlengd)' : ' (eenmalig)'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                €{calculateDiscountedPrice(selectedVariant).toFixed(2)}
              </p>
              {selectedVariant.discountPercentage && selectedVariant.discountPercentage > 0 && (
                <p className="text-xs text-green-600">
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
