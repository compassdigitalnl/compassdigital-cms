'use client'

import React from 'react'
import { Edit2, Check, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import type { ConfiguratorReviewProps } from '@/branches/ecommerce/lib/product-types'
import type { Media } from '@/payload-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

/**
 * PC07: ConfiguratorReview
 *
 * Final review step with all choices summary and edit links
 * Features:
 * - All steps summary
 * - Selected option per step
 * - Price breakdown per step
 * - Edit buttons per section
 * - Total price display
 * - "Bevestig configuratie" CTA
 * - Responsive layout
 */

export const ConfiguratorReview: React.FC<ConfiguratorReviewProps> = ({
  steps,
  selections,
  totalPrice,
  onEdit,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  return (
    <div className={`configurator-review ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-gray-900 mb-2">Configuratie Overzicht</h2>
        <p className="text-[15px] text-gray-600">
          Controleer je keuzes voordat je de configuratie bevestigt.
        </p>
      </div>

      {/* Steps Summary */}
      <div className="space-y-4 mb-6">
        {steps.map((step) => {
          const selection = selections[step.stepNumber]
          const hasSelection = selection !== undefined

          return (
            <div
              key={step.stepNumber}
              className={`
                border-2 rounded-lg overflow-hidden
                ${hasSelection ? 'border-green-500' : 'border-gray-300'}
              `}
            >
              {/* Step Header */}
              <div
                className={`
                  px-4 py-3 flex items-center justify-between
                  ${hasSelection ? 'bg-green-50' : 'bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-2">
                  {/* Step Number */}
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold
                      ${hasSelection ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}
                    `}
                  >
                    {hasSelection ? <Check className="w-4 h-4" strokeWidth={3} /> : step.stepNumber}
                  </div>

                  {/* Step Title */}
                  <h3
                    className={`
                      text-[16px] font-bold
                      ${hasSelection ? 'text-green-900' : 'text-gray-900'}
                    `}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => onEdit(step.stepNumber)}
                  className="btn btn-outline-neutral btn-sm flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Bewerk
                </button>
              </div>

              {/* Selection Details */}
              {hasSelection ? (
                <div className="px-4 py-3 bg-white">
                  <div className="flex items-start gap-3">
                    {/* Option Image (if available) */}
                    {selection.image && typeof selection.image === 'object' && 'url' in selection.image && selection.image.url && (
                      <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={(selection.image as Media).url!}
                          alt={selection.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}

                    {/* Option Info */}
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-gray-900 mb-1">{selection.name}</p>
                      {selection.description && (
                        <p className="text-[13px] text-gray-600 mb-2">{selection.description}</p>
                      )}
                      {selection.price !== 0 && (
                        <p
                          className={`text-[14px] font-mono font-bold ${selection.price > 0 ? 'text-[var(--color-primary)]' : 'text-red-600'}`}
                        >
                          {selection.price > 0 ? '+' : ''}€{formatPriceStr(selection.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 bg-gray-50">
                  <p className="text-[13px] text-gray-500 italic">Geen selectie gemaakt</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Price Summary */}
      <div className="border-2 border-[var(--color-primary)] rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-3 bg-[var(--color-primary-glow)] border-b-2 border-[var(--color-primary-light)]">
          <h3 className="text-[16px] font-bold text-[var(--color-primary)]">Prijs Overzicht</h3>
        </div>
        <div className="px-4 py-4 bg-white space-y-2">
          {/* Individual Step Prices */}
          {steps.map((step) => {
            const selection = selections[step.stepNumber]
            if (!selection || selection.price === 0) return null

            return (
              <div key={step.stepNumber} className="flex items-center justify-between">
                <span className="text-[14px] text-gray-700">{step.title}:</span>
                <span
                  className={`text-[14px] font-mono font-semibold ${selection.price > 0 ? 'text-[var(--color-primary)]' : 'text-red-600'}`}
                >
                  {selection.price > 0 ? '+' : ''}€{formatPriceStr(selection.price)}
                </span>
              </div>
            )
          })}

          {/* Divider */}
          <div className="border-t-2 border-gray-200 my-3" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-gray-900">Totaal:</span>
            <span className="text-[20px] font-mono font-bold text-[var(--color-primary)]">
              €{formatPriceStr(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
        Bevestig Configuratie & Voeg Toe Aan Winkelwagen
      </button>
    </div>
  )
}
