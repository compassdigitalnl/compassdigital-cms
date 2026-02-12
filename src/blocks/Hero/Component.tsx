'use client'
import React from 'react'
import type { HeroBlock } from '@/payload-types'
import { OptimizedBackgroundImage, OptimizedImage } from '@/components/OptimizedImage'

export const HeroBlockComponent: React.FC<HeroBlock> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  style,
  backgroundImage,
  backgroundImageUrl,
}) => {
  const hasImage = style === 'image' && (backgroundImage || backgroundImageUrl)

  // Use OptimizedBackgroundImage for better performance
  if (hasImage) {
    return (
      <OptimizedBackgroundImage
        media={backgroundImage || backgroundImageUrl || ''}
        alt={title || 'Hero background'}
        overlay="dark"
        className="hero py-20 px-4"
      >
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h1 className="text-5xl font-bold mb-6">{title}</h1>
          {subtitle && <p className="text-xl mb-8">{subtitle}</p>}

          <div className="flex gap-4 justify-center">
            {primaryCTA?.text && (
              <a
                href={primaryCTA.link}
                className="btn btn-primary px-6 py-3 text-white rounded-lg"
                style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
              >
                {primaryCTA.text}
              </a>
            )}
            {secondaryCTA?.text && (
              <a
                href={secondaryCTA.link}
                className="btn btn-secondary px-6 py-3 border-2 border-white rounded-lg bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
              >
                {secondaryCTA.text}
              </a>
            )}
          </div>
        </div>
      </OptimizedBackgroundImage>
    )
  }

  // No image variant
  return (
    <section className="hero relative py-20 px-4" data-style={style}>

      {/* Content */}
      <div className={`container mx-auto max-w-4xl text-center relative z-10 ${hasImage ? 'text-white' : ''}`}>
        <h1 className="text-5xl font-bold mb-6">{title}</h1>
        {subtitle && <p className="text-xl mb-8">{subtitle}</p>}

        <div className="flex gap-4 justify-center">
          {primaryCTA?.text && (
            <a
              href={primaryCTA.link}
              className="btn btn-primary px-6 py-3 text-white rounded-lg"
              style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
            >
              {primaryCTA.text}
            </a>
          )}
          {secondaryCTA?.text && (
            <a
              href={secondaryCTA.link}
              className="btn btn-secondary px-6 py-3 border-2 rounded-lg transition-all duration-300 hover:text-white"
              style={{
                borderColor: hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)',
                color: hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)',
                backgroundColor: hasImage ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hasImage
                  ? 'white'
                  : 'var(--color-secondary, #8b5cf6)'
                e.currentTarget.style.color = hasImage
                  ? 'var(--color-primary, #3b82f6)'
                  : 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hasImage
                  ? 'rgba(255, 255, 255, 0.1)'
                  : ''
                e.currentTarget.style.color = hasImage ? 'white' : 'var(--color-secondary, #8b5cf6)'
              }}
            >
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
