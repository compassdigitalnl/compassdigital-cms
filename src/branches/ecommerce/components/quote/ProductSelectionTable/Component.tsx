'use client'

import React from 'react'
import { Plus, Trash2, PackageX } from 'lucide-react'
import { ProductSelectionTableProps } from './types'

export function ProductSelectionTable({
  products,
  onProductAdd,
  onProductRemove,
  onQuantityChange,
  emptyMessage = 'Nog geen producten geselecteerd',
  className = '',
}: ProductSelectionTableProps) {
  // Empty state
  if (products.length === 0) {
    return (
      <div className={`product-selection-table ${className}`}>
        <div className="product-selection-header">
          <div className="product-selection-title">Geselecteerde producten</div>
          <button
            className="product-add-button"
            onClick={onProductAdd}
            type="button"
            aria-label="Product toevoegen"
          >
            <Plus className="product-add-icon" size={14} strokeWidth={2.5} />
            Product toevoegen
          </button>
        </div>
        <div className="product-selection-empty">
          <PackageX className="product-selection-empty-icon" size={48} strokeWidth={1.5} />
          <div className="product-selection-empty-text">{emptyMessage}</div>
          <div className="product-selection-empty-hint">
            Klik op &quot;Product toevoegen&quot; om te beginnen
          </div>
        </div>

        <style jsx>{`
          .product-selection-table {
            background: white;
            border: 1px solid var(--grey);
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
          }

          .product-selection-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            background: var(--grey-lighter);
            border-bottom: 1px solid var(--grey);
          }

          .product-selection-title {
            font-family: var(--font-family-body);
            font-size: 16px;
            font-weight: 700;
            color: var(--navy);
          }

          .product-add-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--teal-bg);
            border: none;
            border-radius: var(--radius-sm);
            font-family: var(--font-family-body);
            font-size: 13px;
            font-weight: 600;
            color: var(--teal);
            cursor: pointer;
            transition: all var(--transition-base);
          }

          .product-add-button:hover {
            background: var(--teal);
            color: white;
          }

          .product-add-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.2);
          }

          .product-selection-empty {
            padding: 32px 24px;
            text-align: center;
            color: var(--grey-mid);
          }

          .product-selection-empty-text {
            font-family: var(--font-family-body);
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--grey-mid);
          }

          .product-selection-empty-hint {
            font-family: var(--font-family-body);
            font-size: 12px;
            color: var(--grey-mid);
          }

          @media (max-width: 640px) {
            .product-selection-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            .product-add-button {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    )
  }

  // Product list
  return (
    <div className={`product-selection-table ${className}`}>
      <div className="product-selection-header">
        <div className="product-selection-title">Geselecteerde producten</div>
        <button
          className="product-add-button"
          onClick={onProductAdd}
          type="button"
          aria-label="Product toevoegen"
        >
          <Plus className="product-add-icon" size={14} strokeWidth={2.5} />
          Product toevoegen
        </button>
      </div>
      <div className="product-selection-body">
        {products.map((product) => {
          const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const qty = parseInt(e.target.value) || 1
            if (qty < 1) {
              onQuantityChange?.(product.id, 1)
              return
            }
            if (product.maxQuantity && qty > product.maxQuantity) {
              onQuantityChange?.(product.id, product.maxQuantity)
              return
            }
            onQuantityChange?.(product.id, qty)
          }

          const handleDelete = () => {
            onProductRemove?.(product.id)
          }

          return (
            <div key={product.id} className="product-row">
              <div className="product-thumbnail">
                {product.thumbnail ? (
                  product.thumbnail.startsWith('http') ? (
                    <img src={product.thumbnail} alt={product.name} />
                  ) : (
                    <span>{product.thumbnail}</span>
                  )
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-sku">SKU: {product.sku}</div>
              </div>
              <input
                type="number"
                min="1"
                max={product.maxQuantity}
                value={product.quantity}
                onChange={handleQuantityChange}
                className="product-qty-input"
                aria-label="Hoeveelheid"
              />
              <button
                className="product-delete-button"
                onClick={handleDelete}
                type="button"
                aria-label={`Verwijder ${product.name}`}
              >
                <Trash2 className="product-delete-icon" size={16} strokeWidth={2} />
              </button>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .product-selection-table {
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        /* Header */
        .product-selection-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: var(--grey-lighter);
          border-bottom: 1px solid var(--grey);
        }

        .product-selection-title {
          font-family: var(--font-family-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
        }

        .product-add-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--teal-bg);
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font-family-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--teal);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .product-add-button:hover {
          background: var(--teal);
          color: white;
        }

        .product-add-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.2);
        }

        /* Body (rows container) */
        .product-selection-body {
          padding: 20px 24px;
        }

        /* Product row */
        .product-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--grey);
        }

        .product-row:last-child {
          border-bottom: none;
        }

        /* Product thumbnail */
        .product-thumbnail {
          width: 60px;
          height: 60px;
          background: var(--grey-lighter);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .product-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-thumbnail span {
          line-height: 1;
        }

        /* Product info */
        .product-info {
          flex: 1;
          min-width: 0; /* Allow text truncation */
        }

        .product-name {
          font-family: var(--font-family-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 2px;
          line-height: 1.4;

          /* Truncate long names */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-sku {
          font-family: var(--font-family-mono);
          font-size: 12px;
          color: var(--grey-mid);
        }

        /* Quantity input */
        .product-qty-input {
          width: 100px;
          padding: 12px;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-family-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          text-align: center;
          outline: none;
          transition: border-color var(--transition-base);
        }

        .product-qty-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(0, 137, 123, 0.12);
        }

        /* Hide spinner arrows */
        .product-qty-input::-webkit-outer-spin-button,
        .product-qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .product-qty-input[type='number'] {
          -moz-appearance: textfield;
        }

        /* Delete button */
        .product-delete-button {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: none;
          border: 1.5px solid var(--grey);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--grey-mid);
          transition: all var(--transition-base);
          flex-shrink: 0;
        }

        .product-delete-button:hover {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }

        .product-delete-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .product-selection-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .product-add-button {
            width: 100%;
            justify-content: center;
          }

          .product-row {
            flex-wrap: wrap;
            gap: 12px;
          }

          .product-thumbnail {
            width: 48px;
            height: 48px;
            font-size: 22px;
          }

          .product-info {
            flex: 1 1 100%;
            order: 1;
          }

          .product-qty-input {
            flex: 1;
            order: 2;
          }

          .product-delete-button {
            order: 3;
          }
        }
      `}</style>
    </div>
  )
}
