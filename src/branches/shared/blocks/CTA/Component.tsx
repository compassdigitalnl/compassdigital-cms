/**
 * CTA Component - 100% Theme Variable Compliant
 *
 * Refactored from hardcoded teal gradient, inline styles with fallbacks,
 * and hover handlers to theme variables. All colors now use CSS variables from ThemeProvider.
 */
'use client'
import React from 'react'
import Link from 'next/link'
import type { CTABlock } from '@/payload-types'

export const CTABlockComponent: React.FC<CTABlock> = ({
  title,
  text,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  style,
  variant = 'full-width',
}) => {
  // Card variant (afgeronde kaart met gradient)
  if (variant === 'card') {
    return (
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Gradient card met decoratieve elementen */}
          <div className="relative bg-gradient-primary rounded-3xl p-10 md:p-14 overflow-hidden shadow-2xl">
            {/* Decorative radial gradient circle */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            {/* Content */}
            <div className="relative z-10 text-center text-white">
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
                {title}
              </h2>
              {text && <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{text}</p>}

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {buttonText && (
                  <Link
                    href={buttonLink || '#'}
                    className="px-8 py-4 bg-white text-primary font-bold rounded-xl transition-all duration-300 hover:bg-white/90 hover:scale-105 shadow-lg"
                  >
                    {buttonText}
                  </Link>
                )}
                {secondaryButtonText && (
                  <Link
                    href={secondaryButtonLink || '#'}
                    className="px-8 py-4 bg-transparent border-2 border-white/50 hover:border-white text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    {secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>

            {/* Decorative bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </section>
    )
  }

  // Full-width variant (original behavior - backwards compatible)
  return (
    <section
      className="cta py-20 px-4 bg-primary text-white"
    >
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-white text-4xl font-bold mb-4">{title}</h2>
        {text && <p className="text-white/90 text-xl mb-8">{text}</p>}

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={buttonLink}
            className="btn px-8 py-4 bg-white text-primary rounded-xl font-semibold inline-block transition-all duration-300 hover:bg-secondary hover:text-white hover:scale-105 shadow-lg"
          >
            {buttonText}
          </a>

          {secondaryButtonText && (
            <a
              href={secondaryButtonLink || '#'}
              className="btn px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white text-white rounded-xl font-semibold inline-block transition-all duration-300 hover:bg-white/10"
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
