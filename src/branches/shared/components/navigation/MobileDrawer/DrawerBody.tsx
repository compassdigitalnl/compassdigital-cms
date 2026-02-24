/**
 * DrawerBody Component
 *
 * Mobile drawer body with accordion navigation
 * Scrollable content area
 */

'use client'

import React from 'react'
import type { NavigationConfig } from '@/globals/Header.types'
import { DrawerAccordion } from './DrawerAccordion'
import Link from 'next/link'

export interface DrawerBodyProps {
  navigationConfig?: NavigationConfig
  onLinkClick: () => void
}

export function DrawerBody({ navigationConfig, onLinkClick }: DrawerBodyProps) {
  const items = navigationConfig?.items || []

  return (
    <div className="drawer-body">
      <nav className="drawer-nav" aria-label="Mobile navigation">
        {items.map((item, index) => {
          // Simple link (no accordion)
          if (item.type === 'link' && item.url) {
            return (
              <Link
                key={index}
                href={item.url}
                onClick={onLinkClick}
                className="drawer-link"
              >
                <span>{item.label}</span>
              </Link>
            )
          }

          // Accordion for mega menus and branches
          if (item.type === 'mega' || item.type === 'branches') {
            return (
              <DrawerAccordion
                key={index}
                item={item}
                onLinkClick={onLinkClick}
              />
            )
          }

          return null
        })}

        {/* CTA Button (if configured) */}
        {navigationConfig?.ctaButton?.show && navigationConfig.ctaButton.link && (
          <a
            href={navigationConfig.ctaButton.link}
            onClick={onLinkClick}
            className="drawer-cta-button"
          >
            {navigationConfig.ctaButton.text || 'Get Started'}
          </a>
        )}
      </nav>

      <style jsx>{`
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--space-4, 16px);
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1, 4px);
        }

        :global(.drawer-link) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3, 12px) var(--space-4, 16px);
          background: transparent;
          border-radius: 8px;
          text-decoration: none;
          color: var(--color-text-primary, #0a1628);
          font-size: var(--font-size-sm, 13px);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        :global(.drawer-link:hover),
        :global(.drawer-link:active) {
          background: var(--color-surface, #f5f5f5);
        }

        .drawer-cta-button {
          display: block;
          margin-top: var(--space-4, 16px);
          padding: var(--space-3, 12px) var(--space-4, 16px);
          background: var(--color-accent, #00d4aa);
          color: var(--color-white, #fff);
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          font-size: var(--font-size-sm, 13px);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .drawer-cta-button:active {
          transform: scale(0.98);
        }

        /* Scrollbar styling */
        .drawer-body::-webkit-scrollbar {
          width: 6px;
        }

        .drawer-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-body::-webkit-scrollbar-thumb {
          background: var(--color-border, #e0e0e0);
          border-radius: 3px;
        }

        .drawer-body::-webkit-scrollbar-thumb:hover {
          background: var(--color-grey-mid, #999);
        }
      `}</style>
    </div>
  )
}
