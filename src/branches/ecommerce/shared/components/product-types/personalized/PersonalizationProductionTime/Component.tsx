'use client'

import React, { useState } from 'react'
import { Clock, Calendar, Zap } from 'lucide-react'
import type { PersonalizationProductionTimeProps } from './types'

/**
 * PP08: PersonalizationProductionTime
 *
 * Time indicator with delivery date calculator and rush order option
 * Features:
 * - Shows base production days
 * - Shows additional personalization days
 * - Calculates estimated delivery date
 * - Rush order toggle (optional)
 * - Visual timeline display
 * - Business days calculation
 */

export const PersonalizationProductionTime: React.FC<PersonalizationProductionTimeProps> = ({
  baseProductionDays,
  personalizationDays = 0,
  rushAvailable = false,
  onRushToggle,
  className = '',
}) => {
  const [rushEnabled, setRushEnabled] = useState(false)

  // Calculate total production days
  const rushMultiplier = rushEnabled ? 0.5 : 1
  const totalProductionDays = Math.ceil((baseProductionDays + personalizationDays) * rushMultiplier)

  // Calculate estimated delivery date (business days only)
  const calculateDeliveryDate = (days: number): Date => {
    const date = new Date()
    let addedDays = 0
    let currentDay = 0

    while (addedDays < days) {
      currentDay++
      date.setDate(date.getDate() + 1)
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        addedDays++
      }
    }

    return date
  }

  const deliveryDate = calculateDeliveryDate(totalProductionDays)

  // Format date (e.g., "15 maart 2026")
  const formatDate = (date: Date): string => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ]
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // Handle rush toggle
  const handleRushToggle = () => {
    const newValue = !rushEnabled
    setRushEnabled(newValue)
    if (onRushToggle) {
      onRushToggle(newValue)
    }
  }

  return (
    <div className={`personalization-production-time border-2 border-grey-light rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-grey-light bg-grey-light">
        <h3 className="text-[16px] font-bold text-navy flex items-center gap-2">
          <Clock className="w-5 h-5" strokeWidth={2.5} />
          Productietijd
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Timeline Breakdown */}
        <div className="space-y-2 mb-4">
          {/* Base Production */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-grey-dark">Standaard productie:</span>
            <span className="text-[13px] font-semibold text-navy">
              {baseProductionDays} werkdag{baseProductionDays !== 1 ? 'en' : ''}
            </span>
          </div>

          {/* Personalization Days (if any) */}
          {personalizationDays > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-grey-dark">Personalisatie:</span>
              <span className="text-[13px] font-semibold text-[var(--color-primary)]">
                +{personalizationDays} werkdag{personalizationDays !== 1 ? 'en' : ''}
              </span>
            </div>
          )}

          {/* Rush Order (if enabled) */}
          {rushEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-grey-dark flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600" strokeWidth={2.5} />
                Spoedbestelling:
              </span>
              <span className="text-[13px] font-semibold text-amber-600">
                50% sneller
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-grey-light my-2" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-navy">Totale productietijd:</span>
            <span className="text-[16px] font-mono font-bold text-[var(--color-primary)]">
              {totalProductionDays} werkdag{totalProductionDays !== 1 ? 'en' : ''}
            </span>
          </div>
        </div>

        {/* Estimated Delivery Date */}
        <div className="p-3 bg-[var(--color-primary-glow)] rounded-lg border-2 border-[var(--color-primary-light)]">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2.5} />
            <span className="text-[13px] font-semibold text-[var(--color-primary)]">Verwachte leverdatum:</span>
          </div>
          <p className="text-[18px] font-bold text-[var(--color-primary)] ml-7">
            {formatDate(deliveryDate)}
          </p>
          <p className="text-[11px] text-[var(--color-primary)] ml-7 mt-0.5">
            (Indicatief, op basis van werkdagen)
          </p>
        </div>

        {/* Rush Order Option */}
        {rushAvailable && (
          <div className="mt-4 p-3 border-2 border-amber-400 rounded-lg bg-amber-50">
            <label className="flex items-start gap-3 cursor-pointer">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={rushEnabled}
                onChange={handleRushToggle}
                className="w-5 h-5 mt-0.5 text-amber-600 border-2 border-amber-500 rounded focus:ring-2 focus:ring-amber-500"
              />

              {/* Label */}
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                  <span className="text-[14px] font-bold text-amber-900">
                    Spoedbestelling
                  </span>
                  <span className="text-[12px] text-amber-700 ml-1">
                    (+€25,00)
                  </span>
                </div>
                <p className="text-[12px] text-amber-800">
                  Verkort de productietijd met 50% en lever binnen {Math.ceil(totalProductionDays / 2)} werkdag{Math.ceil(totalProductionDays / 2) !== 1 ? 'en' : ''}.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
