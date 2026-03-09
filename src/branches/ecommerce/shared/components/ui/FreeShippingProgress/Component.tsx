/**
 * FreeShippingProgress Component
 *
 * Visual progress bar that shows customers how much more they need to spend
 * to qualify for free shipping. Encourages larger cart values through clear
 * visual feedback.
 *
 * Features:
 * - Real-time progress calculation based on cart total
 * - Teal gradient progress bar with smooth animation (0.5s)
 * - Truck icon indicator (changes to check-circle when achieved)
 * - Remaining amount highlighted in teal
 * - Success state with green color scheme
 * - Threshold amount display
 * - Responsive layout
 *
 * States:
 * - In Progress: Shows remaining amount and progress bar
 * - Achieved: Shows success message with check-circle icon and green colors
 *
 * @category E-commerce
 * @component EC05
 */

'use client'

import React, { useMemo } from 'react'
import { Truck, CheckCircle } from 'lucide-react'
import type { FreeShippingProgressBarProps } from './types'

export function FreeShippingProgress({
  currentTotal,
  threshold,
  currencySymbol = '€',
  locale = 'nl-NL',
  showThresholdText = true,
  thresholdText,
  achievedText,
  className = '',
}: FreeShippingProgressBarProps) {
  // Calculate progress
  const { remaining, percentage, achieved } = useMemo(() => {
    const remainingAmount = Math.max(0, threshold - currentTotal)
    const progressPercentage = Math.min(100, (currentTotal / threshold) * 100)
    const isAchieved = currentTotal >= threshold

    return {
      remaining: remainingAmount,
      percentage: progressPercentage,
      achieved: isAchieved,
    }
  }, [currentTotal, threshold])

  // Format price
  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2).replace('.', ',')
    return `${currencySymbol} ${formatted}`
  }

  // Default messages
  const defaultThresholdText = `Bij bestellingen vanaf ${formatPrice(threshold)} gratis verzending`
  const defaultAchievedText = 'Je bestelling komt in aanmerking voor gratis verzending! 🎉'

  const progressText = achieved
    ? achievedText || defaultAchievedText
    : `Nog ${formatPrice(remaining)} tot gratis verzending!`

  const thresholdMessage = achieved
    ? 'Gratis verzending toegepast bij checkout'
    : thresholdText || defaultThresholdText

  return (
    <div className={`free-shipping-progress ${achieved ? 'free-shipping-progress--achieved' : ''} ${className}`}>
      {/* Icon */}
      {achieved ? (
        <CheckCircle size={24} className="free-shipping-progress__icon" />
      ) : (
        <Truck size={24} className="free-shipping-progress__icon" />
      )}

      {/* Content */}
      <div className="free-shipping-progress__content">
        {/* Progress Text */}
        <div className="free-shipping-progress__text">
          {achieved ? (
            progressText
          ) : (
            <>
              Nog <span className="free-shipping-progress__amount">{formatPrice(remaining)}</span> tot
              gratis verzending!
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="free-shipping-progress__bar-wrapper">
          <div
            className="free-shipping-progress__bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Threshold Text */}
        {showThresholdText && (
          <div className="free-shipping-progress__threshold">{thresholdMessage}</div>
        )}
      </div>

      <style jsx>{`
        .free-shipping-progress {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 14px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .free-shipping-progress :global(.free-shipping-progress__icon) {
          width: 24px;
          height: 24px;
          color: var(--teal);
          flex-shrink: 0;
        }

        .free-shipping-progress__content {
          flex: 1;
        }

        .free-shipping-progress__text {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .free-shipping-progress__amount {
          color: var(--teal);
        }

        .free-shipping-progress__bar-wrapper {
          height: 8px;
          background: var(--grey);
          border-radius: 4px;
          overflow: hidden;
        }

        .free-shipping-progress__bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--teal), var(--teal-light));
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .free-shipping-progress__threshold {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: 4px;
        }

        /* Success State (achieved free shipping) */
        .free-shipping-progress--achieved .free-shipping-progress__text {
          color: var(--green);
        }

        .free-shipping-progress--achieved .free-shipping-progress__bar-fill {
          background: linear-gradient(90deg, var(--green), #4CAF50);
        }

        .free-shipping-progress--achieved :global(.free-shipping-progress__icon) {
          color: var(--green);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .free-shipping-progress {
            padding: 14px 18px;
            gap: 12px;
          }

          .free-shipping-progress :global(.free-shipping-progress__icon) {
            width: 20px;
            height: 20px;
          }

          .free-shipping-progress__text {
            font-size: 13px;
          }

          .free-shipping-progress__threshold {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}
