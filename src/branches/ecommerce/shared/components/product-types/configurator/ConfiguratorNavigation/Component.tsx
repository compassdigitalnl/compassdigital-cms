'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import type { ConfiguratorNavigationProps } from './types'

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
        border-t-2 border-grey-light bg-white
        ${className}
      `}
    >
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="btn btn-outline-neutral flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Vorige</span>
        </button>

        {/* Center: Step Counter + Save */}
        <div className="flex items-center gap-3">
          {/* Step Counter */}
          <div className="text-center">
            <p className="text-[13px] text-grey-mid mb-0.5">Stap</p>
            <p className="text-[16px] font-bold text-navy">
              {currentStep} <span className="text-grey-mid">van</span> {totalSteps}
            </p>
          </div>

          {/* Save & Exit Button (optional) */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-outline-neutral hidden md:flex items-center gap-2"
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
          className="btn btn-primary flex items-center gap-2"
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
            className="btn btn-outline-neutral w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" strokeWidth={2.5} />
            Opslaan & Afsluiten
          </button>
        </div>
      )}
    </div>
  )
}
