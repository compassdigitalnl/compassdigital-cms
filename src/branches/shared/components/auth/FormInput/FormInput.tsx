'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import styles from './FormInput.module.css'

export interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  value: string | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  icon?: string // Lucide icon name
  leftIcon?: React.ReactNode // Alternative: pass icon element directly
  showPasswordToggle?: boolean // Auto-enabled for type="password"
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
  id?: string
  name?: string
}

export const FormInput: React.FC<FormInputProps> = ({
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
  leftIcon,
  showPasswordToggle,
  autoComplete,
  minLength,
  maxLength,
  pattern,
  className = '',
  id,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-enable password toggle for password inputs
  const enablePasswordToggle = showPasswordToggle !== false && type === 'password'

  // Determine actual input type (toggle between password/text for password fields)
  const inputType = enablePasswordToggle && showPassword ? 'text' : type

  // Get Lucide icon component (support both icon string and leftIcon element)
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ size?: number }>) || null
    : null

  const inputId = id || `input-${name || label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={`${styles.formGroup} ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`${styles.inputWrapper} ${error ? styles.hasError : ''} ${isFocused ? styles.isFocused : ''} ${disabled ? styles.isDisabled : ''}`}
      >
        {/* Left icon */}
        {(IconComponent || leftIcon) && (
          <div className={styles.iconLeft}>
            {leftIcon ? leftIcon : IconComponent && <IconComponent size={18} />}
          </div>
        )}

        {/* Input field */}
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          className={`${styles.formInput} ${IconComponent ? styles.hasLeftIcon : ''} ${enablePasswordToggle ? styles.hasRightIcon : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        />

        {/* Password toggle button */}
        {enablePasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <div id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  )
}
