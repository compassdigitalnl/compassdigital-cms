/**
 * Topbar Component
 *
 * Top navigation bar with USP messages, language switcher, and price toggle
 * Height: 36px | Background: var(--color-navy) | Text: white
 */

'use client'

import React from 'react'
import type { TopbarConfig, LanguageSwitcherConfig, PriceToggleConfig } from '@/globals/Header.types'
import { TopbarLinks } from './TopbarLinks'
import { TopbarRight } from './TopbarRight'

export interface TopbarProps {
  config?: TopbarConfig
  languageSwitcher?: LanguageSwitcherConfig
  priceToggle?: PriceToggleConfig
  backgroundColor?: string
  textColor?: string
}

export function Topbar({
  config,
  languageSwitcher,
  priceToggle,
  backgroundColor = 'var(--color-primary)',
  textColor = 'var(--color-white)',
}: TopbarProps) {
  // Don't render if disabled
  if (!config?.enabled) {
    return null
  }

  return (
    <div
      className="topbar"
      style={{
        backgroundColor: config.backgroundColor || backgroundColor,
        color: config.textColor || textColor,
      }}
    >
      <div className="topbar-container">
        {/* Left side: Messages/Links */}
        {config.leftMessages && config.leftMessages.length > 0 && (
          <TopbarLinks messages={config.leftMessages} textColor={config.textColor || textColor} />
        )}

        {/* Right side: Language + Price Toggle */}
        <TopbarRight
          languageSwitcher={languageSwitcher}
          priceToggle={priceToggle}
          textColor={config.textColor || textColor}
        />
      </div>

      <style jsx>{`
        .topbar {
          width: 100%;
          height: 36px;
          display: flex;
          align-items: center;
          font-size: var(--font-size-sm, 12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .topbar-container {
          width: 100%;
          max-width: var(--page-width, 1440px);
          margin: 0 auto;
          padding: 0 var(--space-4, 16px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4, 16px);
        }

        /* Mobile: hide on small screens (optional) */
        @media (max-width: 767px) {
          .topbar {
            display: none; /* Can be toggled via config if needed */
          }
        }
      `}</style>
    </div>
  )
}
