'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { ConfiguratorStepIndicatorProps } from './types'

/**
 * PC01: ConfiguratorStepIndicator
 *
 * Multi-step progress bar with step numbers and states
 * Features:
 * - Step numbers (1, 2, 3, 4...)
 * - Active, completed, pending states
 * - Click to jump to step (if allowed)
 * - Visual progress line between steps
 * - Responsive layout (vertical on mobile, horizontal on desktop)
 */

export const ConfiguratorStepIndicator: React.FC<ConfiguratorStepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className = '',
}) => {
  // Determine step state
  const getStepState = (stepNumber: number): 'completed' | 'active' | 'pending' => {
    if (completedSteps.includes(stepNumber)) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'pending'
  }

  // Check if step is clickable
  const isStepClickable = (stepNumber: number): boolean => {
    // Can click on completed steps or current step
    return onStepClick !== undefined && (completedSteps.includes(stepNumber) || stepNumber === currentStep)
  }

  return (
    <div className={`configurator-step-indicator ${className}`}>
      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => {
          const stepState = getStepState(step.stepNumber)
          const isClickable = isStepClickable(step.stepNumber)
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={step.stepNumber}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick && onStepClick(step.stepNumber)}
                  disabled={!isClickable}
                  className={`
                    btn relative w-12 h-12 flex items-center justify-center
                    ${stepState === 'completed' ? 'btn-primary' : ''}
                    ${stepState === 'active' ? 'btn-primary ring-4 ring-[var(--color-primary-light)]' : ''}
                    ${stepState === 'pending' ? 'btn-outline-neutral' : ''}
                  `}
                  aria-label={`Stap ${step.stepNumber}: ${step.title}`}
                >
                  {stepState === 'completed' ? (
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  ) : (
                    <span
                      className={`text-[16px] font-bold ${stepState === 'active' ? 'text-white' : 'text-grey-dark'}`}
                    >
                      {step.stepNumber}
                    </span>
                  )}
                </button>

                {/* Step Title (below circle) */}
                <div className="mt-2 text-center max-w-[120px]">
                  <p
                    className={`text-[13px] font-semibold ${stepState === 'active' ? 'text-[var(--color-primary)]' : 'text-grey-dark'}`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-grey-mid mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line (between steps) */}
              {!isLast && (
                <div className="flex-1 h-0.5 bg-grey-light mx-2 mb-12">
                  <div
                    className={`h-full transition-all duration-300 ${completedSteps.includes(steps[index + 1].stepNumber) ? 'bg-[var(--color-primary)] w-full' : 'bg-grey-light w-0'}`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => {
          const stepState = getStepState(step.stepNumber)
          const isClickable = isStepClickable(step.stepNumber)
          const isLast = index === steps.length - 1

          return (
            <div key={step.stepNumber} className="relative">
              {/* Step Row */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick && onStepClick(step.stepNumber)}
                disabled={!isClickable}
                className={`
                  btn w-full flex items-center gap-3 p-3
                  ${stepState === 'active' ? 'btn-outline-primary' : 'btn-outline-neutral'}
                `}
              >
                {/* Step Circle */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${stepState === 'completed' ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : ''}
                    ${stepState === 'active' ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : ''}
                    ${stepState === 'pending' ? 'bg-grey-light border-grey-light' : ''}
                  `}
                >
                  {stepState === 'completed' ? (
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  ) : (
                    <span
                      className={`text-[14px] font-bold ${stepState === 'active' ? 'text-white' : 'text-grey-dark'}`}
                    >
                      {step.stepNumber}
                    </span>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 text-left">
                  <p
                    className={`text-[14px] font-semibold ${stepState === 'active' ? 'text-[var(--color-primary)]' : 'text-navy'}`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[12px] text-grey-dark mt-0.5">{step.description}</p>
                  )}
                </div>

                {/* Required Badge */}
                {step.required && stepState !== 'completed' && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-red-100 text-coral-700 rounded-full text-[10px] font-bold uppercase">
                    Verplicht
                  </span>
                )}
              </button>

              {/* Vertical Connector Line */}
              {!isLast && (
                <div className="absolute left-8 top-[52px] w-0.5 h-4 bg-grey-light">
                  <div
                    className={`w-full transition-all duration-300 ${completedSteps.includes(steps[index + 1].stepNumber) ? 'bg-[var(--color-primary)] h-full' : 'bg-grey-light h-0'}`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
