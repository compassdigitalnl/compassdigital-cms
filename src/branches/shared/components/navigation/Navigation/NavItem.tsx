/**
 * NavItem Component
 *
 * Individual navigation item - can be:
 * - Simple link
 * - Mega menu trigger
 * - Branches dropdown trigger
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import type { NavItem as NavItemType } from '@/globals/Header.types'
import { NavDropdown } from './NavDropdown'
import { MegaMenu } from './MegaMenu'

export interface NavItemProps {
  item: NavItemType
  textColor?: string
}

export function NavItem({ item, textColor = 'var(--color-white)' }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get icon component
  const IconComponent = item.icon
    ? (LucideIcons as any)[
        item.icon
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
      ]
    : null

  // Simple link (no dropdown)
  if (item.type === 'link' && item.url) {
    return (
      <li className="nav-item">
        <Link href={item.url} className="nav-link">
          {IconComponent && <IconComponent size={16} aria-hidden="true" />}
          <span>{item.label}</span>
        </Link>

        <style jsx>{`
          .nav-item {
            position: relative;
          }

          :global(.nav-link) {
            display: flex;
            align-items: center;
            gap: var(--space-2, 8px);
            padding: var(--space-3, 12px) var(--space-4, 16px);
            text-decoration: none;
            color: ${textColor};
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          :global(.nav-link:hover) {
            background: rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </li>
    )
  }

  // Mega menu (multi-column dropdown)
  if (item.type === 'mega' && item.megaColumns) {
    return (
      <li
        className="nav-item"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="nav-button" aria-expanded={isOpen} aria-haspopup="true">
          {IconComponent && <IconComponent size={16} aria-hidden="true" />}
          <span>{item.label}</span>
          <ChevronDown
            size={14}
            className={`nav-chevron ${isOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && <MegaMenu columns={item.megaColumns} />}

        <style jsx>{`
          .nav-item {
            position: relative;
          }

          .nav-button {
            display: flex;
            align-items: center;
            gap: var(--space-2, 8px);
            padding: var(--space-3, 12px) var(--space-4, 16px);
            background: transparent;
            border: none;
            color: ${textColor};
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .nav-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          :global(.nav-chevron) {
            transition: transform 0.2s ease;
          }

          :global(.nav-chevron.open) {
            transform: rotate(180deg);
          }
        `}</style>
      </li>
    )
  }

  // Branches dropdown (industry navigation)
  if (item.type === 'branches' && item.branches) {
    return (
      <li
        className="nav-item"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="nav-button" aria-expanded={isOpen} aria-haspopup="true">
          {IconComponent && <IconComponent size={16} aria-hidden="true" />}
          <span>{item.label}</span>
          <ChevronDown
            size={14}
            className={`nav-chevron ${isOpen ? 'open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && <NavDropdown branches={item.branches} />}

        <style jsx>{`
          .nav-item {
            position: relative;
          }

          .nav-button {
            display: flex;
            align-items: center;
            gap: var(--space-2, 8px);
            padding: var(--space-3, 12px) var(--space-4, 16px);
            background: transparent;
            border: none;
            color: ${textColor};
            font-size: var(--font-size-sm, 13px);
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .nav-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          :global(.nav-chevron) {
            transition: transform 0.2s ease;
          }

          :global(.nav-chevron.open) {
            transform: rotate(180deg);
          }
        `}</style>
      </li>
    )
  }

  // Fallback (shouldn't happen)
  return null
}
