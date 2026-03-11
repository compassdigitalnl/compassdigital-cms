import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { CTABlockProps, CTAVariant, CTABackgroundStyle, CTAButtonStyle, CTASize, CTAAlignment } from './types'
import type { Media } from '@/payload-types'

/**
 * B-04 CTA Block Component
 *
 * Call-to-action section with 3 layout variants and flexible backgrounds.
 * Wrapped in AnimationWrapper for scroll-triggered animations.
 *
 * Variants:
 * - centered: text and buttons centered
 * - split: text left, buttons right
 * - banner: full-width colored band with compact padding
 *
 * Features:
 * - Badge: small pill/label above the title
 * - Trust elements: row of trust indicators below buttons
 * - Size: controls section padding (small/medium/large)
 * - Alignment: text alignment for non-split variants
 */

const buttonStyleClasses: Record<CTAButtonStyle, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-outline-neutral',
  ghost: 'btn btn-ghost',
}

const sizePaddingClasses: Record<CTASize, string> = {
  small: 'py-6 md:py-8',
  medium: 'py-12 md:py-16 lg:py-20',
  large: 'py-16 md:py-20 lg:py-28',
}

function getBackgroundClasses(
  backgroundStyle: CTABackgroundStyle,
): string {
  switch (backgroundStyle) {
    case 'gradient':
      return 'bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden'
    case 'solid':
      return 'bg-gradient-to-r from-teal to-teal-dark text-white'
    case 'image':
      return 'relative text-white'
    default:
      return 'bg-gradient-to-br from-navy to-navy-light text-white'
  }
}

/** SVG check icon fallback for trust elements (avoids client component requirement) */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

/** SVG shield-check icon for trust elements */
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

/** SVG clock icon for trust elements */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  )
}

/** Map common Lucide icon names to inline SVG components for server rendering */
function TrustIcon({ name, className }: { name?: string | null; className?: string }) {
  const iconName = (name || 'check').toLowerCase()
  switch (iconName) {
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheckIcon className={className} />
    case 'clock':
      return <ClockIcon className={className} />
    case 'check':
    default:
      return <CheckIcon className={className} />
  }
}

export const CTABlockComponent: React.FC<CTABlockProps> = ({
  title,
  description,
  buttons,
  badge,
  trustElements,
  variant = 'centered',
  backgroundStyle = 'gradient',
  backgroundImage,
  size = 'medium',
  alignment = 'center',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'centered') as CTAVariant
  const currentBgStyle = (backgroundStyle || 'gradient') as CTABackgroundStyle
  const currentSize = (size || 'medium') as CTASize
  const currentAlignment = (alignment || 'center') as CTAAlignment
  const resolvedBgImage =
    typeof backgroundImage === 'object' && backgroundImage !== null ? (backgroundImage as Media) : null

  const bgClasses = getBackgroundClasses(currentBgStyle)

  const isBanner = currentVariant === 'banner'
  const sectionPadding = isBanner ? 'py-8 md:py-10' : sizePaddingClasses[currentSize]

  // Alignment only applies to non-split variants
  const alignmentClass =
    currentVariant === 'split' ? '' : currentAlignment === 'left' ? 'text-left' : 'text-center'

  const hasTrustElements =
    trustElements?.enabled && trustElements?.items && trustElements.items.length > 0

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`cta-block ${sectionPadding} ${bgClasses} ${isBanner ? '' : 'rounded-2xl'}`}
    >
      {/* Gradient glow effect */}
      {currentBgStyle === 'gradient' && (
        <div className="absolute bottom-[-30px] left-[-30px] w-[160px] h-[160px] bg-[radial-gradient(circle,_var(--color-primary-glow),_transparent_70%)] rounded-full pointer-events-none" />
      )}

      {/* Background image with dark overlay */}
      {currentBgStyle === 'image' && resolvedBgImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={resolvedBgImage.url}
            alt={resolvedBgImage.alt || ''}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          className={
            currentVariant === 'split'
              ? 'flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8'
              : `${alignmentClass} max-w-3xl ${currentAlignment === 'left' ? '' : 'mx-auto'}`
          }
        >
          {/* Text content */}
          <div className={currentVariant === 'split' ? 'flex-1' : ''}>
            {/* Badge */}
            {badge && (
              <span className="inline-block text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-white/15 text-white/90 mb-4">
                {badge}
              </span>
            )}

            <h2 className="font-display text-2xl md:text-3xl mb-3">{title}</h2>
            {description && (
              <p className="text-sm md:text-base opacity-90 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div
              className={`flex gap-3 flex-wrap ${
                currentVariant === 'split'
                  ? 'shrink-0'
                  : `${currentAlignment === 'left' ? '' : 'justify-center'} mt-6`
              }`}
            >
              {buttons.map((btn, idx) => {
                if (!btn || typeof btn !== 'object' || !btn.label || !btn.link) return null
                const style = (btn.style || 'primary') as CTAButtonStyle
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

        {/* Trust elements */}
        {hasTrustElements && (
          <div
            className={`flex flex-wrap gap-4 md:gap-6 mt-6 md:mt-8 ${
              currentVariant === 'split'
                ? ''
                : currentAlignment === 'left'
                  ? ''
                  : 'justify-center'
            }`}
          >
            {trustElements.items!.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center gap-2 text-white/80 text-xs md:text-sm"
              >
                <TrustIcon name={item.icon} className="w-4 h-4 text-teal shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default CTABlockComponent
