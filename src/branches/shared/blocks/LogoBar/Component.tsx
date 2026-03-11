import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { LogoBarBlockProps, LogoBarVariant, LogoBarContext, LogoItem } from './types'
import type { Media } from '@/payload-types'

/**
 * B-42 LogoBar Block Component (Server)
 *
 * Generic logo bar. Static: grid. Scroll: infinite CSS scroll animation.
 * Grayscale filter with color on hover.
 * Supports: customers, certifications, partners contexts.
 */

const contextDefaults: Record<LogoBarContext, string> = {
  customers: 'Vertrouwd door',
  certifications: 'Gecertificeerd',
  partners: 'Onze partners',
}

function LogoImage({
  item,
  grayscale,
}: {
  item: LogoItem
  grayscale: boolean
}) {
  const logoData = typeof item.logo === 'object' ? (item.logo as Media) : null
  if (!logoData?.url) return null

  const imgElement = (
    <Image
      src={logoData.url}
      alt={item.name || logoData.alt || 'Logo'}
      width={120}
      height={60}
      className={`h-10 w-auto max-w-[120px] object-contain transition-all duration-300 md:h-12 md:max-w-[160px] ${
        grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''
      }`}
    />
  )

  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center"
        aria-label={item.name || 'Website'}
      >
        {imgElement}
      </a>
    )
  }

  return <div className="inline-flex items-center justify-center">{imgElement}</div>
}

export const LogoBarBlockComponent: React.FC<LogoBarBlockProps> = ({
  context = 'customers',
  title,
  logos,
  variant = 'static',
  grayscale = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validLogos = (logos || []) as LogoItem[]
  if (validLogos.length === 0) return null

  const currentVariant = (variant || 'static') as LogoBarVariant
  const currentContext = (context || 'customers') as LogoBarContext
  const displayTitle = title || contextDefaults[currentContext]

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="logo-bar-block bg-white py-8 md:py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        {displayTitle && (
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-grey-mid">
            {displayTitle}
          </p>
        )}

        {/* Static grid */}
        {currentVariant === 'static' && (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {validLogos.map((item, index) => (
              <LogoImage key={item.id || index} item={item} grayscale={grayscale ?? true} />
            ))}
          </div>
        )}

        {/* Infinite scroll */}
        {currentVariant === 'scroll' && (
          <div className="relative overflow-hidden">
            {/* Gradient masks for edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

            <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Duplicate items for seamless loop */}
              {[...validLogos, ...validLogos].map((item, index) => (
                <div
                  key={`${item.id || index}-${index}`}
                  className="mx-6 flex shrink-0 items-center md:mx-10"
                >
                  <LogoImage item={item} grayscale={grayscale ?? true} />
                </div>
              ))}
            </div>

            {/* CSS keyframes for scroll animation */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `,
            }} />
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default LogoBarBlockComponent
