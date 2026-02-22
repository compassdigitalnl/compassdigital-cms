'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/payload-types'
import { Check } from 'lucide-react'

type VariantOption = NonNullable<Product['variantOptions']>[number]
type VariantValue = NonNullable<VariantOption['values']>[number]

interface VariantSelectorProps {
  product: Product
  onSelectionChange?: (selections: Record<string, VariantValue>) => void
}

export function VariantSelector({ product, onSelectionChange }: VariantSelectorProps) {
  const [selections, setSelections] = useState<Record<string, VariantValue>>({})

  const variantOptions = product.variantOptions || []

  // Calculate total price with modifiers
  const calculateTotalPrice = () => {
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

  const handleSelection = (optionName: string, value: VariantValue) => {
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
      {variantOptions.map((option) => {
        const currentSelection = selections[option.optionName || '']

        return (
          <div key={option.optionName} className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">
              {option.optionName}
              {currentSelection && (
                <span className="ml-2 text-gray-500 font-normal">
                  - {currentSelection.label}
                </span>
              )}
            </label>

            {/* Color Swatches */}
            {option.displayType === 'colorSwatch' && (
              <div className="flex flex-wrap gap-2">
                {option.values?.map((value) => (
                  <button
                    key={value.value}
                    onClick={() => handleSelection(option.optionName || '', value)}
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
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
                {option.values?.map((value) => (
                  <button
                    key={value.value}
                    onClick={() => handleSelection(option.optionName || '', value)}
                    className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
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
                  const value = option.values?.find(v => v.value === e.target.value)
                  if (value) handleSelection(option.optionName || '', value)
                }}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecteer {option.optionName}</option>
                {option.values?.map((value) => (
                  <option
                    key={value.value}
                    value={value.value}
                    disabled={value.stockLevel === 0}
                  >
                    {value.label}
                    {value.priceModifier && value.priceModifier > 0 ? ` (+€${value.priceModifier.toFixed(2)})` : ''}
                    {value.stockLevel === 0 ? ' (Uitverkocht)' : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Image Radio */}
            {option.displayType === 'imageRadio' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {option.values?.map((value) => {
                  const imageUrl = typeof value.image === 'object' && value.image?.url ? value.image.url : null

                  return (
                    <button
                      key={value.value}
                      onClick={() => handleSelection(option.optionName || '', value)}
                      className={`
                        relative aspect-square rounded-lg border-2 overflow-hidden transition-all
                        ${currentSelection?.value === value.value
                          ? 'border-blue-600 ring-2 ring-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
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
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          {value.label}
                        </div>
                      )}
                      {currentSelection?.value === value.value && (
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-10 flex items-center justify-center">
                          <Check className="w-6 h-6 text-blue-600 drop-shadow-md" />
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
                {option.values?.map((value) => (
                  <label
                    key={value.value}
                    className={`
                      flex items-center p-3 border rounded-lg cursor-pointer transition-all
                      ${currentSelection?.value === value.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
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
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 flex-1">
                      {value.label}
                      {value.priceModifier && value.priceModifier > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          +€{value.priceModifier.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Stock indicator */}
            {currentSelection && currentSelection.stockLevel !== undefined && (
              <p className="text-sm text-gray-600">
                {currentSelection.stockLevel > 0 ? (
                  <span className="text-green-600">
                    ✓ Op voorraad ({currentSelection.stockLevel} beschikbaar)
                  </span>
                ) : (
                  <span className="text-red-600">
                    ✗ Uitverkocht
                  </span>
                )}
              </p>
            )}
          </div>
        )
      })}

      {/* Configuration Summary */}
      {product.configuratorSettings?.showConfigSummary && Object.keys(selections).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Uw configuratie:
          </h3>
          <ul className="space-y-1">
            {Object.entries(selections).map(([optionName, value]) => (
              <li key={optionName} className="text-sm text-gray-700">
                <span className="font-medium">{optionName}:</span> {value.label}
                {value.priceModifier && value.priceModifier > 0 && (
                  <span className="text-gray-500 ml-1">
                    (+€{value.priceModifier.toFixed(2)})
                  </span>
                )}
              </li>
            ))}
          </ul>
          {product.configuratorSettings?.showPriceBreakdown && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex justify-between text-sm">
                <span>Basisprijs:</span>
                <span>€{(product.price || 0).toFixed(2)}</span>
              </div>
              {Object.values(selections).map((value) =>
                value.priceModifier && value.priceModifier > 0 ? (
                  <div key={value.value} className="flex justify-between text-sm text-gray-600">
                    <span>{value.label}:</span>
                    <span>+€{value.priceModifier.toFixed(2)}</span>
                  </div>
                ) : null
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-300">
                <span>Totaal:</span>
                <span>€{calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
