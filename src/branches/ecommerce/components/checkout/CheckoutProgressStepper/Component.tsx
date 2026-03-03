'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { CheckoutProgressStepperProps, CheckoutStep, StepState } from './types'

/**
 * Default checkout steps
 */
const DEFAULT_STEPS: CheckoutStep[] = [
  { id: 1, label: 'Gegevens' },
  { id: 2, label: 'Verzending' },
  { id: 3, label: 'Betaling' },
  { id: 4, label: 'Bevestiging' },
]

/**
 * CheckoutProgressStepper Component
 *
 * 4-step horizontal progress indicator for checkout flow.
 * Shows completed (green ✓), active (teal number), and pending (grey number) states.
 *
 * @example
 * ```tsx
 * <CheckoutProgressStepper currentStep={2} />
 * ```
 */
export function CheckoutProgressStepper({
  currentStep,
  steps = DEFAULT_STEPS,
  onStepClick,
  className = '',
}: CheckoutProgressStepperProps) {
  // Calculate progress line fill width
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100

  // Determine step state
  const getStepState = (stepId: number): StepState => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  const handleStepClick = (stepId: number, state: StepState) => {
    // Only allow clicking completed steps
    if (onStepClick && state === 'completed') {
      onStepClick(stepId)
    }
  }

  return (
    <nav aria-label="Checkout progress" className={`checkout-progress ${className}`}>
      {/* Progress line with fill */}
      <div className="progress-line">
        <div className="progress-line-fill" style={{ width: `${progressWidth}%` }} />
      </div>

      {/* Steps */}
      {steps.map((step) => {
        const state = getStepState(step.id)
        const isClickable = onStepClick && state === 'completed'

        return (
          <div
            key={step.id}
            className={`step ${state} ${isClickable ? 'clickable' : ''}`}
            aria-current={state === 'active' ? 'step' : undefined}
            onClick={() => handleStepClick(step.id, state)}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                handleStepClick(step.id, state)
              }
            }}
          >
            <div className="step-circle" aria-label={getAriaLabel(step, state)}>
              {state === 'completed' ? <Check size={20} /> : step.id}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        )
      })}

      <style jsx>{`
        .checkout-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          padding: 0 8px;
        }

        .progress-line {
          position: absolute;
          top: 20px;
          left: 50px;
          right: 50px;
          height: 2px;
          background: var(--grey);
          z-index: 0;
        }

        .progress-line-fill {
          height: 100%;
          background: var(--green);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .step.clickable {
          cursor: pointer;
        }

        .step.clickable:hover .step-circle {
          transform: scale(1.05);
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-label {
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Completed state (green with checkmark) */
        .step.completed .step-circle {
          background: var(--green);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 200, 83, 0.3);
        }

        .step.completed .step-label {
          color: var(--green);
        }

        /* Active state (teal with number) */
        .step.active .step-circle {
          background: var(--teal);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 137, 123, 0.4);
        }

        .step.active .step-label {
          color: var(--teal);
        }

        /* Pending state (grey with number) */
        .step.pending .step-circle {
          background: var(--grey-light);
          color: var(--grey-mid);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .step.pending .step-label {
          color: var(--grey-mid);
        }

        /* Responsive: Mobile (640px and below) */
        @media (max-width: 640px) {
          .checkout-progress {
            max-width: 100%;
          }

          .step-label {
            font-size: 10px;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .step-circle {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .progress-line {
            top: 18px;
            left: 40px;
            right: 40px;
          }
        }

        /* Responsive: Very small mobile (480px and below) */
        @media (max-width: 480px) {
          .step-label {
            display: none;
          }

          .step-circle {
            margin-bottom: 0;
          }

          .progress-line {
            left: 32px;
            right: 32px;
          }
        }
      `}</style>
    </nav>
  )
}

/**
 * Generate ARIA label for step
 */
function getAriaLabel(step: CheckoutStep, state: StepState): string {
  if (state === 'completed') {
    return `Step ${step.id}: ${step.label}, completed`
  }
  if (state === 'active') {
    return `Step ${step.id}: ${step.label}, current step`
  }
  return `Step ${step.id}: ${step.label}, pending`
}
