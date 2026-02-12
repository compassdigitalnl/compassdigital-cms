'use client'

import React from 'react'
import type { LogoBarBlock } from '@/payload-types'
import Image from 'next/image'

export const LogoBarBlockComponent: React.FC<LogoBarBlock> = ({ heading, source, partners, logos, layout }) => {
  // Determine which data source to use
  const logoData = React.useMemo(() => {
    if (source === 'collection' && partners && Array.isArray(partners)) {
      // Collection mode: transform Partner objects to match logos structure
      return partners.map((partner) => {
        if (typeof partner === 'object' && partner !== null && 'name' in partner) {
          return {
            name: partner.name,
            image: partner.logo,
            link: partner.website,
          }
        }
        return null
      }).filter(Boolean)
    }
    // Manual mode: use logos array
    return logos || []
  }, [source, partners, logos])

  const isCarousel = layout === 'carousel'

  return (
    <section className="logo-bar py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        {heading && <p className="text-center text-gray-600 mb-8 font-medium">{heading}</p>}

        <div className={`${isCarousel ? 'overflow-hidden' : 'flex flex-wrap justify-center items-center gap-8 md:gap-12'}`}>
          {isCarousel ? (
            <div
              className="flex gap-8 md:gap-12"
              style={{
                animation: 'logoScroll 30s linear infinite',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running'
              }}
            >
              {logoData?.map((logo, index) => (
                <LogoItem key={index} logo={logo} />
              ))}
              {/* Duplicate for seamless loop */}
              {logoData?.map((logo, index) => (
                <LogoItem key={`dup-${index}`} logo={logo} />
              ))}
            </div>
          ) : (
            logoData?.map((logo, index) => (
              <LogoItem key={index} logo={logo} />
            ))
          )}
        </div>

        {/* CSS animation via style tag - cleaner than styled-jsx */}
        {isCarousel && (
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes logoScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `
          }} />
        )}
      </div>
    </section>
  )
}

const LogoItem: React.FC<{ logo: any }> = ({ logo }) => {
  const imageObj = typeof logo.image === 'object' && logo.image !== null ? logo.image : null
  const imageUrl = imageObj?.url || (typeof logo.image === 'string' ? logo.image : null)

  const content = (
    <div className="logo-item opacity-60 hover:opacity-100 transition-opacity duration-300 min-w-[120px] flex items-center justify-center">
      {imageUrl ? (
        <div className="relative w-32 h-16">
          <Image
            src={imageUrl}
            alt={logo.name || 'Partner logo'}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-gray-600 font-medium">{logo.name}</span>
      )}
    </div>
  )

  return logo.link ? (
    <a href={logo.link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}
