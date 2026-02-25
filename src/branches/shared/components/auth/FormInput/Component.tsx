'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { FormInputProps } from './types'

export const FormInput: React.FC<FormInputProps> = ({
  label,
  leftIcon,
  showPasswordToggle,
  error,
  helperText,
  type = 'text',
  className = '',
  ...inputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const inputType = showPasswordToggle && type === 'password'
    ? (isPasswordVisible ? 'text' : 'password')
    : type

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}

      <div className={leftIcon || showPasswordToggle ? 'form-input-icon' : ''}>
        {leftIcon && (
          <span className="icon-left">
            {leftIcon}
          </span>
        )}

        <input
          {...inputProps}
          type={inputType}
          className={`form-input ${error ? 'error' : ''} ${className}`}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="toggle-pw"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
          >
            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && (
        <span className="form-error">{error}</span>
      )}

      {helperText && !error && (
        <span className="form-helper-text">{helperText}</span>
      )}
    </div>
  )
}

export default FormInput
