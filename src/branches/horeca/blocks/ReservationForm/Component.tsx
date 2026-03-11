import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { FormRenderer } from '@/branches/shared/blocks/_shared/FormRenderer'
import type { ReservationFormBlockProps, ReservationFormVariant } from './types'

/**
 * B-31 ReservationForm Block Component (Server)
 *
 * Reservation form with unique layout variants.
 * Delegates form rendering to the shared FormRenderer.
 *
 * Variants:
 * - standard: full-width form
 * - split: form left, decorative image / info right
 */
export const ReservationFormBlockComponent: React.FC<ReservationFormBlockProps> = ({
  title,
  description,
  form,
  variant = 'standard',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'standard') as ReservationFormVariant

  if (!form || typeof form !== 'object') return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`reservation-form-block ${currentVariant === 'split' ? 'py-12 md:py-16 lg:py-20 bg-grey-lightest' : 'py-12 md:py-16 lg:py-20 bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {currentVariant === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form column */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
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
            </div>

            {/* Decorative / info column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm sticky top-8">
                <h3 className="font-display text-lg text-navy mb-4">Reservering Info</h3>
                <div className="space-y-4 text-sm text-grey-dark">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Bevestiging per e-mail</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Reserveer voor uw groep</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Vragen? Bel ons gerust</span>
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
            <FormRenderer form={form as FormType} />
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ReservationFormBlockComponent
