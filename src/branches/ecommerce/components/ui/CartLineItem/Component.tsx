/**
 * CartLineItem (ec06)
 *
 * Individual cart item row with product info, quantity controls, and actions.
 * Used in shopping cart, minicart, and checkout flows.
 *
 * @category E-commerce Components
 * @subcategory Cart
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { Box, Ruler, CheckCircle, AlertTriangle, XCircle, ListPlus, Trash2 } from 'lucide-react'
import { QuantityStepper } from '@/branches/shared/components/ui'
import type { CartLineItemProps, StockStatus } from './types'

export function CartLineItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  onAddToList,
  className = '',
}: CartLineItemProps) {
  // Calculate prices
  const unitPrice = product.price
  const totalPrice = (quantity * unitPrice).toFixed(2)
  const formattedUnitPrice = `€${unitPrice.toFixed(2)}`

  // Get stock status styling
  const getStockClassName = (status: StockStatus) => {
    switch (status) {
      case 'in-stock':
        return 'cart-line-item__stock--in-stock'
      case 'low-stock':
        return 'cart-line-item__stock--low'
      case 'on-backorder':
        return 'cart-line-item__stock--backorder'
      case 'out-of-stock':
        return 'cart-line-item__stock--out'
      default:
        return ''
    }
  }

  // Get stock icon
  const StockIcon = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return <CheckCircle size={12} strokeWidth={2.5} />
      case 'low-stock':
        return <AlertTriangle size={12} strokeWidth={2.5} />
      case 'on-backorder':
        return <AlertTriangle size={12} strokeWidth={2.5} />
      case 'out-of-stock':
        return <XCircle size={12} strokeWidth={2.5} />
      default:
        return null
    }
  }

  // Get stock text
  const getStockText = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'Op voorraad'
      case 'low-stock':
        return `Laag op voorraad${product.stockQuantity ? ` (${product.stockQuantity} stuks)` : ''}`
      case 'on-backorder':
        return 'Op bestelling'
      case 'out-of-stock':
        return 'Niet op voorraad'
      default:
        return ''
    }
  }

  // Split price into euros and cents for styling
  const [euros, cents] = totalPrice.split('.')

  return (
    <>
      <div className={`cart-line-item ${className}`}>
        <div className="cart-line-item__main">
          {/* Product Image */}
          <div className="cart-line-item__image">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="100px"
              />
            ) : (
              <div className="cart-line-item__image-placeholder">📦</div>
            )}
          </div>

          {/* Product Details */}
          <div className="cart-line-item__details">
            {/* Brand */}
            {product.brand && (
              <div className="cart-line-item__brand">{product.brand}</div>
            )}

            {/* Title */}
            <div className="cart-line-item__title">{product.title}</div>

            {/* Metadata (SKU, Variant) */}
            <div className="cart-line-item__meta">
              {product.sku && (
                <span className="cart-line-item__meta-item">
                  <Box size={12} />
                  SKU: {product.sku}
                </span>
              )}
              {product.variant && (
                <span className="cart-line-item__meta-item">
                  <Ruler size={12} />
                  {product.variant}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.stockStatus && (
              <div className={`cart-line-item__stock ${getStockClassName(product.stockStatus)}`}>
                <StockIcon />
                {getStockText()}
              </div>
            )}
          </div>

          {/* Quantity Stepper */}
          <div className="cart-line-item__qty-wrapper">
            <QuantityStepper
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={product.stockStatus === 'on-backorder' ? 999 : (product.stockQuantity || 999)}
              size="md"
              disabled={product.stockStatus === 'out-of-stock' && product.stockStatus !== 'on-backorder'}
              ariaLabel={`Aantal voor ${product.title}`}
            />
          </div>

          {/* Price & Actions */}
          <div className="cart-line-item__price-wrapper">
            <div className="cart-line-item__price">
              € {euros}
              <small>,{cents}</small>
            </div>
            <div className="cart-line-item__unit-price">
              {formattedUnitPrice} per stuk
            </div>
            <div className="cart-line-item__actions">
              {onAddToList && (
                <button
                  type="button"
                  onClick={onAddToList}
                  className="cart-line-item__action-btn"
                  aria-label="Voeg toe aan lijst"
                >
                  <ListPlus size={14} strokeWidth={2} />
                  Lijst
                </button>
              )}
              <button
                type="button"
                onClick={onRemove}
                className="cart-line-item__action-btn cart-line-item__action-btn--delete"
                aria-label="Verwijder item"
              >
                <Trash2 size={14} strokeWidth={2} />
                Verwijder
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-line-item {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .cart-line-item__main {
          display: flex;
          padding: 20px;
          gap: 20px;
          align-items: center;
        }

        /* Product Image */
        .cart-line-item__image {
          width: 100px;
          height: 100px;
          background: var(--bg);
          border-radius: var(--radius);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .cart-line-item__image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }

        /* Product Details */
        .cart-line-item__details {
          flex: 1;
          min-width: 0;
        }

        .cart-line-item__brand {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--teal);
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .cart-line-item__title {
          font-weight: 600;
          font-size: 15px;
          color: var(--navy);
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .cart-line-item__meta {
          font-size: 12px;
          color: var(--grey-mid);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .cart-line-item__meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Stock Status */
        .cart-line-item__stock {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .cart-line-item__stock--in-stock {
          color: var(--green);
        }

        .cart-line-item__stock--low {
          color: var(--amber);
        }

        .cart-line-item__stock--backorder {
          color: var(--amber, #F59E0B);
        }

        .cart-line-item__stock--out {
          color: var(--coral);
        }

        /* Quantity Wrapper */
        .cart-line-item__qty-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* Price & Actions */
        .cart-line-item__price-wrapper {
          text-align: right;
          flex-shrink: 0;
          min-width: 100px;
        }

        .cart-line-item__price {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
        }

        .cart-line-item__price small {
          font-size: 16px;
        }

        .cart-line-item__unit-price {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: 2px;
        }

        .cart-line-item__actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          justify-content: flex-end;
        }

        .cart-line-item__action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: var(--grey-mid);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          transition: color 0.2s;
        }

        .cart-line-item__action-btn:hover {
          color: var(--teal);
        }

        .cart-line-item__action-btn--delete:hover {
          color: var(--coral);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .cart-line-item__main {
            flex-wrap: wrap;
            padding: 16px;
            gap: 16px;
          }

          .cart-line-item__image {
            width: 80px;
            height: 80px;
          }

          .cart-line-item__image-placeholder {
            font-size: 32px;
          }

          .cart-line-item__price-wrapper {
            width: 100%;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .cart-line-item__actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  )
}

export default CartLineItem
