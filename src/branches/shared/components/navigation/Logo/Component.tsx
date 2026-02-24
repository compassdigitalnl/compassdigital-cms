/**
 * Logo Component
 *
 * Responsive brand logo with optional site name
 * Supports both image logo and text-based branding
 */

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { LogoConfig } from '@/globals/Header.types'
import type { Media } from '@/payload-types'

export interface LogoProps {
  config?: LogoConfig
  siteName?: string
  className?: string
}

export function Logo({ config, siteName = 'SiteForge', className = '' }: LogoProps) {
  const logoUrl = config?.logoUrl || '/'
  const logoHeight = config?.logoHeight || 32
  const siteNameOverride = config?.siteNameOverride || siteName
  const accent = config?.siteNameAccent

  // Handle logo media (could be upload object or media ID)
  const logoMedia =
    config?.logoOverride && typeof config.logoOverride === 'object'
      ? (config.logoOverride as Media)
      : null

  const logoSrc = logoMedia?.url

  return (
    <Link href={logoUrl} className={`logo-link ${className}`} aria-label="Go to homepage">
      {logoSrc ? (
        <div className="logo-image-container">
          <Image
            src={logoSrc}
            alt={logoMedia?.alt || siteNameOverride}
            height={logoHeight}
            width={(logoHeight * 3) | 0} // Assume 3:1 aspect ratio
            className="logo-image"
            priority
          />
        </div>
      ) : (
        <div className="logo-text">
          {accent ? (
            <>
              {siteNameOverride.split(accent)[0]}
              <span className="logo-accent">{accent}</span>
              {siteNameOverride.split(accent)[1]}
            </>
          ) : (
            siteNameOverride
          )}
        </div>
      )}

      <style jsx>{`
        :global(.logo-link) {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s ease;
        }

        :global(.logo-link:hover) {
          opacity: 0.8;
        }

        .logo-image-container {
          display: flex;
          align-items: center;
          height: ${logoHeight}px;
        }

        :global(.logo-image) {
          height: auto;
          max-height: ${logoHeight}px;
          width: auto;
          object-fit: contain;
        }

        .logo-text {
          font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
          font-size: ${Math.max(logoHeight * 0.6, 18)}px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-text-primary, #0a1628);
        }

        .logo-accent {
          color: var(--color-accent, #00d4aa);
        }

        /* Mobile: slightly smaller */
        @media (max-width: 767px) {
          .logo-image-container {
            height: ${Math.max(logoHeight * 0.85, 24)}px;
          }

          :global(.logo-image) {
            max-height: ${Math.max(logoHeight * 0.85, 24)}px;
          }

          .logo-text {
            font-size: ${Math.max(logoHeight * 0.5, 16)}px;
          }
        }
      `}</style>
    </Link>
  )
}
