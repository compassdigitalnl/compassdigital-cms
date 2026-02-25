'use client'

import React from 'react'
import { FileText, Info } from 'lucide-react'
import type { PONumberInputProps } from './types'

/**
 * PONumberInput Component
 *
 * B2B purchase order number input field for checkout and quote requests.
 * Uses monospace font with auto-uppercase transformation.
 *
 * @example
 * ```tsx
 * <PONumberInput
 *   value={poNumber}
 *   onChange={(value) => setPoNumber(value)}
 * />
 * ```
 */
export function PONumberInput({
  name = 'poNumber',
  label = 'Referentienummer / PO-nummer',
  placeholder = 'Uw interne referentie voor op de factuur',
  helperText = 'Dit nummer verschijnt op uw factuur en pakbon voor interne administratie.',
  maxLength = 50,
  variant = 'default',
  showIcon = true,
  iconPosition = 'label',
  showB2BBadge = false,
  value = '',
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = '',
}: PONumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase transformation
    const uppercased = e.target.value.toUpperCase()
    if (onChange) {
      onChange(uppercased)
    }
  }

  const inputId = `po-number-${name}`
  const helperId = helperText ? `${inputId}-helper` : undefined

  return (
    <div className={`po-number-group ${variant} ${className}`}>
      {/* Label */}
      <label className="po-label" htmlFor={inputId}>
        {showIcon && iconPosition === 'label' && <FileText size={16} aria-hidden="true" />}
        {label}
        {!required && <span className="optional">(optioneel)</span>}
        {showB2BBadge && <span className="b2b-badge">B2B</span>}
      </label>

      {/* Input (with or without icon inside) */}
      {iconPosition === 'input' ? (
        <div className="po-input-wrapper">
          <FileText size={16} className="po-input-icon" aria-hidden="true" />
          <input
            id={inputId}
            className="po-input"
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            aria-describedby={helperId}
            aria-required={required}
          />
        </div>
      ) : (
        <input
          id={inputId}
          className="po-input"
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-describedby={helperId}
          aria-required={required}
        />
      )}

      {/* Helper text */}
      {helperText && (
        <div className="po-helper" id={helperId}>
          <Info size={14} aria-hidden="true" />
          <span>{helperText}</span>
        </div>
      )}

      <style jsx>{`
        /* Form group container */
        .po-number-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        /* Label */
        .po-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .po-label :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        /* Optional indicator */
        .optional {
          font-size: 11px;
          font-weight: 400;
          color: var(--grey-mid);
          margin-left: 4px;
        }

        /* B2B badge */
        .b2b-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--teal);
          background: var(--teal-glow);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* Input wrapper (for icon inside input) */
        .po-input-wrapper {
          position: relative;
        }

        .po-input-wrapper .po-input {
          padding-left: 40px;
        }

        .po-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--grey-mid);
          pointer-events: none;
        }

        /* Input field */
        .po-input {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--navy);
          background: var(--white);
          border: 1.5px solid var(--grey);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          transition: all var(--transition);
          outline: none;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .po-input::placeholder {
          color: var(--grey-mid);
          text-transform: none;
          letter-spacing: 0;
          font-family: var(--font-body);
          font-size: 13px;
        }

        /* Focus state */
        .po-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Disabled state */
        .po-input:disabled {
          background: var(--grey-light);
          color: var(--grey-mid);
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Helper text */
        .po-helper {
          font-size: 12px;
          color: var(--grey-mid);
          display: flex;
          align-items: flex-start;
          gap: var(--space-6);
          margin-top: -2px;
        }

        .po-helper :global(svg) {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Compact variant */
        .po-number-group.compact .po-label {
          font-size: 12px;
        }

        .po-number-group.compact .po-input {
          padding: 8px 12px;
          font-size: 13px;
        }

        .po-number-group.compact .po-input-wrapper .po-input {
          padding-left: 36px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .po-input {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
