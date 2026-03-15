'use client'

import { useState, useCallback, useMemo } from 'react'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/shared/components/ui/AddToCartToast'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { PersonalizationTextInput } from '../PersonalizationTextInput'
import { PersonalizationFontSelector } from '../PersonalizationFontSelector'
import { PersonalizationColorPicker } from '../PersonalizationColorPicker'
import { PersonalizationImageUpload } from '../PersonalizationImageUpload'
import { PersonalizationLivePreview } from '../PersonalizationLivePreview'
import { PersonalizationSummaryCard } from '../PersonalizationSummaryCard'
import { PersonalizationCharacterLimit } from '../PersonalizationCharacterLimit'
import { PersonalizationProductionTime } from '../PersonalizationProductionTime'
import type {
  PersonalizedContainerProps,
  PersonalizationConfig,
  RawPersonalizationOption,
} from './types'
import type {
  PersonalizationOption,
  PersonalizationSelection,
  PersonalizationValue,
} from '@/branches/ecommerce/shared/lib/product-types'

export function PersonalizedContainer({ product, className = '' }: PersonalizedContainerProps) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const { formatPriceStr } = usePriceMode()

  // Parse personalization config from product data
  const config = useMemo<PersonalizationConfig>(() => {
    const raw = (product as unknown as { personalizationConfig?: PersonalizationConfig }).personalizationConfig
    return raw || {}
  }, [product])

  // Options
  const options = useMemo<PersonalizationOption[]>(() => {
    if (!Array.isArray(config.personalizationOptions) || config.personalizationOptions.length === 0) return []
    return config.personalizationOptions.map((opt: RawPersonalizationOption) => ({
      fieldName: opt.fieldName || '',
      fieldType: opt.fieldType || 'text',
      required: opt.required === true,
      maxLength: opt.maxLength != null ? Number(opt.maxLength) : null,
      priceModifier: opt.priceModifier != null ? Number(opt.priceModifier) : null,
      productionTimeAdded: opt.productionTimeAdded != null ? Number(opt.productionTimeAdded) : null,
    }))
  }, [config.personalizationOptions])

  // Available fonts
  const availableFonts = useMemo(() => {
    if (!Array.isArray(config.availableFonts) || config.availableFonts.length === 0) {
      return ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS']
    }
    return config.availableFonts.map((f) => f.fontName)
  }, [config.availableFonts])

  // Preset colors
  const presetColors = useMemo(() => {
    if (!Array.isArray(config.presetColors) || config.presetColors.length === 0) {
      return ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF69B4', '#8B4513', '#808080', '#C4908A']
    }
    return config.presetColors.map((c) => c.colorCode)
  }, [config.presetColors])

  // State: personalization values per field
  const [values, setValues] = useState<PersonalizationSelection>(() => {
    const initial: PersonalizationSelection = {}
    options.forEach((opt) => {
      initial[opt.fieldName] = { fieldName: opt.fieldName, value: null }
    })
    return initial
  })

  // Rush order
  const [rushEnabled, setRushEnabled] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Update a field value
  const handleFieldChange = useCallback((fieldName: string, value: string | File | null) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: { fieldName, value },
    }))
    // Clear error on change
    setErrors((prev) => ({ ...prev, [fieldName]: null }))
  }, [])

  // Total personalization cost
  const personalizationCost = useMemo(() => {
    return options.reduce((sum, opt) => {
      const val = values[opt.fieldName]
      if (val?.value && opt.priceModifier) {
        return sum + opt.priceModifier
      }
      return sum
    }, 0)
  }, [options, values])

  // Rush fee
  const rushFee = rushEnabled ? Number(config.rushFee) || 25 : 0

  // Total price
  const totalPrice = useMemo(() => {
    const basePrice = Number(product.salePrice || product.price) || 0
    return basePrice + personalizationCost + rushFee
  }, [product, personalizationCost, rushFee])

  // Extra production days
  const extraProductionDays = useMemo(() => {
    return options.reduce((sum, opt) => {
      const val = values[opt.fieldName]
      if (val?.value && opt.productionTimeAdded) {
        return sum + opt.productionTimeAdded
      }
      return sum
    }, 0)
  }, [options, values])

  // Validate all required fields
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {}
    let valid = true

    options.forEach((opt) => {
      if (opt.required) {
        const val = values[opt.fieldName]
        if (!val?.value) {
          newErrors[opt.fieldName] = 'Dit veld is verplicht'
          valid = false
        } else if (opt.fieldType === 'text' && opt.maxLength && typeof val.value === 'string' && val.value.length > opt.maxLength) {
          newErrors[opt.fieldName] = `Maximaal ${opt.maxLength} tekens`
          valid = false
        }
      }
    })

    setErrors(newErrors)
    return valid
  }, [options, values])

  // Is form complete?
  const isComplete = useMemo(() => {
    return options.every((opt) => {
      if (!opt.required) return true
      const val = values[opt.fieldName]
      return val?.value != null && val.value !== ''
    })
  }, [options, values])

  // Add to cart
  const handleAddToCart = useCallback(() => {
    if (!validate()) return

    const personalSummary = options
      .filter((opt) => values[opt.fieldName]?.value)
      .map((opt) => {
        const val = values[opt.fieldName]
        if (opt.fieldType === 'image' && val?.value instanceof File) {
          return `${opt.fieldName}: ${(val.value as File).name}`
        }
        return `${opt.fieldName}: ${val?.value}`
      })
      .join(' | ')

    addItem({
      product,
      quantity: 1,
      personalization: {
        values,
        personalizationCost,
        rushEnabled,
        rushFee,
        totalPrice,
        summary: personalSummary,
      },
    } as Parameters<typeof addItem>[0])

    showToast({ product, quantity: 1 })
  }, [product, values, options, personalizationCost, rushEnabled, rushFee, totalPrice, validate, addItem, showToast])

  // Empty state
  if (options.length === 0) {
    return (
      <div className={`p-6 text-center text-grey-mid ${className}`}>
        <p className="text-sm">Geen personalisatie-opties beschikbaar voor dit product.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Personalization fields */}
      {options.map((opt) => {
        const val = values[opt.fieldName]
        const error = errors[opt.fieldName]

        return (
          <div key={opt.fieldName}>
            {opt.fieldType === 'text' && (
              <>
                <PersonalizationTextInput
                  option={opt}
                  value={typeof val?.value === 'string' ? val.value : ''}
                  onChange={(v) => handleFieldChange(opt.fieldName, v)}
                  error={error}
                />
                {opt.maxLength && (
                  <PersonalizationCharacterLimit
                    currentLength={typeof val?.value === 'string' ? val.value.length : 0}
                    maxLength={opt.maxLength}
                  />
                )}
              </>
            )}

            {opt.fieldType === 'font' && (
              <PersonalizationFontSelector
                option={opt}
                value={typeof val?.value === 'string' ? val.value : ''}
                onChange={(v) => handleFieldChange(opt.fieldName, v)}
                availableFonts={availableFonts}
              />
            )}

            {opt.fieldType === 'color' && (
              <PersonalizationColorPicker
                option={opt}
                value={typeof val?.value === 'string' ? val.value : ''}
                onChange={(v) => handleFieldChange(opt.fieldName, v)}
                presetColors={presetColors}
              />
            )}

            {opt.fieldType === 'image' && (
              <PersonalizationImageUpload
                option={opt}
                value={val?.value instanceof File ? val.value : null}
                onChange={(f) => handleFieldChange(opt.fieldName, f)}
              />
            )}
          </div>
        )
      })}

      {/* Live preview (optioneel per product) */}
      {config.showLivePreview !== false && (
        <PersonalizationLivePreview
          product={product}
          personalization={values}
        />
      )}

      {/* Production time (optioneel per product) */}
      {config.showProductionTime !== false && (
        <PersonalizationProductionTime
          baseProductionDays={Number(config.baseProductionDays) || 5}
          personalizationDays={extraProductionDays}
          rushAvailable={config.rushAvailable === true}
          onRushToggle={setRushEnabled}
        />
      )}

      {/* Summary */}
      <PersonalizationSummaryCard
        personalization={values}
        options={options}
        onEdit={() => {
          const el = document.querySelector('[data-personalization-field]')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }}
      />

      {/* Add to cart button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isComplete}
          className="flex-1 px-6 py-3 rounded-[var(--btn-radius,24px)] text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: isComplete ? 'var(--color-btn-primary-bg, var(--color-primary, #0D4F4F))' : undefined }}
        >
          In winkelwagen — {formatPriceStr(totalPrice)}
        </button>
      </div>
    </div>
  )
}
