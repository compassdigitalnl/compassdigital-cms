/**
 * PersonalizationTextInput Component (PP01)
 *
 * Text input for personalized products (names, messages, custom text).
 * Shows character counter and validation.
 *
 * Features:
 * - Real-time character counter
 * - Max length validation
 * - Helper text support
 * - Required field indicator
 * - Accessible labels
 *
 * @category E-commerce / Product Types / Personalized
 * @component PP01
 */

'use client'

import React from 'react'
import type { PersonalizationTextInputProps } from './types'

export const PersonalizationTextInput: React.FC<PersonalizationTextInputProps> = ({
  value,
  onChange,
  maxLength = 50,
  placeholder,
  label = 'Personalisatie tekst',
  helperText,
  required = false,
  className = '',
}) => {
  const remaining = maxLength - value.length
  const isNearLimit = remaining <= 10

  return (
    <div className={`personalization-text-input ${className}`}>
      {/* Label */}
      <label className="block text-sm font-semibold text-navy mb-2">
        {label}
        {required && <span className="text-coral ml-1">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
            ${value ? 'border-[var(--color-primary-light)] bg-[var(--color-primary-glow)]/30' : 'border-grey-light bg-white'}
            ${remaining === 0 ? 'border-red-300' : ''}
            text-navy placeholder:text-grey-mid
          `}
          aria-label={label}
          aria-describedby={helperText ? 'helper-text' : undefined}
        />

        {/* Character Counter */}
        <div
          className={`
            absolute right-3 top-1/2 -translate-y-1/2
            text-xs font-medium transition-colors
            ${isNearLimit ? 'text-amber-600' : 'text-grey-mid'}
            ${remaining === 0 ? 'text-coral' : ''}
          `}
          aria-live="polite"
        >
          {remaining}/{maxLength}
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p id="helper-text" className="mt-2 text-xs text-grey-dark">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default PersonalizationTextInput
