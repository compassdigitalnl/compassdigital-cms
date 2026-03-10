'use client'

/**
 * VP09: VariantStepByStep
 * Wizard-style multi-step selector for complex variant configurations
 */

import React, { useState } from 'react'
import type { VariantStepByStepProps, VariantValue } from './types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantStepByStep({
  product,
  options,
  selectedValues,
  onSelectionsChange,
  showProgressBar = true,
  className,
}: VariantStepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { formatPriceStr } = usePriceMode()

  if (!options || options.length === 0) {
    return null
  }

  const currentOption = options[currentStep]
  const currentValue = selectedValues[currentOption.optionName]
  const isLastStep = currentStep === options.length - 1
  const isFirstStep = currentStep === 0

  // Check if all required fields up to current step are filled
  const canProceed = () => {
    for (let i = 0; i <= currentStep; i++) {
      const option = options[i]
      if (option.required && !selectedValues[option.optionName]) {
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (canProceed() && !isLastStep) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSelect = (optionName: string, value: VariantValue) => {
    onSelectionsChange({
      ...selectedValues,
      [optionName]: value,
    })
  }

  const progressPercentage = ((currentStep + 1) / options.length) * 100

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Step {currentStep + 1} of {options.length}
            </span>
            <span className="text-gray-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2">
        {options.map((option, index) => {
          const isComplete = selectedValues[option.optionName] !== undefined
          const isCurrent = index === currentStep
          const isPast = index < currentStep

          return (
            <React.Fragment key={option.optionName}>
              <button
                type="button"
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : isComplete || isPast
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
                )}
                aria-label={`Go to step ${index + 1}: ${option.optionName}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete && !isCurrent ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              {index < options.length - 1 && (
                <div
                  className={cn(
                    'h-1 w-8 rounded-full transition-all',
                    isPast ? 'bg-green-600' : 'bg-gray-200',
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Current Step Content */}
      <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
        {/* Step Header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {currentOption.optionName}
            {currentOption.required && <span className="ml-1 text-red-500">*</span>}
          </h3>
          {currentOption.description && (
            <p className="mt-1 text-sm text-gray-600">{currentOption.description}</p>
          )}
        </div>

        {/* Values Grid - Display based on display type */}
        <div className="space-y-3">
          {currentOption.values && currentOption.values.length > 0 ? (
            currentOption.displayType === 'colorSwatch' ? (
              // Color Swatches Display
              <div className="flex flex-wrap gap-3">
                {currentOption.values.map(value => {
                  const isSelected = currentValue?.value === value.value
                  const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
                  const colorHex = value.colorHex || '#CCCCCC'

                  return (
                    <button
                      key={value.value}
                      type="button"
                      onClick={() => !isDisabled && handleSelect(currentOption.optionName, value)}
                      disabled={isDisabled}
                      className={cn(
                        'flex flex-col items-center gap-2',
                        isDisabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <div
                        className={cn(
                          'h-12 w-12 rounded-full border-2',
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                            : 'border-gray-300',
                        )}
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="text-xs text-gray-700">{value.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              // Default Button Grid Display
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {currentOption.values.map(value => {
                  const isSelected = currentValue?.value === value.value
                  const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)

                  return (
                    <button
                      key={value.value}
                      type="button"
                      onClick={() => !isDisabled && handleSelect(currentOption.optionName, value)}
                      disabled={isDisabled}
                      className={cn(
                        'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all',
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                        isDisabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      {isSelected && (
                        <div className="absolute right-2 top-2">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <span className={cn('text-sm font-medium', isSelected ? 'text-blue-900' : 'text-gray-900')}>
                        {value.label}
                      </span>
                      {value.priceModifier !== undefined && value.priceModifier !== null && value.priceModifier !== 0 && (
                        <span className="text-xs text-gray-600">
                          {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">No options available</p>
          )}
        </div>

        {/* Current Selection Display */}
        {currentValue && (
          <div className="mt-4 rounded-md bg-blue-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Selected: {currentValue.label}</span>
              {currentValue.priceModifier !== undefined &&
                currentValue.priceModifier !== null &&
                currentValue.priceModifier !== 0 && (
                  <span className="text-sm font-semibold text-blue-600">
                    {currentValue.priceModifier > 0 ? '+' : ''}€{formatPriceStr(currentValue.priceModifier)}
                  </span>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={cn(
            'btn btn-outline-neutral flex items-center gap-2',
            isFirstStep && 'cursor-not-allowed opacity-50',
          )}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || isLastStep}
          className={cn(
            'btn btn-primary flex items-center gap-2',
            (!canProceed() || isLastStep) && 'cursor-not-allowed opacity-50',
          )}
        >
          Next
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary of All Selections */}
      {Object.keys(selectedValues).length > 0 && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 text-sm font-semibold text-blue-900">Your Selections:</div>
          <div className="space-y-2">
            {options.map(option => {
              const value = selectedValues[option.optionName]
              if (!value) return null

              return (
                <div key={option.optionName} className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">
                    {option.optionName}: <span className="font-medium">{value.label}</span>
                  </span>
                  {value.priceModifier !== undefined &&
                    value.priceModifier !== null &&
                    value.priceModifier !== 0 && (
                      <span className="font-medium text-blue-900">
                        {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
                      </span>
                    )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
