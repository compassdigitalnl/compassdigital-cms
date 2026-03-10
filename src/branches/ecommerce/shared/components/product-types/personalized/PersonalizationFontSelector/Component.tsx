'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { PersonalizationFontSelectorProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * PP02: PersonalizationFontSelector
 *
 * Font/style selector with visual previews
 * Features:
 * - Grid of font options with previews
 * - Shows sample text in each font
 * - Radio-style selection (one at a time)
 * - Optional price modifiers per font
 * - Responsive grid layout
 */

const DEFAULT_FONTS = [
  { value: 'Arial', label: 'Arial', style: { fontFamily: 'Arial, sans-serif' } },
  { value: 'Times New Roman', label: 'Times New Roman', style: { fontFamily: 'Times New Roman, serif' } },
  { value: 'Courier New', label: 'Courier New', style: { fontFamily: 'Courier New, monospace' } },
  { value: 'Georgia', label: 'Georgia', style: { fontFamily: 'Georgia, serif' } },
  { value: 'Verdana', label: 'Verdana', style: { fontFamily: 'Verdana, sans-serif' } },
  { value: 'Comic Sans MS', label: 'Comic Sans MS', style: { fontFamily: 'Comic Sans MS, cursive' } },
]

export const PersonalizationFontSelector: React.FC<PersonalizationFontSelectorProps> = ({
  option,
  value,
  onChange,
  availableFonts,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  // Build font options
  const fontOptions = availableFonts
    ? availableFonts.map((font) => ({
        value: font,
        label: font,
        style: { fontFamily: `${font}, sans-serif` },
      }))
    : DEFAULT_FONTS

  // Price modifier display
  const priceText = option.priceModifier
    ? option.priceModifier > 0
      ? ` (+€${formatPriceStr(option.priceModifier)})`
      : ` (€${formatPriceStr(option.priceModifier)})`
    : ''

  return (
    <div className={`personalization-font-selector ${className}`}>
      {/* Label */}
      <label className="block mb-2">
        <span className="text-[15px] font-bold text-gray-900">
          {option.fieldName}
          {option.required && <span className="text-red-600 ml-1">*</span>}
        </span>
        {priceText && (
          <span className="text-[13px] text-[var(--color-primary)] font-semibold ml-2">{priceText}</span>
        )}
      </label>

      {/* Font Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fontOptions.map((font) => {
          const isSelected = value === font.value

          return (
            <button
              key={font.value}
              type="button"
              onClick={() => onChange(font.value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]/20' : 'border-gray-300 bg-white hover:border-[var(--color-primary-light)]'}
              `}
              aria-label={`Selecteer font ${font.label}`}
              aria-pressed={isSelected}
            >
              {/* Checkmark (top-right) */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Font Label */}
              <div className="text-[13px] font-semibold text-gray-900 mb-2">{font.label}</div>

              {/* Font Preview */}
              <div
                className="text-[18px] text-gray-700 truncate"
                style={font.style}
              >
                Voorbeeld
              </div>
            </button>
          )
        })}
      </div>

      {/* Helper Text */}
      {!option.required && (
        <p className="text-[12px] text-gray-500 mt-2">Optioneel</p>
      )}
    </div>
  )
}
