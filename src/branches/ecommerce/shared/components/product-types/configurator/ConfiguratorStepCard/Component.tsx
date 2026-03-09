'use client'

import React from 'react'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'
import type { ConfiguratorStepCardProps } from '@/branches/ecommerce/shared/lib/product-types'

/**
 * PC02: ConfiguratorStepCard
 *
 * Step content wrapper with title, description, and status
 * Features:
 * - Step title + description
 * - Active/completed/pending visual states
 * - Optional/required indicator
 * - Content area for option selection
 * - Responsive layout
 */

export const ConfiguratorStepCard: React.FC<ConfiguratorStepCardProps> = ({
  step,
  isActive,
  isCompleted,
  className = '',
}) => {
  return (
    <div
      className={`
        configurator-step-card
        border-2 rounded-lg transition-all duration-200
        ${isActive ? 'border-[var(--color-primary)] bg-white shadow-lg' : 'border-gray-300 bg-gray-50'}
        ${isCompleted ? 'border-green-500' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          px-6 py-4 border-b-2 transition-colors
          ${isActive ? 'border-[var(--color-primary-light)] bg-[var(--color-primary-glow)]' : 'border-gray-200 bg-gray-100'}
          ${isCompleted ? 'border-green-200 bg-green-50' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Title + Description */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {/* Step Number */}
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold
                  ${isActive ? 'bg-[var(--color-primary)] text-white' : ''}
                  ${isCompleted ? 'bg-green-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-400 text-white' : ''}
                `}
              >
                {step.stepNumber}
              </span>

              {/* Title */}
              <h3
                className={`
                  text-[18px] font-bold
                  ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-900'}
                  ${isCompleted ? 'text-green-900' : ''}
                `}
              >
                {step.title}
              </h3>
            </div>

            {/* Description */}
            {step.description && (
              <p
                className={`
                  text-[14px] ml-9
                  ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-600'}
                  ${isCompleted ? 'text-green-700' : ''}
                `}
              >
                {step.description}
              </p>
            )}
          </div>

          {/* Right: Status Indicator */}
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[12px] font-bold">Voltooid</span>
              </div>
            ) : isActive ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-glow)] text-[var(--color-primary)] rounded-full">
                <Circle className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[12px] font-bold">Actief</span>
              </div>
            ) : step.required ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full">
                <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[12px] font-bold">Verplicht</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-600 rounded-full">
                <Circle className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[12px] font-bold">Optioneel</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area (for ConfiguratorOptionGrid or other content) */}
      {isActive && (
        <div className="px-6 py-6">
          <p className="text-[14px] text-gray-600 text-center">
            {step.required ? 'Selecteer een optie om door te gaan' : 'Selecteer een optie (optioneel)'}
          </p>
        </div>
      )}

      {/* Completed State Summary */}
      {isCompleted && (
        <div className="px-6 py-4 bg-green-50 border-t-2 border-green-200">
          <p className="text-[13px] text-green-700 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
            Keuze opgeslagen. Klik op "Bewerk" om te wijzigen.
          </p>
        </div>
      )}
    </div>
  )
}
