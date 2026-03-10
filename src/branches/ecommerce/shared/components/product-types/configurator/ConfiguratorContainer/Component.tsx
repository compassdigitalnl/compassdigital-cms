'use client'

import { useState, useCallback, useMemo } from 'react'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/shared/components/ui/AddToCartToast'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { ConfiguratorStepIndicator } from '../ConfiguratorStepIndicator'
import { ConfiguratorStepCard } from '../ConfiguratorStepCard'
import { ConfiguratorOptionGrid } from '../ConfiguratorOptionGrid'
import { ConfiguratorNavigation } from '../ConfiguratorNavigation'
import { ConfiguratorValidation } from '../ConfiguratorValidation'
import { ConfiguratorReview } from '../ConfiguratorReview'
import type {
  ConfiguratorStep,
  ConfiguratorOption,
  ConfiguratorSelection,
} from '@/branches/ecommerce/shared/lib/product-types'
import type { Product } from '@/payload-types'

interface ConfiguratorContainerProps {
  product: Product
  className?: string
}

export function ConfiguratorContainer({ product, className = '' }: ConfiguratorContainerProps) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const { formatPriceStr } = usePriceMode()

  // Parse configurator steps from product data
  const steps: ConfiguratorStep[] = useMemo(() => {
    const config = (product as any).configuratorConfig
    const rawSteps = config?.configuratorSteps
    if (!Array.isArray(rawSteps) || rawSteps.length === 0) return []

    return rawSteps.map((step: any, index: number) => ({
      stepNumber: index + 1,
      title: step.title || `Stap ${index + 1}`,
      description: step.description || null,
      required: step.required !== false,
      options: Array.isArray(step.options)
        ? step.options.map((opt: any) => ({
            name: opt.name || '',
            description: opt.description || null,
            price: Number(opt.price) || 0,
            image: opt.image || null,
            recommended: opt.recommended === true,
          }))
        : [],
    }))
  }, [product])

  const totalSteps = steps.length
  const isReviewStep = totalSteps > 0

  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<ConfiguratorSelection>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showReview, setShowReview] = useState(false)

  // Current step data
  const currentStepData = steps.find((s) => s.stepNumber === currentStep)

  // Total price (base product price + selected options)
  const totalPrice = useMemo(() => {
    const basePrice = Number(product.salePrice || product.price) || 0
    const optionsPrice = Object.values(selections).reduce((sum, opt) => sum + (opt?.price || 0), 0)
    return basePrice + optionsPrice
  }, [product, selections])

  // Select an option for the current step
  const handleSelect = useCallback(
    (option: ConfiguratorOption) => {
      setSelections((prev) => ({ ...prev, [currentStep]: option }))
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep])
      }
    },
    [currentStep, completedSteps],
  )

  // Can proceed to next step?
  const canGoNext = useMemo(() => {
    if (!currentStepData) return false
    if (currentStepData.required && !selections[currentStep]) return false
    return true
  }, [currentStepData, currentStep, selections])

  // Navigation
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowReview(true)
    }
  }, [currentStep, totalSteps])

  const handlePrevious = useCallback(() => {
    if (showReview) {
      setShowReview(false)
    } else if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }, [currentStep, showReview])

  const handleStepClick = useCallback(
    (stepNumber: number) => {
      if (stepNumber <= currentStep || completedSteps.includes(stepNumber)) {
        setShowReview(false)
        setCurrentStep(stepNumber)
      }
    },
    [currentStep, completedSteps],
  )

  const handleEditFromReview = useCallback((stepNumber: number) => {
    setShowReview(false)
    setCurrentStep(stepNumber)
  }, [])

  // Add configured product to cart
  const handleAddToCart = useCallback(() => {
    const configSummary = Object.entries(selections)
      .map(([step, opt]) => {
        const stepData = steps.find((s) => s.stepNumber === Number(step))
        return `${stepData?.title}: ${opt.name}`
      })
      .join(' | ')

    addItem({
      product,
      quantity: 1,
      configuration: {
        selections,
        totalPrice,
        summary: configSummary,
      },
    } as any)

    showToast({
      product,
      quantity: 1,
    })
  }, [product, selections, steps, totalPrice, addItem, showToast])

  if (steps.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 ${className}`}>
        <p className="text-sm">Geen configuratiestappen beschikbaar voor dit product.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Step indicator */}
      <ConfiguratorStepIndicator
        steps={steps}
        currentStep={showReview ? totalSteps + 1 : currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Review step */}
      {showReview ? (
        <div className="space-y-4">
          <ConfiguratorReview
            steps={steps}
            selections={selections}
            totalPrice={totalPrice}
            onEdit={handleEditFromReview}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 rounded-lg text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Terug
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ background: 'var(--color-primary, #0D4F4F)' }}
            >
              In winkelwagen — {formatPriceStr(totalPrice)}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Current step */}
          {currentStepData && (
            <div className="space-y-4">
              <ConfiguratorStepCard
                step={currentStepData}
                isActive={true}
                isCompleted={completedSteps.includes(currentStep)}
              />

              {/* Validation */}
              <ConfiguratorValidation
                step={currentStepData}
                selection={selections[currentStep] || null}
              />

              {/* Option grid */}
              <ConfiguratorOptionGrid
                options={currentStepData.options}
                selectedOption={selections[currentStep] || null}
                onSelect={handleSelect}
                columns={currentStepData.options.length <= 2 ? 2 : 3}
              />
            </div>
          )}

          {/* Navigation */}
          <ConfiguratorNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            canGoNext={canGoNext}
            canGoPrevious={currentStep > 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          {/* Running total */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Tussentotaal</span>
            <span className="text-lg font-bold" style={{ color: 'var(--color-primary, #0D4F4F)' }}>
              {formatPriceStr(totalPrice)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
