'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { CartLineItemCompactProps } from './types'

export default function CartLineItemCompact({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  className = '',
}: CartLineItemCompactProps) {
  const [localQty, setLocalQty] = useState(quantity)

  useEffect(() => {
    setLocalQty(quantity)
  }, [quantity])

  const lineTotal = product.price * quantity

  const handleQtyChange = (delta: number) => {
    const newQty = Math.max(1, localQty + delta)
    setLocalQty(newQty)
    onQuantityChange(newQty)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1
    setLocalQty(val)
  }

  const handleInputBlur = () => {
    const clamped = Math.max(1, Math.min(999, localQty))
    setLocalQty(clamped)
    onQuantityChange(clamped)
  }

  return (
    <div className={`compact-row ${className}`}>
      {/* Thumbnail */}
      <div className="compact-row__img">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            width={50}
            height={50}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <span className="compact-row__img-placeholder" />
        )}
      </div>

      {/* Product info */}
      <div className="compact-row__info">
        {product.brand && (
          <span className="compact-row__brand">{product.brand}</span>
        )}
        <span className="compact-row__name">{product.title}</span>
        {product.sku && (
          <span className="compact-row__sku">Art. {product.sku}</span>
        )}
        {product.stockStatus === 'in-stock' && (
          <span className="compact-row__stock">
            <span className="compact-row__stock-dot" />
            Op voorraad
          </span>
        )}
      </div>

      {/* Price */}
      <div className="compact-row__price">
        &euro;{product.price.toFixed(2).replace('.', ',')}
      </div>

      {/* Quantity stepper */}
      <div className="compact-row__qty-wrap">
        <div className="compact-row__qty">
          <button
            className="compact-row__qty-btn"
            onClick={() => handleQtyChange(-1)}
            aria-label="Verminder aantal"
          >
            &minus;
          </button>
          <input
            type="number"
            className="compact-row__qty-input"
            value={localQty}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={1}
            max={999}
          />
          <button
            className="compact-row__qty-btn"
            onClick={() => handleQtyChange(1)}
            aria-label="Verhoog aantal"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="compact-row__subtotal">
        &euro;{lineTotal.toFixed(2).replace('.', ',')}
      </div>

      {/* Remove */}
      <button
        className="compact-row__remove"
        onClick={onRemove}
        aria-label={`${product.title} verwijderen`}
      >
        <X className="compact-row__remove-icon" />
      </button>

      <style jsx>{`
        .compact-row {
          display: grid;
          grid-template-columns: 50px 1fr 120px 120px 100px 40px;
          gap: 12px;
          padding: 16px 20px;
          align-items: center;
          border-bottom: 1px solid var(--grey, #f1f5f9);
          transition: background 0.15s;
        }
        .compact-row:hover {
          background: var(--bg, #f8fafc);
        }
        .compact-row__img {
          width: 50px;
          height: 50px;
          background: var(--bg, #f1f5f9);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .compact-row__img-placeholder {
          width: 24px;
          height: 24px;
          background: var(--grey, #E8ECF1);
          border-radius: 4px;
        }
        .compact-row__info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .compact-row__brand {
          font-size: 10px;
          font-weight: 700;
          color: var(--teal);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .compact-row__name {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .compact-row__sku {
          font-size: 11px;
          color: var(--grey-mid, #94A3B8);
        }
        .compact-row__stock {
          font-size: 11px;
          color: var(--green, #16a34a);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .compact-row__stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green, #16a34a);
          display: inline-block;
        }
        .compact-row__price {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          text-align: right;
        }
        .compact-row__qty-wrap {
          display: flex;
          justify-content: center;
        }
        .compact-row__qty {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--grey, #e2e8f0);
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
        }
        .compact-row__qty-btn {
          width: 32px;
          height: 32px;
          background: var(--bg, #f8fafc);
          border: none;
          font-size: 16px;
          color: var(--grey-dark, #475569);
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .compact-row__qty-btn:hover {
          background: var(--grey, #e2e8f0);
          color: var(--navy);
        }
        .compact-row__qty-input {
          width: 40px;
          height: 32px;
          text-align: center;
          border: none;
          border-left: 1px solid var(--grey, #e2e8f0);
          border-right: 1px solid var(--grey, #e2e8f0);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
          outline: none;
          -moz-appearance: textfield;
        }
        .compact-row__qty-input::-webkit-inner-spin-button,
        .compact-row__qty-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .compact-row__subtotal {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          text-align: right;
        }
        .compact-row__remove {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: var(--grey-mid, #cbd5e1);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .compact-row__remove:hover {
          color: var(--coral, #e94560);
          background: rgba(233, 69, 96, 0.06);
        }
        .compact-row__remove-icon {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 900px) {
          .compact-row {
            grid-template-columns: 50px 1fr;
            grid-template-rows: auto auto;
            gap: 8px;
            padding: 12px 16px;
          }
          .compact-row__price,
          .compact-row__qty-wrap,
          .compact-row__subtotal {
            grid-column: 2;
          }
          .compact-row__remove {
            position: absolute;
            right: 8px;
            top: 8px;
          }
        }
      `}</style>
    </div>
  )
}
