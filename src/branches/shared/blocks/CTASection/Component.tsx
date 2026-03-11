import React from 'react'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type {
  CTASectionBlockProps,
  CTASectionVariant,
  CTASectionButtonStyle,
  CTASectionButtonIcon,
} from './types'

/**
 * B-45 CTA Section Block Component
 *
 * High-impact call-to-action section with decorative glows.
 * 3 background variants: navy (dark), teal (teal gradient), white (light).
 * Centered layout with overline, title, description, and up to 2 buttons.
 */

function getVariantClasses(variant: CTASectionVariant): string {
  switch (variant) {
    case 'navy':
      return 'bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden'
    case 'teal':
      return 'bg-gradient-to-br from-teal to-teal-dark text-white relative overflow-hidden'
    case 'white':
      return 'bg-white text-navy border border-grey-light'
    default:
      return 'bg-gradient-to-br from-navy to-navy-light text-white relative overflow-hidden'
  }
}

function isDarkVariant(variant: CTASectionVariant): boolean {
  return variant === 'navy' || variant === 'teal'
}

function getButtonClasses(style: CTASectionButtonStyle, dark: boolean): string {
  if (style === 'secondary') {
    return dark ? 'btn btn-ghost' : 'btn btn-outline-neutral'
  }
  // primary
  return dark ? 'btn btn-outline-light' : 'btn btn-primary'
}

function renderIcon(icon: CTASectionButtonIcon) {
  if (!icon) return null

  const cls = 'w-4 h-4 ml-2 inline'

  switch (icon) {
    case 'arrow-right':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.19l-3.72-3.72a.75.75 0 011.06-1.06l5 5a.75.75 0 010 1.06l-5 5a.75.75 0 11-1.06-1.06l3.72-3.72H3.75A.75.75 0 013 10z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1l2.39 5.64L18 7.24l-4.13 3.73L15.18 17 10 13.77 4.82 17l1.31-6.03L2 7.24l5.61-.6L10 1z" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M3 4a2 2 0 00-2 2v1.161l9 3.538 9-3.538V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-9 3.538-9-3.538V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
      )
    case 'phone':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.65 1.548l-.762.506a.5.5 0 00-.18.593c.498 1.39 1.703 2.595 3.093 3.093a.5.5 0 00.593-.18l.506-.762a1.5 1.5 0 011.548-.65l3.223.716A1.5 1.5 0 0118 12.352v1.148A1.5 1.5 0 0116.5 15h-1c-7.18 0-13-5.82-13-13v-1.5z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'calendar':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
            clipRule="evenodd"
          />
        </svg>
      )
    default:
      return null
  }
}

export const CTASectionBlockComponent: React.FC<CTASectionBlockProps> = ({
  overline,
  title,
  description,
  buttons,
  variant = 'navy',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'navy') as CTASectionVariant
  const dark = isDarkVariant(currentVariant)
  const variantClasses = getVariantClasses(currentVariant)

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`cta-section-block py-12 md:py-16 lg:py-20 rounded-2xl ${variantClasses}`}
    >
      {/* Decorative glow effects for dark variants */}
      {dark && (
        <>
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,_var(--color-primary-glow),_transparent_70%)] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-30px] left-[-30px] w-[160px] h-[160px] bg-[radial-gradient(circle,_var(--color-primary-glow),_transparent_70%)] rounded-full pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-[720px] mx-auto px-6 text-center">
        {/* Overline */}
        {overline && (
          <span
            className={`block text-[11px] uppercase tracking-wider font-bold mb-3 ${
              dark ? 'text-teal-light' : 'text-teal'
            }`}
          >
            {overline}
          </span>
        )}

        {/* Title */}
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-3">{title}</h2>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base opacity-90 leading-relaxed mb-6">{description}</p>
        )}

        {/* Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap mt-6">
            {buttons.map((btn, idx) => {
              if (!btn || typeof btn !== 'object' || !btn.text || !btn.href) return null
              const style = (btn.style || 'primary') as CTASectionButtonStyle
              const icon = (btn.icon || null) as CTASectionButtonIcon
              return (
                <Link
                  key={btn.id || idx}
                  href={btn.href}
                  className={getButtonClasses(style, dark)}
                >
                  {btn.text}
                  {renderIcon(icon)}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default CTASectionBlockComponent
