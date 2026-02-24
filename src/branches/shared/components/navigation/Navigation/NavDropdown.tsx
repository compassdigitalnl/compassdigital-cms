/**
 * NavDropdown Component
 *
 * Dropdown for branches navigation (industry sectors)
 * 2-column grid with emoji icons
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { BranchItem } from '@/globals/Header.types'

export interface NavDropdownProps {
  branches: BranchItem[]
}

export function NavDropdown({ branches }: NavDropdownProps) {
  return (
    <div className="nav-dropdown">
      <div className="dropdown-grid">
        {branches.map((branch, index) => (
          <Link key={index} href={branch.url} className="branch-link">
            <div
              className="branch-icon"
              style={{ backgroundColor: branch.iconBg || 'var(--color-surface, #f5f5f5)' }}
            >
              <span className="branch-emoji" aria-hidden="true">
                {branch.emoji}
              </span>
            </div>
            <div className="branch-content">
              <div className="branch-name">{branch.name}</div>
              {branch.productCount !== undefined && (
                <div className="branch-count">{branch.productCount} producten</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: var(--color-white, #fff);
          border-radius: 12px;
          padding: var(--space-4, 16px);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          z-index: 200;
          min-width: 400px;
        }

        .dropdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-2, 8px);
        }

        :global(.branch-link) {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          background: var(--color-surface, #f5f5f5);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        :global(.branch-link:hover) {
          background: var(--color-primary, #0a1628);
          color: var(--color-white, #fff);
          transform: translateY(-2px);
        }

        .branch-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .branch-emoji {
          font-size: 20px;
        }

        .branch-content {
          flex: 1;
          min-width: 0;
        }

        .branch-name {
          font-size: var(--font-size-sm, 13px);
          font-weight: 600;
          color: var(--color-text-primary, #0a1628);
          margin-bottom: 2px;
        }

        :global(.branch-link:hover) .branch-name {
          color: var(--color-white, #fff);
        }

        .branch-count {
          font-size: var(--font-size-xs, 11px);
          color: var(--color-text-muted, #666);
        }

        :global(.branch-link:hover) .branch-count {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Tablet: single column */
        @media (min-width: 768px) and (max-width: 1023px) {
          .nav-dropdown {
            min-width: 300px;
          }

          .dropdown-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
