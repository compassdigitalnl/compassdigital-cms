'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import type { ConfiguratorNavigationProps } from '@/branches/ecommerce/lib/product-types'

/**
 * PC05: ConfiguratorNavigation
 *
 * Bottom navigation bar with previous/next buttons and step counter
 * Features:
 * - "Vorige" button (disabled on first step)
 * - "Volgende" button (disabled if can't proceed)
 * - "Opslaan & Afsluiten" button (optional)
 * - Step counter display (e.g., "Stap 2 van 5")
 * - Responsive layout
 * - Sticky positioning option
 */

export const ConfiguratorNavigation: React.FC<ConfiguratorNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onReset,
  className = '',
}) => {
  return (
    <div
      className={`
        configurator-navigation
        border-t-2 border-gray-200 bg-white
        ${className}
      `}
    >
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-colors text-[14px] font-semibold
            ${canGoPrevious ? 'border-gray-400 text-gray-700 hover:border-teal-500 hover:text-teal-600' : 'border-gray-300 text-gray-400 cursor-not-allowed'}
          `}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Vorige</span>
        </button>

        {/* Center: Step Counter + Save */}
        <div className="flex items-center gap-3">
          {/* Step Counter */}
          <div className="text-center">
            <p className="text-[13px] text-gray-500 mb-0.5">Stap</p>
            <p className="text-[16px] font-bold text-gray-900">
              {currentStep} <span className="text-gray-400">van</span> {totalSteps}
            </p>
          </div>

          {/* Save & Exit Button (optional) */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-400 text-gray-700 hover:border-yellow-500 hover:text-yellow-600 transition-colors text-[14px] font-semibold"
            >
              <Save className="w-4 h-4" strokeWidth={2.5} />
              Opslaan & Afsluiten
            </button>
          )}
        </div>

        {/* Right: Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-colors text-[14px] font-semibold
            ${canGoNext ? 'bg-teal-600 border-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          <span className="hidden sm:inline">
            {currentStep === totalSteps ? 'Afronden' : 'Volgende'}
          </span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Mobile: Save & Exit (bottom row) */}
      {onReset && (
        <div className="md:hidden px-6 pb-4">
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-400 text-gray-700 hover:border-yellow-500 hover:text-yellow-600 transition-colors text-[14px] font-semibold"
          >
            <Save className="w-4 h-4" strokeWidth={2.5} />
            Opslaan & Afsluiten
          </button>
        </div>
      )}
    </div>
  )
}
