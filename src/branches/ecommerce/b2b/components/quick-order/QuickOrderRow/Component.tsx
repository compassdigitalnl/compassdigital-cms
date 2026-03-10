'use client'

import React, { useRef, useEffect } from 'react'
import { Trash2, TrendingDown } from 'lucide-react'
import type { QuickOrderRowProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * QuickOrderRow Component
 *
 * Individual table row for quick order entry with product search autocomplete,
 * quantity input, price display, and delete action.
 *
 * @example
 * ```tsx
 * <QuickOrderRow
 *   row={rowData}
 *   onUpdate={(id, updates) => updateRow(id, updates)}
 *   onDelete={(id) => deleteRow(id)}
 *   onProductSearch={(id, query) => searchProducts(id, query)}
 * />
 * ```
 */
export function QuickOrderRow({
  row,
  onUpdate,
  onDelete,
  onProductSearch,
  showAutocomplete = false,
  autocompleteResults = [],
  onAutocompleteSelect,
  className = '',
}: QuickOrderRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { displayPrice: applyPriceMode } = usePriceMode()

  // Close autocomplete on click outside
  useEffect(() => {
    if (!showAutocomplete) return

    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        // Autocomplete will be closed by parent component
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAutocomplete])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const handleProductQueryChange = (value: string) => {
    onUpdate(row.id, { productQuery: value })
    if (onProductSearch) {
      onProductSearch(row.id, value)
    }
  }

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value) || 0
    const total = quantity * row.unitPrice

    onUpdate(row.id, {
      quantity,
      total,
    })
  }

  const handleAutocompleteItemClick = (product: typeof autocompleteResults[0]) => {
    if (onAutocompleteSelect) {
      onAutocompleteSelect(row.id, product)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && showAutocomplete) {
      // Parent component should close autocomplete
      e.preventDefault()
    }
  }

  const isEmpty = !row.productId

  return (
    <div
      className={`qor ${isEmpty ? 'qor-empty' : ''} ${className}`}
      role="row"
    >
      {/* Column 1: Product Input */}
      <div className="qor-product-col" role="cell">
        <div className="qor-product-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={row.productQuery}
            onChange={(e) => handleProductQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`qor-product-input ${row.productId ? 'qor-filled' : ''}`}
            placeholder="Zoek op artikelnummer of naam..."
            aria-controls={showAutocomplete ? `qor-autocomplete-${row.id}` : undefined}
            aria-expanded={showAutocomplete}
          />

          {/* SKU Display */}
          {row.sku && (
            <div className="qor-sku">SKU: {row.sku}</div>
          )}

          {/* Staffel Hint */}
          {row.staffelHint && (
            <div className="qor-staffel-hint">
              <TrendingDown size={12} aria-hidden="true" />
              Nog {row.staffelHint.quantityNeeded} voor {formatCurrency(row.staffelHint.nextTierPrice)} (−{row.staffelHint.discount}%)
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {showAutocomplete && autocompleteResults.length > 0 && (
            <div
              id={`qor-autocomplete-${row.id}`}
              className="qor-autocomplete"
              role="listbox"
            >
              {autocompleteResults.map((product) => (
                <div
                  key={product.id}
                  className="qor-autocomplete-item"
                  role="option"
                  onClick={() => handleAutocompleteItemClick(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAutocompleteItemClick(product)
                    }
                  }}
                  tabIndex={0}
                >
                  <div className="qor-autocomplete-item-name">{product.name}</div>
                  <div className="qor-autocomplete-item-meta">
                    <span className="qor-autocomplete-item-sku">SKU: {product.sku}</span>
                    <span className="qor-autocomplete-item-price">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Quantity Input */}
      <input
        type="number"
        value={row.quantity || ''}
        onChange={(e) => handleQuantityChange(e.target.value)}
        className="qor-qty-input"
        placeholder="0"
        min="1"
        role="cell"
        aria-label="Aantal"
      />

      {/* Column 3: Price Display */}
      <div
        className={`qor-price ${!row.unitPrice ? 'qor-empty' : ''}`}
        role="cell"
      >
        {row.unitPrice ? formatCurrency(applyPriceMode(row.unitPrice, row.taxClass) ?? row.unitPrice) : '—'}
      </div>

      {/* Column 4: Total Display */}
      <div
        className={`qor-total ${!row.total ? 'qor-empty' : ''}`}
        role="cell"
      >
        {formatCurrency(applyPriceMode(row.total, row.taxClass) ?? row.total)}
      </div>

      {/* Column 5: Delete Button */}
      <button
        type="button"
        onClick={() => onDelete(row.id)}
        className="qor-delete-btn"
        aria-label="Verwijder product"
        role="cell"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>

      <style jsx>{`
        .qor {
          display: grid;
          grid-template-columns: 1fr 140px 140px 180px 48px;
          gap: var(--space-16);
          padding: var(--space-20) 0;
          border-bottom: 1px solid var(--grey);
          align-items: center;
        }

        .qor:last-child {
          border-bottom: none;
        }

        /* Column 1: Product Input */
        .qor-product-col {
          position: relative;
        }

        .qor-product-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          position: relative;
        }

        .qor-product-input {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          outline: none;
          transition: all var(--transition);
        }

        .qor-product-input:focus {
          border-color: var(--teal);
          background: var(--teal-bg);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .qor-product-input.qor-filled {
          border-color: var(--teal);
          background: var(--teal-bg);
        }

        .qor-product-input::placeholder {
          color: var(--grey-mid);
          font-weight: 400;
        }

        /* SKU Display */
        .qor-sku {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--teal);
        }

        /* Staffel Hint */
        .qor-staffel-hint {
          font-size: 11px;
          color: var(--amber);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        /* Autocomplete Dropdown */
        .qor-autocomplete {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: white;
          border: 1.5px solid var(--teal);
          border-radius: var(--radius);
          box-shadow: 0 8px 24px rgba(10, 22, 40, 0.12);
          z-index: 100;
          max-height: 280px;
          overflow-y: auto;
        }

        .qor-autocomplete-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--grey);
          transition: background var(--transition);
        }

        .qor-autocomplete-item:last-child {
          border-bottom: none;
        }

        .qor-autocomplete-item:hover,
        .qor-autocomplete-item:focus {
          background: var(--teal-bg);
          outline: none;
        }

        .qor-autocomplete-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 2px;
        }

        .qor-autocomplete-item-meta {
          font-size: 12px;
          color: var(--grey-dark);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qor-autocomplete-item-sku {
          font-family: var(--font-mono);
          color: var(--teal);
        }

        .qor-autocomplete-item-price {
          font-family: var(--font-mono);
        }

        /* Column 2: Quantity Input */
        .qor-qty-input {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          outline: none;
          text-align: center;
          transition: all var(--transition);
        }

        .qor-qty-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .qor-qty-input::placeholder {
          color: var(--grey-mid);
        }

        /* Hide number input spinner */
        .qor-qty-input::-webkit-inner-spin-button,
        .qor-qty-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .qor-qty-input[type='number'] {
          -moz-appearance: textfield;
        }

        /* Column 3: Price Display */
        .qor-price {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          padding: 10px 0;
        }

        .qor-price.qor-empty {
          color: var(--grey-mid);
        }

        /* Column 4: Total Display */
        .qor-total {
          text-align: right;
          font-family: var(--font-primary);
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
        }

        .qor-total.qor-empty {
          color: var(--grey-mid);
        }

        /* Column 5: Delete Button */
        .qor-delete-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: none;
          border: 1.5px solid var(--grey);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--grey-mid);
          transition: all var(--transition);
        }

        .qor-delete-btn:hover {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.05);
          color: #ff6b6b;
        }

        .qor-delete-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15);
        }

        /* Empty row: hide delete button */
        .qor-empty .qor-delete-btn {
          visibility: hidden;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .qor {
            grid-template-columns: 1fr;
            gap: var(--space-12);
            padding: var(--space-16);
            position: relative;
          }

          .qor-product-col {
            grid-column: 1 / -1;
          }

          .qor-delete-btn {
            position: absolute;
            top: var(--space-16);
            right: 0;
          }

          .qor-qty-input,
          .qor-price,
          .qor-total {
            text-align: left;
          }

          .qor-total {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}
