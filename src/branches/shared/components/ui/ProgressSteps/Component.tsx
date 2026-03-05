'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { ProgressStepsProps } from './types'

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  ariaLabel = 'Progress',
  className = '',
}) => {
  return (
    <nav
      className={`border-b border-theme-border bg-white py-5 ${className}`}
      aria-label={ariaLabel}
    >
      <ol className="mx-auto flex max-w-[600px] items-center justify-center gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Item */}
            <li
              className="flex items-center gap-2.5"
              aria-current={index === currentStep ? 'step' : 'false'}
            >
              {/* Numbered Circle */}
              <div
                className={`
                  flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold
                  transition-all duration-300 ease-out
                  ${
                    step.status === 'done'
                      ? 'border-theme-green bg-theme-green text-white'
                      : step.status === 'active'
                        ? 'border-theme-teal bg-theme-teal text-white'
                        : 'border-theme-border bg-transparent text-theme-grey-mid'
                  }
                `}
                aria-label={`Step ${index + 1} ${step.status}`}
              >
                {step.status === 'done' ? (
                  <Check className="h-[14px] w-[14px]" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <span
                className={`
                  whitespace-nowrap text-[13px] font-semibold transition-colors duration-300
                  max-sm:hidden
                  ${
                    step.status === 'done'
                      ? 'text-theme-green'
                      : step.status === 'active'
                        ? 'text-theme-navy'
                        : 'text-theme-grey-mid'
                  }
                `}
              >
                {step.label}
              </span>
            </li>

            {/* Connector Line (not after last step) */}
            {index < steps.length - 1 && (
              <li
                className={`
                  mx-3 h-0.5 w-[60px] flex-shrink-0 transition-colors duration-300
                  max-sm:mx-2 max-sm:w-[40px]
                  ${step.status === 'done' ? 'bg-theme-green' : 'bg-theme-border'}
                `}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </ol>

      {/* Screen Reader Announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.label}
      </div>
    </nav>
  )
}

/**
 * Helper function to auto-generate step states based on current step index
 */
export function generateSteps(labels: string[], currentStep: number) {
  return labels.map((label, index) => ({
    label,
    status: (index < currentStep
      ? 'done'
      : index === currentStep
        ? 'active'
        : 'pending') as 'done' | 'active' | 'pending',
  }))
}
