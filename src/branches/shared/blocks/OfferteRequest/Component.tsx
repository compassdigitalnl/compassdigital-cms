import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { FormRenderer } from '../_shared/FormRenderer'
import type { OfferteRequestBlockProps, OfferteRequestVariant } from './types'

/**
 * B-29 OfferteRequest Block Component (Server)
 *
 * Quote request form with unique layout variants.
 * Delegates form rendering to the shared FormRenderer.
 *
 * Variants:
 * - standard: full-width form with title/description above
 * - sidebar: form left, trust signals / info right
 */
export const OfferteRequestBlockComponent: React.FC<OfferteRequestBlockProps> = ({
  title,
  description,
  form,
  variant = 'standard',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'standard') as OfferteRequestVariant

  if (!form || typeof form !== 'object') return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="offerte-request-block py-12 md:py-16 lg:py-20 bg-grey-lightest"
    >
      <div className="max-w-7xl mx-auto px-6">
        {currentVariant === 'sidebar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form column */}
            <div className="lg:col-span-3">
              {title && (
                <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
              )}
              {description && (
                <p className="text-sm md:text-base text-grey-dark mb-8 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
                <FormRenderer form={form as FormType} />
              </div>
            </div>

            {/* Trust signals column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm sticky top-8">
                <h3 className="font-display text-lg text-navy mb-4">Waarom kiezen voor ons?</h3>
                <div className="space-y-4 text-sm text-grey-dark">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Vrijblijvende offerte</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Reactie binnen 2 werkdagen</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Voorstel op maat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
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

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
              <FormRenderer form={form as FormType} />
            </div>
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default OfferteRequestBlockComponent
