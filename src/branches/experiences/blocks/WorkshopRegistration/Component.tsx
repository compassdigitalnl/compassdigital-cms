import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { FormRenderer } from '@/branches/shared/blocks/_shared/FormRenderer'
import type { WorkshopRegistrationBlockProps, WorkshopRegistrationVariant } from './types'

/**
 * B-30 WorkshopRegistration Block Component (Server)
 *
 * Workshop registration form with unique layout variants.
 * Delegates form rendering to the shared FormRenderer.
 *
 * Variants:
 * - standard: full-width with title/description + form
 * - card: centered card with background
 */
export const WorkshopRegistrationBlockComponent: React.FC<WorkshopRegistrationBlockProps> = ({
  title,
  description,
  form,
  variant = 'standard',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'standard') as WorkshopRegistrationVariant

  if (!form || typeof form !== 'object') return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`workshop-registration-block ${currentVariant === 'card' ? 'py-12 md:py-16 lg:py-20 bg-grey-lightest' : 'py-12 md:py-16 lg:py-20 bg-white'}`}
    >
      <div className="max-w-3xl mx-auto px-6">
        {(title || description) && (
          <div className="mb-8 md:mb-10 text-center">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-grey-dark leading-relaxed">{description}</p>
            )}
          </div>
        )}

        <div
          className={
            currentVariant === 'card'
              ? 'bg-white rounded-2xl shadow-sm p-6 md:p-10'
              : ''
          }
        >
          <FormRenderer form={form as FormType} />
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default WorkshopRegistrationBlockComponent
