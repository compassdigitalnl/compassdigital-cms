'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { ProgressStepperProps, StepStatus } from './types'

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return 'done'
    if (index === currentStep) return 'active'
    return 'upcoming'
  }

  return (
    <div
      className={`flex items-center justify-center border-b bg-white py-6 ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mx-auto flex max-w-[700px] items-center">
        {steps.map((step, index) => {
          const status = getStatus(index)

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-1 items-center gap-2.5">
                {/* Circle */}
                <div
                  className={`
                    flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full
                    text-sm font-bold transition-all duration-300
                    ${status === 'done' ? 'bg-[var(--color-success)] text-white' : ''}
                    ${status === 'active' ? 'bg-theme-teal text-white shadow-[0_0_0_4px_var(--color-primary-glow)]' : ''}
                    ${status === 'upcoming' ? 'border-2 text-theme-grey-mid' : ''}
                  `}
                  style={status === 'upcoming' ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  {status === 'done' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div
                    className={`text-[13px] font-bold ${
                      status === 'upcoming' ? 'text-theme-grey-mid' : 'text-theme-navy'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[11px] text-theme-grey-mid">{step.description}</div>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-12 flex-shrink-0 ${
                    index < currentStep ? 'bg-[var(--color-success)]' : ''
                  }`}
                  style={index >= currentStep ? { background: 'var(--color-border)' } : undefined}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
