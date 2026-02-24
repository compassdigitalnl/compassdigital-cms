/**
 * MegaMenu Component
 *
 * Full mega menu with multi-column layout
 * Supports promo cards for featured products
 */

'use client'

import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { MegaMenuColumn } from '@/globals/Header.types'

export interface MegaMenuProps {
  columns: MegaMenuColumn[]
}

export function MegaMenu({ columns }: MegaMenuProps) {
  return (
    <div className="mega-menu">
      <div className="mega-menu-grid">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="mega-menu-column">
            {column.title && <div className="column-title">{column.title}</div>}

            {column.links && column.links.length > 0 && (
              <ul className="column-links">
                {column.links.map((link, linkIndex) => {
                  const IconComponent = link.icon
                    ? (LucideIcons as any)[
                        link.icon
                          .split('-')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join('')
                      ]
                    : null

                  return (
                    <li key={linkIndex}>
                      <Link href={link.url} className="mega-link">
                        {IconComponent && (
                          <div className="link-icon">
                            <IconComponent size={16} aria-hidden="true" />
                          </div>
                        )}
                        <div className="link-content">
                          <div className="link-label">{link.label}</div>
                          {link.description && (
                            <div className="link-description">{link.description}</div>
                          )}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Promo Card (optional) */}
            {column.showPromoCard && column.promoProduct && (
              <div className="promo-card">
                <div className="promo-badge">Featured</div>
                <div className="promo-title">Featured Product</div>
                <div className="promo-description">
                  Check out our latest product offering
                </div>
                <Link href={`/products/${column.promoProduct}`} className="promo-button">
                  View Product →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mega-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--color-white, #fff);
          border-radius: 12px;
          padding: var(--space-6, 24px);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          z-index: 200;
          max-width: var(--page-width, 1440px);
          margin: 0 auto;
        }

        .mega-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-6, 24px);
        }

        .mega-menu-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .column-title {
          font-size: var(--font-size-sm, 13px);
          font-weight: 700;
          color: var(--color-text-primary, #0a1628);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: var(--space-2, 8px);
          border-bottom: 2px solid var(--color-border, #e0e0e0);
        }

        .column-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-1, 4px);
        }

        :global(.mega-link) {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        :global(.mega-link:hover) {
          background: var(--color-surface, #f5f5f5);
        }

        .link-icon {
          color: var(--color-primary, #0a1628);
          flex-shrink: 0;
          padding-top: 2px;
        }

        .link-content {
          flex: 1;
          min-width: 0;
        }

        .link-label {
          font-size: var(--font-size-sm, 13px);
          font-weight: 600;
          color: var(--color-text-primary, #0a1628);
          margin-bottom: 2px;
        }

        .link-description {
          font-size: var(--font-size-xs, 11px);
          color: var(--color-text-muted, #666);
          line-height: 1.4;
        }

        /* Promo Card */
        .promo-card {
          background: linear-gradient(135deg, var(--color-primary, #0a1628) 0%, #1a2b4a 100%);
          padding: var(--space-4, 16px);
          border-radius: 8px;
          color: var(--color-white, #fff);
          margin-top: var(--space-2, 8px);
        }

        .promo-badge {
          display: inline-block;
          background: var(--color-accent, #00d4aa);
          color: var(--color-white, #fff);
          font-size: var(--font-size-xs, 10px);
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-2, 8px);
        }

        .promo-title {
          font-size: var(--font-size-sm, 13px);
          font-weight: 700;
          margin-bottom: var(--space-1, 4px);
        }

        .promo-description {
          font-size: var(--font-size-xs, 11px);
          opacity: 0.8;
          margin-bottom: var(--space-3, 12px);
        }

        :global(.promo-button) {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1, 4px);
          background: var(--color-white, #fff);
          color: var(--color-primary, #0a1628);
          padding: var(--space-2, 8px) var(--space-3, 12px);
          border-radius: 6px;
          font-size: var(--font-size-xs, 11px);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        :global(.promo-button:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Tablet: 2 columns max */
        @media (min-width: 768px) and (max-width: 1023px) {
          .mega-menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
