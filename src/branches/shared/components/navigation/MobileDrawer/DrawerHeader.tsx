/**
 * DrawerHeader Component
 *
 * Mobile drawer header with logo and close button
 */

'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { LogoConfig } from '@/globals/Header.types'
import { Logo } from '../Logo'

export interface DrawerHeaderProps {
  onClose: () => void
  logoConfig?: LogoConfig
  siteName?: string
}

export function DrawerHeader({ onClose, logoConfig, siteName = 'SiteForge' }: DrawerHeaderProps) {
  return (
    <div className="drawer-header">
      <Logo config={logoConfig} siteName={siteName} className="drawer-logo" />

      <button
        onClick={onClose}
        className="drawer-close-button"
        aria-label="Close navigation"
      >
        <X size={24} aria-hidden="true" />
      </button>

      <style jsx>{`
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4, 16px);
          border-bottom: 1px solid var(--color-border, #e0e0e0);
          flex-shrink: 0;
        }

        :global(.drawer-logo) {
          flex: 1;
        }

        .drawer-close-button {
          background: transparent;
          border: none;
          color: var(--color-text-primary, #0a1628);
          cursor: pointer;
          padding: var(--space-2, 8px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .drawer-close-button:hover {
          background: var(--color-surface, #f5f5f5);
        }

        .drawer-close-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}
