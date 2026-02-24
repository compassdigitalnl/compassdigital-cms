import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { serializeLexical } from '@/utilities/serializeLexical'
import type { HeroBlock } from '@/payload-types'
import type { Media } from '@/payload-types'

/**
 * B01 - Hero Block Component
 *
 * Modern hero section with 3 layout variants and flexible backgrounds.
 *
 * FEATURES:
 * - 3 variants: default (centered), split (text left/image right), centered compact
 * - 3 background styles: gradient (navy/teal), image with overlay, solid color
 * - Rich text description with Lexical serialization
 * - Up to 3 CTA buttons with 3 styles each
 * - Responsive design with mobile-first approach
 * - Next.js Image optimization for background images
 *
 * @see docs/refactoring/sprint-9/shared/b01-hero.html
 */

export const HeroBlockComponent: React.FC<HeroBlock> = ({
  subtitle,
  title,
  description,
  buttons = [],
  variant = 'default',
  backgroundStyle = 'gradient',
  backgroundImage,
  backgroundColor = 'navy',
}) => {
  // Variant classes
  const variantClasses = {
    default: 'text-center py-12 md:py-16 lg:py-20',
    split: 'py-12 md:py-16',
    centered: 'text-center py-10 md:py-12',
  }

  // Background styles
  const bgClasses = {
    gradient: 'bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden',
    image: 'relative text-white',
    solid: {
      navy: 'bg-navy text-white',
      white: 'bg-white text-navy',
      bg: 'bg-grey-light text-navy',
      teal: 'bg-teal text-white',
    },
  }

  const backgroundClass =
    backgroundStyle === 'gradient'
      ? bgClasses.gradient
      : backgroundStyle === 'image'
      ? bgClasses.image
      : bgClasses.solid[backgroundColor as keyof typeof bgClasses.solid]

  // Button styles
  const buttonStyles = {
    primary: 'bg-teal text-white hover:bg-teal-dark shadow-sm',
    secondary: 'bg-transparent border-2 border-current hover:bg-white/10',
    ghost: 'text-current hover:underline',
  }

  return (
    <section className={`hero-block ${variantClasses[variant]} ${backgroundClass} rounded-2xl`}>
      {/* Gradient glow effect */}
      {backgroundStyle === 'gradient' && (
        <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,_rgba(0,137,123,0.12),_transparent_70%)] rounded-full pointer-events-none" />
      )}

      {/* Background image */}
      {backgroundStyle === 'image' && backgroundImage && (
        <div className="absolute inset-0 z-0">
          {typeof backgroundImage === 'object' && backgroundImage !== null && 'url' in backgroundImage && (
            <>
              <Image
                src={backgroundImage.url!}
                alt={(backgroundImage as Media).alt || ''}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-navy/70" />
            </>
          )}
        </div>
      )}

      {/* Content container */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 ${
          variant === 'split' ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''
        }`}
      >
        <div className={variant === 'split' ? '' : 'max-w-3xl mx-auto'}>
          {subtitle && (
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-teal-light mb-3 md:mb-4">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight">
            {title}
          </h1>
          {description && (
            <div className="text-sm md:text-base opacity-90 mb-6 md:mb-8 leading-relaxed">
              {serializeLexical({ nodes: description })}
            </div>
          )}
          {buttons && buttons.length > 0 && (
            <div
              className={`flex gap-3 ${
                variant === 'default' || variant === 'centered' ? 'justify-center' : ''
              } flex-wrap`}
            >
              {buttons.map((btn, idx) => {
                if (!btn || typeof btn !== 'object' || !('label' in btn) || !('link' in btn)) {
                  return null
                }
                const buttonStyle = 'style' in btn ? btn.style : 'primary'
                return (
                  <Link
                    key={idx}
                    href={btn.link}
                    className={`inline-block px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                      buttonStyles[buttonStyle as keyof typeof buttonStyles]
                    }`}
                  >
                    {btn.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Split layout visual placeholder */}
        {variant === 'split' && (
          <div className="bg-grey-light rounded-2xl aspect-video flex items-center justify-center text-6xl">
            📱
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroBlockComponent
