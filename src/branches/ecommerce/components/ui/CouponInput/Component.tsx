/**
 * CouponInput Component
 *
 * Input field with submit button for applying discount/coupon codes.
 * Includes validation, loading states, error/success feedback, and
 * applied coupon display.
 *
 * Features:
 * - Text input with placeholder
 * - Submit button ("Toepassen" = Apply)
 * - Loading state with spinner during validation
 * - Error feedback (red border + message)
 * - Success feedback (applied coupon display)
 * - Applied coupon card with code, discount amount, and remove button
 * - Auto-uppercase formatting (optional)
 *
 * States:
 * - Default: Empty input + apply button
 * - Loading: Disabled input + button with spinner
 * - Error: Red border on input + error message
 * - Applied: Shows applied coupon card
 *
 * @category E-commerce
 * @component EC08
 */

'use client'

import React, { useState, FormEvent } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import type { CouponInputProps } from './types'

export function CouponInput({
  appliedCoupon,
  isLoading = false,
  errorMessage,
  currencySymbol = '€',
  onApply,
  onRemove,
  placeholder = 'Kortingscode',
  buttonText = 'Toepassen',
  autoUppercase = true,
  className = '',
}: CouponInputProps) {
  const [inputValue, setInputValue] = useState('')

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const code = autoUppercase ? inputValue.toUpperCase() : inputValue

    if (!code.trim()) return

    await onApply(code)
  }

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(autoUppercase ? value.toUpperCase() : value)
  }

  // Format price
  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2).replace('.', ',')
    return `${currencySymbol} ${formatted}`
  }

  // If coupon is applied, show applied state
  if (appliedCoupon) {
    return (
      <div className={`coupon-applied ${className}`}>
        <div className="coupon-applied__left">
          <CheckCircle size={16} />
          <div className="coupon-applied__text">
            <span className="coupon-applied__code">{appliedCoupon.code}</span>
            <span className="coupon-applied__discount">
              −{formatPrice(appliedCoupon.discountAmount)} korting toegepast
            </span>
          </div>
        </div>
        {onRemove && (
          <button
            className="coupon-applied__remove"
            onClick={onRemove}
            aria-label="Verwijder kortingscode"
          >
            <X size={16} />
          </button>
        )}

        <style jsx>{`
          .coupon-applied {
            background: rgba(0, 200, 83, 0.06);
            border: 1px solid #e8f5e9;
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .coupon-applied__left {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
          }

          .coupon-applied__left :global(svg) {
            color: var(--green);
            flex-shrink: 0;
          }

          .coupon-applied__text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .coupon-applied__code {
            font-size: 13px;
            font-weight: 600;
            color: var(--navy);
            font-family: var(--font-mono);
          }

          .coupon-applied__discount {
            font-size: 12px;
            color: var(--green);
          }

          .coupon-applied__remove {
            background: none;
            border: none;
            color: var(--grey-dark);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color var(--transition);
          }

          .coupon-applied__remove:hover {
            color: var(--coral);
          }
        `}</style>
      </div>
    )
  }

  // Otherwise, show input form
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="coupon-input">
        <input
          type="text"
          className={`coupon-input__field ${errorMessage ? 'coupon-input__field--error' : ''}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isLoading}
          aria-label={placeholder}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? 'coupon-error' : undefined}
        />
        <button
          type="submit"
          className={`coupon-input__btn ${isLoading ? 'coupon-input__btn--loading' : ''}`}
          disabled={isLoading || !inputValue.trim()}
        >
          {buttonText}
        </button>
      </form>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="coupon-feedback coupon-feedback--error" id="coupon-error" role="alert">
          <XCircle size={14} />
          {errorMessage}
        </div>
      )}

      <style jsx>{`
        .coupon-input {
          display: flex;
          gap: 8px;
        }

        .coupon-input__field {
          flex: 1;
          padding: 12px 14px;
          border: 1.5px solid var(--grey);
          border-radius: 10px;
          font-family: var(--font-primary);
          font-size: 14px;
          color: var(--navy);
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
          background: var(--white);
        }

        .coupon-input__field::placeholder {
          color: var(--grey-mid);
        }

        .coupon-input__field:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.12);
        }

        .coupon-input__field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .coupon-input__field--error {
          border-color: var(--coral);
        }

        .coupon-input__btn {
          padding: 12px 18px;
          background: var(--bg);
          border: 1.5px solid var(--grey);
          border-radius: 10px;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition);
        }

        .coupon-input__btn:hover:not(:disabled) {
          border-color: var(--teal);
          color: var(--teal);
          background: var(--white);
        }

        .coupon-input__btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .coupon-input__btn--loading {
          position: relative;
          color: transparent;
        }

        .coupon-input__btn--loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid var(--grey);
          border-top-color: var(--teal);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .coupon-feedback {
          margin-top: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .coupon-feedback--error {
          color: var(--coral);
        }

        .coupon-feedback :global(svg) {
          flex-shrink: 0;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .coupon-input__field {
            padding: 10px 12px;
            font-size: 13px;
          }

          .coupon-input__btn {
            padding: 10px 14px;
            font-size: 13px;
          }

          .coupon-feedback {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
