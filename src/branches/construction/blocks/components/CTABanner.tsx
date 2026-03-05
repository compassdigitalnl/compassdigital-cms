/**
 * CTABannerComponent - Call-to-action banner block
 *
 * Features:
 * - Multiple style variants (gradient, solid, outlined, image)
 * - Multiple button support
 * - Trust elements with icons
 * - Background image support
 * - Configurable alignment and size
 */

import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { CTABannerBlock, Media } from '@/payload-types'

export const CTABannerComponent: React.FC<CTABannerBlock> = ({
  style = 'gradient',
  backgroundImage,
  badge,
  title,
  description,
  buttons,
  trustElements,
  alignment = 'center',
  size = 'medium',
}) => {
  // Get background image URL
  const bgImageUrl =
    style === 'image' && typeof backgroundImage === 'object' && backgroundImage !== null
      ? (backgroundImage as Media).url
      : null

  // Style classes
  const styleClasses = {
    gradient: 'bg-gradient-to-r from-primary to-primary-light',
    solid: 'bg-primary',
    outlined: 'bg-white border-2 border-primary',
    image: bgImageUrl ? `bg-cover bg-center relative` : 'bg-primary',
  }
  const currentStyle = style || 'gradient'
  const styleClass = styleClasses[currentStyle] || styleClasses.gradient

  const isDark = currentStyle === 'gradient' || currentStyle === 'solid' || (currentStyle === 'image' && bgImageUrl)
  const textColor = isDark ? 'text-white' : 'text-secondary-color'

  // Size classes
  const sizeClasses = {
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-16',
    large: 'py-16 md:py-20 lg:py-24',
  }
  const currentSize = size || 'medium'
  const sizeClass = sizeClasses[currentSize] || sizeClasses.medium

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  }
  const currentAlignment = alignment || 'center'
  const alignmentClass = alignmentClasses[currentAlignment] || alignmentClasses.center

  // Trust icon map
  const trustIconMap: Record<string, any> = {
    check: 'CheckCircle',
    star: 'Star',
    trophy: 'Trophy',
    lock: 'Lock',
    lightning: 'Zap',
  }

  return (
    <section className={`${styleClass} ${sizeClass} relative overflow-hidden`}>
      {/* Background Image */}
      {style === 'image' && bgImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
          />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl ${alignment === 'center' ? 'mx-auto' : ''} ${alignmentClass}`}>
          {/* Badge */}
          {badge && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 ${
                isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-primary-glow border-primary/20 text-primary'
              } border rounded-full text-sm font-semibold mb-4`}
            >
              <span>{badge}</span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${textColor} mb-4`}>
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className={`text-lg md:text-xl ${isDark ? 'text-white/80' : 'text-grey-mid'} mb-8 max-w-2xl ${alignment === 'center' ? 'mx-auto' : ''}`}>
              {description}
            </p>
          )}

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 ${alignment === 'center' ? 'justify-center' : ''} mb-6`}>
              {buttons.map((button, index) => {
                const currentVariant = button.variant || 'primary'
                const buttonVariantClasses = {
                  primary: isDark ? 'btn btn-secondary' : 'btn btn-primary',
                  secondary: isDark ? 'btn btn-outline-neutral' : 'btn btn-outline-primary',
                  white: 'btn btn-secondary',
                }
                const buttonClass = buttonVariantClasses[currentVariant] || buttonVariantClasses.primary

                return (
                  <Link
                    key={index}
                    href={button.link || '/'}
                    className={`${buttonClass} inline-flex items-center gap-2`}
                  >
                    {button.text}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Trust Elements */}
          {trustElements?.enabled && trustElements.items && trustElements.items.length > 0 && (
            <div className={`flex flex-wrap gap-6 ${alignment === 'center' ? 'justify-center' : ''} mt-8`}>
              {trustElements.items.map((item, index) => {
                const currentIcon = item.icon || 'check'
                const iconName = trustIconMap[currentIcon] || 'CheckCircle'
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon
                      name={iconName}
                      size={20}
                      className={isDark ? 'text-white/80' : 'text-primary'}
                    />
                    <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-grey-mid'}`}>
                      {item.text}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
