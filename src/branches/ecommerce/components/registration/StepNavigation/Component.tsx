'use client'

import React from 'react'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import type { StepNavigationProps } from './types'

export const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  backLabel = 'Vorige stap',
  nextLabel = 'Volgende',
  showBack = true,
  isLastStep = false,
  isLoading = false,
  className = '',
}) => {
  return (
    <div
      className={`mt-7 flex justify-between gap-3 border-t pt-6 ${className}`}
      style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
    >
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex items-center gap-[7px] rounded-xl border-[1.5px] bg-white
            px-6 py-3.5 text-sm font-semibold text-theme-navy
            transition-all duration-200
            hover:border-theme-teal hover:text-theme-teal
          "
          style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="
          inline-flex items-center gap-[7px] rounded-xl border-none
          bg-theme-teal px-7 py-3.5 text-sm font-bold text-white
          shadow-[0_4px_16px_rgba(0,137,123,0.3)]
          transition-all duration-200
          hover:-translate-y-px hover:bg-theme-teal-light
          disabled:opacity-60 disabled:pointer-events-none
        "
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {isLastStep ? 'Account aanmaken' : nextLabel}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  )
}
