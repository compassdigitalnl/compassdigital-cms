'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/payload-types'
import { Check } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

interface VariantOptionValue {
  label: string
  value: string
  colorCode?: string | null
  image?: { url?: string; alt?: string } | number | null
  priceModifier?: number | null
  stockLevel?: number | null
}

interface VariantOptionGroup {
  optionName?: string | null
  displayType?: 'colorSwatch' | 'sizeRadio' | 'dropdown' | 'imageRadio' | 'checkbox' | null
  values?: VariantOptionValue[] | null
}

type ExtendedProduct = Product & {
  variantOptions?: VariantOptionGroup[]
  configuratorSettings?: {
    showConfigSummary?: boolean
    showPriceBreakdown?: boolean
  }
}

interface VariantSelectorProps {
  product: Product
  onSelectionChange?: (selections: Record<string, VariantOptionValue>) => void
}

export function VariantSelector({ product, onSelectionChange }: VariantSelectorProps) {
  const [selections, setSelections] = useState<Record<string, VariantOptionValue>>({})
  const { displayPrice, formatPriceStr } = usePriceMode()

  const extProduct = product as ExtendedProduct
  const variantOptions = extProduct.variantOptions || []

  // Calculate total price with modifiers (excl. VAT base)
  const calculateTotalPriceExcl = () => {
    let total = product.price || 0
    Object.values(selections).forEach((value) => {
      if (value.priceModifier) {
        total += value.priceModifier
      }
    })
    return total
  }

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selections)
    }
  }, [selections, onSelectionChange])

  const handleSelection = (optionName: string, value: VariantOptionValue) => {
    setSelections(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  if (!variantOptions || variantOptions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {variantOptions.map((option: VariantOptionGroup) => {
        const currentSelection = selections[option.optionName || '']

        return (
          <div key={option.optionName} className="space-y-3">
            <label className="text-sm font-semibold text-navy">
              {option.optionName}
              {currentSelection && (
                <span className="ml-2 text-grey-mid font-normal">
                  - {currentSelection.label}
                </span>
              )}
            </label>

            {/* Color Swatches */}
            {option.displayType === 'colorSwatch' && (
              <div className="flex flex-wrap gap-2">
                {option.values?.map((value: VariantOptionValue) => (
                  <button
                    key={value.value}
                    onClick={() => handleSelection(option.optionName || '', value)}
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-teal ring-2 ring-teal ring-offset-2'
                        : 'border-grey-light hover:border-grey-light'
                      }
                      ${value.stockLevel === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={{ backgroundColor: value.colorCode || '#ccc' }}
                    disabled={value.stockLevel === 0}
                    title={`${value.label}${value.stockLevel === 0 ? ' (Uitverkocht)' : ''}`}
                  >
                    {currentSelection?.value === value.value && (
                      <Check className="w-5 h-5 absolute inset-0 m-auto text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Size Radio Buttons */}
            {option.displayType === 'sizeRadio' && (
              <div className="flex flex-wrap gap-2">
                {option.values?.map((value: VariantOptionValue) => (
                  <button
                    key={value.value}
                    onClick={() => handleSelection(option.optionName || '', value)}
                    className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-teal bg-teal-50 text-teal-700'
                        : 'border-grey-light bg-white text-grey-dark hover:border-grey-light'
                      }
                      ${value.stockLevel === 0 ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}
                    `}
                    disabled={value.stockLevel === 0}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            )}

            {/* Dropdown */}
            {option.displayType === 'dropdown' && (
              <select
                value={currentSelection?.value || ''}
                onChange={(e) => {
                  const value = option.values?.find((v: VariantOptionValue) => v.value === e.target.value)
                  if (value) handleSelection(option.optionName || '', value)
                }}
                className="w-full md:w-64 px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-teal"
              >
                <option value="">Selecteer {option.optionName}</option>
                {option.values?.map((value: VariantOptionValue) => (
                  <option
                    key={value.value}
                    value={value.value}
                    disabled={value.stockLevel === 0}
                  >
                    {value.label}
                    {value.priceModifier && value.priceModifier > 0 ? ` (+€${formatPriceStr(value.priceModifier, product.taxClass ?? undefined)})` : ''}
                    {value.stockLevel === 0 ? ' (Uitverkocht)' : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Image Radio */}
            {option.displayType === 'imageRadio' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {option.values?.map((value: VariantOptionValue) => {
                  const imageUrl = typeof value.image === 'object' && value.image?.url ? value.image.url : null

                  return (
                    <button
                      key={value.value}
                      onClick={() => handleSelection(option.optionName || '', value)}
                      className={`
                        relative aspect-square rounded-lg border-2 overflow-hidden transition-all
                        ${currentSelection?.value === value.value
                          ? 'border-teal ring-2 ring-teal'
                          : 'border-grey-light hover:border-grey-light'
                        }
                        ${value.stockLevel === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      disabled={value.stockLevel === 0}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={value.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-grey-light flex items-center justify-center text-xs text-grey-mid">
                          {value.label}
                        </div>
                      )}
                      {currentSelection?.value === value.value && (
                        <div className="absolute inset-0 bg-teal bg-opacity-10 flex items-center justify-center">
                          <Check className="w-6 h-6 text-teal drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Checkbox Add-ons */}
            {option.displayType === 'checkbox' && (
              <div className="space-y-2">
                {option.values?.map((value: VariantOptionValue) => (
                  <label
                    key={value.value}
                    className={`
                      flex items-center p-3 border rounded-lg cursor-pointer transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-teal bg-teal-50'
                        : 'border-grey-light hover:border-grey-light'
                      }
                      ${value.stockLevel === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={currentSelection?.value === value.value}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelection(option.optionName || '', value)
                        } else {
                          setSelections(prev => {
                            const newSelections = { ...prev }
                            delete newSelections[option.optionName || '']
                            return newSelections
                          })
                        }
                      }}
                      disabled={value.stockLevel === 0}
                      className="w-4 h-4 text-teal rounded focus:ring-teal"
                    />
                    <span className="ml-3 flex-1">
                      {value.label}
                      {value.priceModifier && value.priceModifier > 0 && (
                        <span className="ml-2 text-sm text-grey-mid">
                          +€{formatPriceStr(value.priceModifier, product.taxClass ?? undefined)}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Stock indicator */}
            {currentSelection && currentSelection.stockLevel !== undefined && currentSelection.stockLevel !== null && (
              <p className="text-sm text-grey-dark">
                {currentSelection.stockLevel > 0 ? (
                  <span className="text-green">
                    ✓ Op voorraad ({currentSelection.stockLevel} beschikbaar)
                  </span>
                ) : (
                  <span className="text-coral">
                    ✗ Uitverkocht
                  </span>
                )}
              </p>
            )}
          </div>
        )
      })}

      {/* Configuration Summary */}
      {extProduct.configuratorSettings?.showConfigSummary && Object.keys(selections).length > 0 && (
        <div className="mt-6 p-4 bg-grey-light rounded-lg border border-grey-light">
          <h3 className="text-sm font-semibold text-navy mb-2">
            Uw configuratie:
          </h3>
          <ul className="space-y-1">
            {Object.entries(selections).map(([optionName, value]) => (
              <li key={optionName} className="text-sm text-grey-dark">
                <span className="font-medium">{optionName}:</span> {value.label}
                {value.priceModifier && value.priceModifier > 0 && (
                  <span className="text-grey-mid ml-1">
                    (+€{formatPriceStr(value.priceModifier, product.taxClass ?? undefined)})
                  </span>
                )}
              </li>
            ))}
          </ul>
          {extProduct.configuratorSettings?.showPriceBreakdown && (
            <div className="mt-3 pt-3 border-t border-grey-light">
              <div className="flex justify-between text-sm">
                <span>Basisprijs:</span>
                <span>€{formatPriceStr(product.price || 0, product.taxClass ?? undefined)}</span>
              </div>
              {Object.values(selections).map((value) =>
                value.priceModifier && value.priceModifier > 0 ? (
                  <div key={value.value} className="flex justify-between text-sm text-grey-dark">
                    <span>{value.label}:</span>
                    <span>+€{formatPriceStr(value.priceModifier, product.taxClass ?? undefined)}</span>
                  </div>
                ) : null
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-grey-light">
                <span>Totaal:</span>
                <span>€{formatPriceStr(calculateTotalPriceExcl(), product.taxClass ?? undefined)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
