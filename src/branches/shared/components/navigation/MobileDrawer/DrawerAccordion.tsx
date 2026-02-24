/**
 * DrawerAccordion Component
 *
 * Accordion for mobile drawer navigation
 * Supports nested items (mega menus and branches)
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { NavItem } from '@/globals/Header.types'

export interface DrawerAccordionProps {
  item: NavItem
  onLinkClick: () => void
}

export function DrawerAccordion({ item, onLinkClick }: DrawerAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Mega menu accordion
  if (item.type === 'mega' && item.megaColumns) {
    return (
      <div className="drawer-accordion">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="accordion-trigger"
          aria-expanded={isOpen}
        >
          <span>{item.label}</span>
          <ChevronDown
            size={18}
            className={`accordion-chevron ${isOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="accordion-content">
            {item.megaColumns.map((column, colIndex) => (
              <div key={colIndex} className="accordion-section">
                {column.title && (
                  <div className="accordion-section-title">{column.title}</div>
                )}
                {column.links && column.links.length > 0 && (
                  <div className="accordion-links">
                    {column.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        onClick={onLinkClick}
                        className="accordion-link"
                      >
                        <span className="link-label">{link.label}</span>
                        {link.description && (
                          <span className="link-description">{link.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          .drawer-accordion {
            display: flex;
            flex-direction: column;
          }

          .accordion-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: var(--space-3, 12px) var(--space-4, 16px);
            background: transparent;
            border: none;
            border-radius: 8px;
            color: var(--color-text-primary, #0a1628);
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .accordion-trigger:hover,
          .accordion-trigger:active {
            background: var(--color-surface, #f5f5f5);
          }

          :global(.accordion-chevron) {
            transition: transform 0.2s ease;
            flex-shrink: 0;
          }

          :global(.accordion-chevron.open) {
            transform: rotate(180deg);
          }

          .accordion-content {
            padding: var(--space-2, 8px) 0 var(--space-2, 8px) var(--space-4, 16px);
            display: flex;
            flex-direction: column;
            gap: var(--space-3, 12px);
          }

          .accordion-section {
            display: flex;
            flex-direction: column;
            gap: var(--space-1, 4px);
          }

          .accordion-section-title {
            font-size: var(--font-size-xs, 11px);
            font-weight: 700;
            color: var(--color-text-muted, #666);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: var(--space-2, 8px) var(--space-3, 12px);
          }

          .accordion-links {
            display: flex;
            flex-direction: column;
            gap: var(--space-1, 4px);
          }

          :global(.accordion-link) {
            display: flex;
            flex-direction: column;
            padding: var(--space-2, 8px) var(--space-3, 12px);
            background: transparent;
            border-radius: 6px;
            text-decoration: none;
            color: var(--color-text-primary, #0a1628);
            transition: all 0.2s ease;
          }

          :global(.accordion-link:hover),
          :global(.accordion-link:active) {
            background: var(--color-surface, #f5f5f5);
          }

          .link-label {
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            color: var(--color-text-primary, #0a1628);
          }

          .link-description {
            font-size: var(--font-size-xs, 11px);
            color: var(--color-text-muted, #666);
            margin-top: 2px;
            line-height: 1.4;
          }
        `}</style>
      </div>
    )
  }

  // Branches accordion
  if (item.type === 'branches' && item.branches) {
    return (
      <div className="drawer-accordion">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="accordion-trigger"
          aria-expanded={isOpen}
        >
          <span>{item.label}</span>
          <ChevronDown
            size={18}
            className={`accordion-chevron ${isOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="accordion-content">
            <div className="branches-grid">
              {item.branches.map((branch, index) => (
                <Link
                  key={index}
                  href={branch.url}
                  onClick={onLinkClick}
                  className="branch-link"
                >
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
          </div>
        )}

        <style jsx>{`
          .drawer-accordion {
            display: flex;
            flex-direction: column;
          }

          .accordion-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: var(--space-3, 12px) var(--space-4, 16px);
            background: transparent;
            border: none;
            border-radius: 8px;
            color: var(--color-text-primary, #0a1628);
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .accordion-trigger:hover,
          .accordion-trigger:active {
            background: var(--color-surface, #f5f5f5);
          }

          :global(.accordion-chevron) {
            transition: transform 0.2s ease;
            flex-shrink: 0;
          }

          :global(.accordion-chevron.open) {
            transform: rotate(180deg);
          }

          .accordion-content {
            padding: var(--space-2, 8px) 0 var(--space-2, 8px) var(--space-2, 8px);
          }

          .branches-grid {
            display: flex;
            flex-direction: column;
            gap: var(--space-1, 4px);
          }

          :global(.branch-link) {
            display: flex;
            align-items: center;
            gap: var(--space-3, 12px);
            padding: var(--space-2, 8px) var(--space-3, 12px);
            background: transparent;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
          }

          :global(.branch-link:hover),
          :global(.branch-link:active) {
            background: var(--color-surface, #f5f5f5);
          }

          .branch-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .branch-emoji {
            font-size: 18px;
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

          .branch-count {
            font-size: var(--font-size-xs, 11px);
            color: var(--color-text-muted, #666);
          }
        `}</style>
      </div>
    )
  }

  return null
}
