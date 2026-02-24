/**
 * Navigation Component
 *
 * Main navigation bar with support for:
 * - Simple links
 * - Mega menus (multi-column dropdowns)
 * - Branches dropdown (industry navigation)
 */

'use client'

import React from 'react'
import type { NavigationConfig } from '@/globals/Header.types'
import { NavItem } from './NavItem'

export interface NavigationProps {
  config?: NavigationConfig
  variant?: 'full' | 'inline' | 'compact' // Full: separate bar, Inline: within header, Compact: minimal
  backgroundColor?: string
  textColor?: string
  className?: string
}

export function Navigation({
  config,
  variant = 'full',
  backgroundColor = 'var(--color-primary)',
  textColor = 'var(--color-white)',
  className = '',
}: NavigationProps) {
  const items = config?.items || []

  // Don't render if no items
  if (items.length === 0) {
    return null
  }

  return (
    <nav
      className={`navigation ${variant} ${className}`}
      style={{
        backgroundColor: variant === 'full' ? backgroundColor : 'transparent',
        color: variant === 'full' ? textColor : 'inherit',
      }}
      aria-label="Main navigation"
    >
      <div className="navigation-container">
        <ul className="navigation-list">
          {items.map((item, index) => (
            <NavItem key={index} item={item} textColor={textColor} />
          ))}
        </ul>

        {/* CTA Button (optional) */}
        {config?.ctaButton?.show && config.ctaButton.link && (
          <a href={config.ctaButton.link} className="nav-cta-button">
            {config.ctaButton.text || 'Get Started'}
          </a>
        )}
      </div>

      <style jsx>{`
        .navigation {
          width: 100%;
          position: relative;
        }

        .navigation.full {
          height: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navigation.inline {
          height: auto;
        }

        .navigation.compact {
          height: auto;
        }

        .navigation-container {
          width: 100%;
          max-width: var(--page-width, 1440px);
          margin: 0 auto;
          padding: 0 var(--space-4, 16px);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4, 16px);
        }

        .navigation-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          gap: var(--space-1, 4px);
          flex: 1;
        }

        .nav-cta-button {
          background: var(--color-accent, #00d4aa);
          color: var(--color-white, #fff);
          padding: var(--space-2, 8px) var(--space-4, 16px);
          border-radius: 8px;
          text-decoration: none;
          font-size: var(--font-size-sm, 13px);
          font-weight: 600;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
        }

        /* Mobile: hide full navigation (use mobile drawer instead) */
        @media (max-width: 767px) {
          .navigation.full {
            display: none;
          }
        }

        /* Tablet: simplified navigation */
        @media (min-width: 768px) and (max-width: 1023px) {
          .navigation-list {
            gap: 0;
          }

          .nav-cta-button {
            padding: var(--space-2, 8px) var(--space-3, 12px);
            font-size: var(--font-size-xs, 12px);
          }
        }
      `}</style>
    </nav>
  )
}
