'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import type { PersonalizationColorPickerProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * PP03: PersonalizationColorPicker
 *
 * Color swatches or picker for text color, thread color, etc.
 * Features:
 * - Grid of preset color swatches
 * - Hex input for custom colors
 * - Visual checkmark on selected color
 * - Optional price modifiers per color
 * - Responsive grid layout
 */

const DEFAULT_PRESET_COLORS = [
  { value: '#000000', label: 'Zwart' },
  { value: '#FFFFFF', label: 'Wit' },
  { value: '#FF0000', label: 'Rood' },
  { value: '#00FF00', label: 'Groen' },
  { value: '#0000FF', label: 'Blauw' },
  { value: '#FFFF00', label: 'Geel' },
  { value: '#FFA500', label: 'Oranje' },
  { value: '#800080', label: 'Paars' },
  { value: '#FFC0CB', label: 'Roze' },
  { value: '#A52A2A', label: 'Bruin' },
  { value: '#808080', label: 'Grijs' },
  { value: '#FFD700', label: 'Goud' },
]

export const PersonalizationColorPicker: React.FC<PersonalizationColorPickerProps> = ({
  option,
  value,
  onChange,
  presetColors,
  className = '',
}) => {
  const [customHex, setCustomHex] = useState('')
  const { formatPriceStr } = usePriceMode()

  // Build color options
  const colorOptions = presetColors
    ? presetColors.map((color) => ({ value: color, label: color }))
    : DEFAULT_PRESET_COLORS

  // Check if value is in preset colors
  const isPresetColor = colorOptions.some((c) => c.value === value)

  // Price modifier display
  const priceText = option.priceModifier
    ? option.priceModifier > 0
      ? ` (+€${formatPriceStr(option.priceModifier)})`
      : ` (€${formatPriceStr(option.priceModifier)})`
    : ''

  // Handle custom hex input
  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value
    // Auto-add # if missing
    if (hex && !hex.startsWith('#')) {
      hex = '#' + hex
    }
    setCustomHex(hex)

    // Validate hex color (3 or 6 digits)
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
      onChange(hex)
    }
  }

  // Handle preset color selection
  const handlePresetColorSelect = (color: string) => {
    onChange(color)
    setCustomHex('')
  }

  return (
    <div className={`personalization-color-picker ${className}`}>
      {/* Label */}
      <label className="block mb-2">
        <span className="text-[15px] font-bold text-gray-900">
          {option.fieldName}
          {option.required && <span className="text-coral ml-1">*</span>}
        </span>
        {priceText && (
          <span className="text-[13px] text-[var(--color-primary)] font-semibold ml-2">{priceText}</span>
        )}
      </label>

      {/* Preset Color Swatches */}
      <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mb-3">
        {colorOptions.map((color) => {
          const isSelected = value === color.value
          const isDark = color.value === '#000000' || color.value.toLowerCase() === '#000'
          const isLight = color.value === '#FFFFFF' || color.value.toLowerCase() === '#fff'

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => handlePresetColorSelect(color.value)}
              className={`
                relative w-12 h-12 rounded-lg border-2 transition-all duration-200
                ${isSelected ? 'border-[var(--color-primary)] scale-110' : 'border-gray-300 hover:border-[var(--color-primary-light)]'}
                ${isLight ? 'border-gray-400' : ''}
              `}
              style={{ backgroundColor: color.value }}
              title={color.label}
              aria-label={`Selecteer kleur ${color.label}`}
              aria-pressed={isSelected}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-white' : 'bg-black'}`}>
                    <Check className={`w-4 h-4 ${isDark ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Custom Hex Input */}
      <div className="mt-4">
        <label className="block mb-1 text-[13px] font-semibold text-gray-700">
          Of voer een custom hex kleur in:
        </label>
        <div className="flex items-center gap-2">
          {/* Color Preview */}
          {customHex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(customHex) && (
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0"
              style={{ backgroundColor: customHex }}
            />
          )}

          {/* Hex Input */}
          <input
            type="text"
            value={customHex}
            onChange={handleCustomHexChange}
            placeholder="#000000"
            maxLength={7}
            className="flex-1 px-3 py-2 text-[14px] font-mono border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <p className="text-[11px] text-gray-500 mt-1">
          Formaat: #RRGGBB (bijv. #FF5733)
        </p>
      </div>

      {/* Helper Text */}
      {!option.required && (
        <p className="text-[12px] text-gray-500 mt-2">Optioneel</p>
      )}
    </div>
  )
}
