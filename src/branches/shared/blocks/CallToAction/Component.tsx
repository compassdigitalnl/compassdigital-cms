import React from 'react'
import Link from 'next/link'
import type { CallToActionBlock } from '@/payload-types'

/**
 * B30 - CallToAction (Inline) Component
 *
 * Compact, centered CTA for mid-page conversions.
 * Features single button, 3 background variants, hover effects.
 */

export const CallToActionComponent: React.FC<CallToActionBlock> = ({
  title,
  description,
  buttonLabel,
  buttonLink,
  backgroundColor = 'grey',
}) => {
  // Background variant styling
  const bgClasses = {
    white: 'bg-white',
    grey: 'bg-grey-light',
    teal: 'bg-teal-glow',
  }[backgroundColor || 'grey']

  // Text color for different backgrounds
  const textClasses = {
    white: 'text-navy',
    grey: 'text-navy',
    teal: 'text-navy',
  }[backgroundColor || 'grey']

  // Button styling for different backgrounds
  const buttonClasses = {
    white: 'bg-teal hover:bg-teal-dark text-white',
    grey: 'bg-teal hover:bg-teal-dark text-white',
    teal: 'bg-navy hover:bg-navy-light text-white',
  }[backgroundColor || 'grey']

  // Determine if link is internal or external
  const isExternal = buttonLink?.startsWith('http')
  const ButtonWrapper = isExternal ? 'a' : Link

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div
          className={`
            ${bgClasses}
            rounded-xl
            px-6 py-8
            md:px-8 md:py-10
            text-center
            transition-all duration-200
          `}
        >
          {/* Title */}
          <h2
            className={`
              ${textClasses}
              font-serif
              text-2xl md:text-3xl
              font-semibold
              mb-3
            `}
          >
            {title}
          </h2>

          {/* Description (optional) */}
          {description && (
            <p
              className={`
                ${textClasses}
                text-sm md:text-base
                opacity-80
                max-w-2xl
                mx-auto
                mb-6
              `}
            >
              {description}
            </p>
          )}

          {/* Button */}
          <ButtonWrapper
            href={buttonLink}
            {...(isExternal && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
            className={`
              inline-flex
              items-center
              justify-center
              ${buttonClasses}
              px-8 py-3
              rounded-lg
              font-semibold
              text-sm md:text-base
              transition-all
              duration-200
              hover:shadow-lg
              hover:-translate-y-0.5
              focus:outline-none
              focus:ring-2
              focus:ring-teal
              focus:ring-offset-2
            `}
          >
            {buttonLabel}
          </ButtonWrapper>
        </div>
      </div>
    </section>
  )
}
