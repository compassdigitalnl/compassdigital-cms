'use client'

import type { CheckoutStepsProps } from './types'

export function CheckoutSteps({
  currentStep,
  onStepClick,
  allowClickPrevious = true,
  className = '',
}: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: 'Winkelwagen', shortLabel: 'Cart' },
    { number: 2, label: 'Gegevens', shortLabel: 'Info' },
    { number: 3, label: 'Betaling', shortLabel: 'Pay' },
    { number: 4, label: 'Bevestiging', shortLabel: 'Done' },
  ]

  const handleStepClick = (stepNumber: number) => {
    if (!onStepClick) return

    if ((allowClickPrevious && stepNumber < currentStep) || stepNumber === currentStep) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div
      className={`bg-white border-b ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-center gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <StepItem
                number={step.number}
                label={step.label}
                shortLabel={step.shortLabel}
                isActive={currentStep === step.number}
                isCompleted={currentStep > step.number}
                onClick={() => handleStepClick(step.number)}
                isClickable={
                  onStepClick !== undefined &&
                  ((allowClickPrevious && step.number < currentStep) ||
                    step.number === currentStep)
                }
              />
              {index < steps.length - 1 && (
                <StepLine isCompleted={currentStep > step.number} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface StepItemProps {
  number: number
  label: string
  shortLabel: string
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
  isClickable: boolean
}

function StepItem({
  number,
  label,
  shortLabel,
  isActive,
  isCompleted,
  onClick,
  isClickable,
}: StepItemProps) {
  const getColor = () => {
    if (isCompleted) return 'var(--color-success)'
    if (isActive) return 'var(--color-primary)'
    return 'var(--color-text-muted)'
  }

  const getBgColor = () => {
    if (isCompleted) return 'var(--color-success)'
    if (isActive) return 'var(--color-primary)'
    return 'transparent'
  }

  const getBorderColor = () => {
    if (isCompleted) return 'var(--color-success)'
    if (isActive) return 'var(--color-primary)'
    return 'var(--color-border)'
  }

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`flex items-center gap-2.5 text-sm font-semibold transition-all ${
        isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
      }`}
      style={{ color: getColor() }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all"
        style={{
          borderColor: getBorderColor(),
          background: getBgColor(),
          color: isActive || isCompleted ? 'white' : getColor(),
        }}
      >
        {isCompleted ? '\u2713' : number}
      </div>
      <span className="hidden sm:inline">{label}</span>
      <span className="inline sm:hidden">{shortLabel}</span>
    </button>
  )
}

function StepLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div
      className="w-12 sm:w-16 h-0.5 mx-2 sm:mx-3 transition-colors"
      style={{
        background: isCompleted
          ? 'var(--color-success)'
          : 'var(--color-border)',
      }}
    />
  )
}

export default CheckoutSteps
