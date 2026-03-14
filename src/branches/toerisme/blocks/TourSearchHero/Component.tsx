import React from 'react'
import { SearchWidget } from '../../components/SearchWidget'
import type { TourSearchHeroProps } from './types'

export function TourSearchHeroComponent(props: TourSearchHeroProps) {
  const {
    heading,
    subheading,
    showSearchWidget = true,
    backgroundStyle = 'gradient',
    backgroundImage,
  } = props

  const bgImageUrl = backgroundImage && typeof backgroundImage === 'object' ? backgroundImage.url : undefined

  const getBackgroundStyle = (): React.CSSProperties => {
    if (backgroundStyle === 'image' && bgImageUrl) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    if (backgroundStyle === 'solid') {
      return {
        backgroundColor: 'var(--color-primary)',
      }
    }
    // Default: gradient
    return {
      background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
    }
  }

  return (
    <section
      className="relative px-4 py-16 md:py-24 lg:py-32"
      style={getBackgroundStyle()}
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          {heading && (
            <h1 className="mb-4 text-3xl font-extrabold text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          )}
          {subheading && (
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              {subheading}
            </p>
          )}
        </div>

        {showSearchWidget && (
          <div className="mx-auto max-w-4xl">
            <SearchWidget />
          </div>
        )}
      </div>
    </section>
  )
}
