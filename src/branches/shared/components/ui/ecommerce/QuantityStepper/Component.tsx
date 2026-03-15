/**
 * QuantityStepper (c23)
 *
 * A numeric input control with increment/decrement buttons for selecting product quantities.
 * Features 3 size variants and optional rounded styling.
 *
 * @category UI Components
 * @subcategory E-commerce / Form Controls
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { QuantityStepperProps } from './types'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'md',
  rounded = false,
  disabled = false,
  ariaLabel = 'Quantity',
  className = '',
}: QuantityStepperProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync local value when prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  /**
   * Handle increment/decrement button clicks
   */
  const handleStep = (delta: number) => {
    const newValue = Math.max(min, Math.min(max, localValue + delta))
    setLocalValue(newValue)
    onChange(newValue)
  }

  /**
   * Handle direct input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Allow empty value while typing
    if (inputValue === '') {
      setLocalValue(min)
      return
    }

    const parsedValue = parseInt(inputValue, 10)

    // Validate and clamp value
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(min, Math.min(max, parsedValue))
      setLocalValue(clampedValue)
    }
  }

  /**
   * Handle input blur - finalize value
   */
  const handleBlur = () => {
    // Ensure value is within range
    const finalValue = Math.max(min, Math.min(max, localValue))
    setLocalValue(finalValue)
    onChange(finalValue)
  }

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleStep(1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleStep(-1)
    }
  }

  // Check if buttons should be disabled
  const isDecrementDisabled = disabled || localValue <= min
  const isIncrementDisabled = disabled || localValue >= max

  return (
    <div
      className={`qty-stepper qty-${size} ${rounded ? 'qty-rounded' : ''} ${className}`}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={() => handleStep(-1)}
        disabled={isDecrementDisabled}
        aria-label="Decrease quantity"
        className="qty-btn qty-btn-decrement"
      >
        <Minus size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2.5} />
      </button>

      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={localValue}
        className="qty-input"
      />

      <button
        type="button"
        onClick={() => handleStep(1)}
        disabled={isIncrementDisabled}
        aria-label="Increase quantity"
        className="qty-btn qty-btn-increment"
      >
        <Plus size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2.5} />
      </button>

      <style jsx>{`
        /* Base stepper structure */
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--white);
          transition: var(--transition);
        }

        .qty-stepper:focus-within {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Buttons */
        .qty-btn {
          border: none;
          background: var(--bg);
          cursor: pointer;
          color: var(--navy);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          user-select: none;
          padding: 0;
        }

        .qty-btn:hover:not(:disabled) {
          background: var(--teal-glow);
          color: var(--teal);
        }

        .qty-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Input */
        .qty-input {
          border: none;
          text-align: center;
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--navy);
          outline: none;
          background: var(--white);
          -moz-appearance: textfield;
        }

        .qty-input::-webkit-inner-spin-button,
        .qty-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .qty-input:focus {
          background: var(--teal-glow);
          color: var(--teal);
        }

        .qty-input:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* SIZE VARIANT: Small */
        .qty-stepper.qty-sm .qty-btn {
          width: 30px;
          height: 36px;
        }

        .qty-stepper.qty-sm .qty-input {
          width: 32px;
          height: 36px;
          font-size: 13px;
        }

        /* SIZE VARIANT: Medium (default) */
        .qty-stepper.qty-md .qty-btn {
          width: 36px;
          height: 40px;
        }

        .qty-stepper.qty-md .qty-input {
          width: 44px;
          height: 40px;
          font-size: 15px;
        }

        /* SIZE VARIANT: Large */
        .qty-stepper.qty-lg .qty-btn {
          width: 42px;
          height: 48px;
        }

        .qty-stepper.qty-lg .qty-input {
          width: 52px;
          height: 48px;
          font-size: 17px;
        }

        /* ROUNDED VARIANT (pill-style) */
        .qty-stepper.qty-rounded {
          border-radius: 100px;
        }
      `}</style>
    </div>
  )
}

export default QuantityStepper
