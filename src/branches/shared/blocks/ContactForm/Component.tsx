import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { FormRenderer } from '../_shared/FormRenderer'
import type { ContactFormBlockProps, ContactFormVariant } from './types'

/**
 * B-27 ContactForm Block Component (Server)
 *
 * Contact form with unique layout variants.
 * Delegates form rendering to the shared FormRenderer.
 *
 * Variants:
 * - standard: full-width centered form
 * - sidebar: narrower form column
 * - floating: centered card with shadow
 */
export const ContactFormBlockComponent: React.FC<ContactFormBlockProps> = ({
  title,
  description,
  form,
  variant = 'standard',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'standard') as ContactFormVariant

  if (!form || typeof form !== 'object') return null

  const sectionClasses: Record<ContactFormVariant, string> = {
    standard: 'py-12 md:py-16 lg:py-20 bg-white',
    sidebar: 'py-12 md:py-16 lg:py-20 bg-grey-lightest',
    floating: 'py-12 md:py-16 lg:py-20 bg-grey-lightest',
  }

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`contact-form-block ${sectionClasses[currentVariant]}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {currentVariant === 'sidebar' ? (
          <div className="max-w-2xl mx-auto">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-grey-dark mb-8 leading-relaxed">
                {description}
              </p>
            )}
            <FormRenderer form={form as FormType} />
          </div>
        ) : (
          <div className={currentVariant === 'floating' ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto'}>
            {(title || description) && (
              <div className="mb-8 md:mb-10 text-center">
                {title && (
                  <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
                )}
                {description && (
                  <p className="text-sm md:text-base text-grey-dark leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            )}
            <div
              className={
                currentVariant === 'floating'
                  ? 'bg-white rounded-2xl shadow-lg p-6 md:p-10'
                  : ''
              }
            >
              <FormRenderer form={form as FormType} />
            </div>
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ContactFormBlockComponent
