import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { serializeLexical } from '@/utilities/serializeLexical'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { HeroBlockProps, HeroVariant, HeroBackgroundStyle, HeroBackgroundColor, HeroButtonStyle } from './types'
import type { Media } from '@/payload-types'

/**
 * B-01 Hero Block Component
 *
 * Full-width hero section with 3 layout variants and flexible backgrounds.
 * Wrapped in AnimationWrapper for scroll-triggered animations.
 *
 * Variants:
 * - default: centered full-width hero with gradient bg
 * - split: grid md:grid-cols-2, text left image right
 * - centered: compact centered version
 */

const variantClasses: Record<HeroVariant, string> = {
  default: 'text-center py-16 md:py-24 lg:py-32',
  split: 'py-12 md:py-20 lg:py-24',
  centered: 'text-center py-10 md:py-14 lg:py-16',
}

const solidBgClasses: Record<HeroBackgroundColor, string> = {
  navy: 'bg-navy text-white',
  white: 'bg-white text-navy',
  bg: 'bg-grey-light text-navy',
  teal: 'bg-teal text-white',
}

const buttonStyleClasses: Record<HeroButtonStyle, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-outline-neutral',
  ghost: 'btn btn-ghost',
}

function getBackgroundClass(
  backgroundStyle: HeroBackgroundStyle,
  backgroundColor: HeroBackgroundColor,
): string {
  switch (backgroundStyle) {
    case 'gradient':
      return 'bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden'
    case 'image':
      return 'relative text-white'
    case 'solid':
      return solidBgClasses[backgroundColor] || solidBgClasses.navy
    default:
      return solidBgClasses.navy
  }
}

export const HeroBlockComponent: React.FC<HeroBlockProps> = ({
  subtitle,
  title,
  description,
  buttons,
  heroImage,
  variant = 'default',
  backgroundStyle = 'gradient',
  backgroundImage,
  backgroundColor = 'navy',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'default') as HeroVariant
  const currentBgStyle = (backgroundStyle || 'gradient') as HeroBackgroundStyle
  const currentBgColor = (backgroundColor || 'navy') as HeroBackgroundColor

  const bgClass = getBackgroundClass(currentBgStyle, currentBgColor)
  const resolvedBgImage =
    typeof backgroundImage === 'object' && backgroundImage !== null ? (backgroundImage as Media) : null
  const resolvedHeroImage =
    typeof heroImage === 'object' && heroImage !== null ? (heroImage as Media) : null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`hero-block ${variantClasses[currentVariant]} ${bgClass} rounded-2xl`}
    >
      {/* Gradient glow effect */}
      {currentBgStyle === 'gradient' && (
        <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,_var(--color-primary-glow),_transparent_70%)] rounded-full pointer-events-none" />
      )}

      {/* Background image with dark overlay */}
      {currentBgStyle === 'image' && resolvedBgImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={resolvedBgImage.url}
            alt={resolvedBgImage.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
      )}

      {/* Content container */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 ${
          currentVariant === 'split' ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''
        }`}
      >
        <div className={currentVariant === 'split' ? '' : 'max-w-3xl mx-auto'}>
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
              className={`flex gap-3 flex-wrap ${
                currentVariant === 'default' || currentVariant === 'centered' ? 'justify-center' : ''
              }`}
            >
              {buttons.map((btn, idx) => {
                if (!btn || typeof btn !== 'object' || !btn.label || !btn.link) return null
                const style = (btn.style || 'primary') as HeroButtonStyle
                return (
                  <Link
                    key={btn.id || idx}
                    href={btn.link}
                    className={buttonStyleClasses[style] || buttonStyleClasses.primary}
                  >
                    {btn.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Split variant: hero image */}
        {currentVariant === 'split' && (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-grey-light">
            {resolvedHeroImage?.url ? (
              <Image
                src={resolvedHeroImage.url}
                alt={resolvedHeroImage.alt || title || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-grey-dark text-sm">
                Geen afbeelding geselecteerd
              </div>
            )}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default HeroBlockComponent
