/**
 * StaffelCalculator Component
 *
 * Volume pricing calculator showing tiered pricing (staffelprijzen) with live updates.
 * Encourages bulk purchases by showing savings and next-tier hints.
 *
 * Features:
 * - Tiered price levels (e.g., 1-4, 5-9, 10-24, 25+)
 * - Visual tier selection (radio-style with check icon)
 * - Quantity stepper (− / + buttons)
 * - Live total calculation with unit breakdown
 * - Savings display (vs. base price)
 * - Smart hint: "Bestel er X meer en betaal €Y" (next tier upsell)
 *
 * @category E-commerce
 * @component C4
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Tag, Check, TrendingDown, Zap, CheckCircle } from 'lucide-react'
import type { StaffelCalculatorProps, VolumePriceTier } from './types'

export function StaffelCalculator({
  productName,
  basePrice,
  tiers,
  initialQty = 1,
  unit = 'stuks',
  currencySymbol = '€',
  onQtyChange,
  className = '',
}: StaffelCalculatorProps) {
  const [quantity, setQuantity] = useState(initialQty)

  // Get tier for current quantity
  const getTierForQty = (qty: number): VolumePriceTier => {
    return tiers.find((t) => qty >= t.min && qty <= t.max) || tiers[0]
  }

  const currentTier = getTierForQty(quantity)
  const total = quantity * currentTier.price
  const savings = quantity * (basePrice - currentTier.price)

  // Get next tier for upsell hint
  const getNextTier = (): VolumePriceTier | null => {
    return tiers.find((t) => t.min > quantity) || null
  }

  const nextTier = getNextTier()

  // Handle quantity change
  const handleQtyChange = (newQty: number) => {
    const validQty = Math.max(1, newQty)
    setQuantity(validQty)

    if (onQtyChange) {
      const tier = getTierForQty(validQty)
      const newTotal = validQty * tier.price
      onQtyChange(validQty, newTotal, tier)
    }
  }

  // Handle tier click (jump to tier minimum)
  const handleTierClick = (tier: VolumePriceTier) => {
    handleQtyChange(tier.min)
  }

  // Format price
  const formatPrice = (price: number): string => {
    return `${currencySymbol}${price.toFixed(2).replace('.', ',')}`
  }

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('nl-NL')
  }

  return (
    <div className={`staffel-card ${className}`}>
      {/* Header */}
      <div className="staffel-header">
        <Tag size={20} />
        <div className="staffel-title">Staffelprijzen — {productName}</div>
      </div>

      {/* Tier Cards */}
      <div className="staffel-tiers" role="radiogroup" aria-label="Staffelprijzen">
        {tiers.map((tier, index) => {
          const isActive = quantity >= tier.min && quantity <= tier.max
          const tierLabel =
            tier.max === Infinity
              ? `${tier.min}+ ${unit}`
              : `${tier.min} – ${tier.max} ${unit}`

          return (
            <div
              key={index}
              className={`staffel-tier ${isActive ? 'active' : ''}`}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              onClick={() => handleTierClick(tier)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTierClick(tier)
                }
              }}
            >
              <div className="tier-check">{isActive && <Check size={12} />}</div>
              <span className="tier-range">{tierLabel}</span>
              <span className="tier-price">{formatPrice(tier.price)}</span>
              {tier.discount > 0 && (
                <span className="tier-save">−{tier.discount}%</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Calculator */}
      <div className="staffel-calc">
        <div className="staffel-qty-wrap">
          <div className="staffel-qty-label">Aantal {unit}</div>
          <div className="staffel-qty">
            <button
              onClick={() => handleQtyChange(quantity - 1)}
              aria-label="Aantal verlagen"
              type="button"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
              aria-label={`Aantal ${unit}`}
              min={1}
            />
            <button
              onClick={() => handleQtyChange(quantity + 1)}
              aria-label="Aantal verhogen"
              type="button"
            >
              +
            </button>
          </div>
        </div>

        <div className="staffel-result">
          <div className="staffel-result-price">{formatPrice(total)}</div>
          <div className="staffel-result-unit">
            {formatNumber(quantity)} × {formatPrice(currentTier.price)} per {unit}
          </div>
          {savings > 0 && (
            <div className="staffel-result-save">
              <TrendingDown size={14} />
              U bespaart {formatPrice(savings)}
            </div>
          )}
        </div>
      </div>

      {/* Hint (Next Tier Upsell) */}
      {nextTier ? (
        <div className="staffel-hint">
          <Zap size={16} />
          Bestel er {nextTier.min - quantity} meer en betaal{' '}
          {formatPrice(nextTier.price)} per {unit} (−{nextTier.discount}%)
        </div>
      ) : (
        <div className="staffel-hint">
          <CheckCircle size={16} />
          U profiteert van de hoogste staffelkorting!
        </div>
      )}

      <style jsx>{`
        /* ═══ STAFFEL CARD ═══ */
        .staffel-card {
          background: white;
          border: 1px solid var(--grey);
          border-radius: 16px;
          padding: 24px;
          max-width: 480px;
          width: 100%;
        }

        /* Header */
        .staffel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .staffel-header :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        .staffel-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
        }

        /* Tiers */
        .staffel-tiers {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 20px;
        }

        .staffel-tier {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.15s;
          cursor: pointer;
          border: 1.5px solid transparent;
        }

        .staffel-tier:hover {
          background: var(--grey-light);
        }

        .staffel-tier:focus {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }

        .staffel-tier.active {
          background: var(--teal-glow);
          border-color: var(--color-primary-glow);
        }

        .tier-check {
          width: 20px;
          height: 20px;
          border: 2px solid var(--grey);
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .staffel-tier.active .tier-check {
          background: var(--teal);
          border-color: var(--teal);
        }

        .staffel-tier.active .tier-check :global(svg) {
          color: white;
        }

        .tier-range {
          flex: 1;
          font-weight: 600;
          color: var(--navy);
        }

        .tier-price {
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--navy);
        }

        .tier-save {
          font-size: 12px;
          font-weight: 700;
          color: var(--green);
          background: var(--green-light);
          padding: 2px 8px;
          border-radius: 100px;
          margin-left: 10px;
        }

        /* Calculator */
        .staffel-calc {
          background: var(--grey-light);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .staffel-qty-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .staffel-qty-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--grey-mid);
        }

        .staffel-qty {
          display: flex;
          align-items: center;
          border: 2px solid var(--grey);
          border-radius: 10px;
          overflow: hidden;
          background: white;
        }

        .staffel-qty button {
          width: 36px;
          height: 38px;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 16px;
          color: var(--navy);
          transition: background 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .staffel-qty button:hover {
          background: var(--grey-light);
        }

        .staffel-qty button:focus {
          outline: 2px solid var(--teal);
          outline-offset: -2px;
        }

        .staffel-qty input {
          width: 52px;
          text-align: center;
          border: none;
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          outline: none;
        }

        /* Remove number input arrows */
        .staffel-qty input::-webkit-inner-spin-button,
        .staffel-qty input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .staffel-qty input[type='number'] {
          -moz-appearance: textfield;
        }

        .staffel-result {
          flex: 1;
        }

        .staffel-result-price {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          color: var(--navy);
        }

        .staffel-result-unit {
          font-size: 12px;
          color: var(--grey-mid);
        }

        .staffel-result-save {
          font-size: 13px;
          font-weight: 700;
          color: var(--green);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        /* Hint */
        .staffel-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 10px 14px;
          background: var(--teal-glow);
          border-radius: 8px;
          font-size: 13px;
          color: var(--teal);
          font-weight: 600;
        }

        .staffel-hint :global(svg) {
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .staffel-calc {
            flex-direction: column;
            align-items: stretch;
          }

          .staffel-qty-wrap {
            order: 2;
          }

          .staffel-result {
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}
