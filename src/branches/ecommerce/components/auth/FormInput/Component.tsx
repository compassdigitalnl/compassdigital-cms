'use client'

/**
 * FormInput - Reusable form input component with validation
 *
 * Features:
 * - Label with optional required asterisk
 * - Focus state (teal border + glow)
 * - Error state (red border + error message)
 * - Helper text support
 * - Icon support (left icon)
 * - Password toggle (show/hide)
 * - Disabled state
 *
 * @component
 * @example
 * <FormInput
 *   type="email"
 *   label="E-mailadres"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   icon="mail"
 *   required
 * />
 */

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Phone, User, Building, Hash } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  mail: Mail,
  lock: Lock,
  phone: Phone,
  user: User,
  building: Building,
  hash: Hash,
}

export interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  icon?: string // Lucide icon name
  showPasswordToggle?: boolean // Auto-enabled for type="password"
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
  id?: string
  name?: string
}

export function FormInput({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  showPasswordToggle = type === 'password',
  autoComplete,
  minLength,
  maxLength,
  pattern,
  className = '',
  id,
  name,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Get icon component
  const IconComponent = icon ? iconMap[icon] : null

  // Determine input type (handle password visibility toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Generate unique ID if not provided
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={`mb-[18px] ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-semibold mb-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {IconComponent && (
          <div
            className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          name={name || inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          className={`
            w-full py-3 px-[14px] rounded-lg text-sm font-medium transition-all outline-none
            ${IconComponent ? 'pl-[42px]' : ''}
            ${showPasswordToggle && type === 'password' ? 'pr-[42px]' : ''}
            ${error ? 'border-red-500' : 'border-[1.5px]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-surface)',
            borderColor: error
              ? '#EF4444'
              : isFocused
              ? 'var(--color-primary)'
              : 'var(--color-border)',
            boxShadow: isFocused && !error ? '0 0 0 3px var(--color-primary-glow)' : 'none',
          }}
        />

        {/* Password Toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs mt-1.5 text-red-500 font-medium">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p
          className="text-xs mt-1.5 font-medium"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}
