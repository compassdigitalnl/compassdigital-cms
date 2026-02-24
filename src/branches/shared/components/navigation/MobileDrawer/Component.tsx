/**
 * MobileDrawer Component
 *
 * Full mobile navigation drawer (hamburger menu)
 * Slides in from left, full-height, with accordion navigation
 */

'use client'

import React, { useEffect } from 'react'
import type { MobileDrawerConfig, NavigationConfig, LanguageSwitcherConfig, PriceToggleConfig, LogoConfig } from '@/globals/Header.types'
import { DrawerHeader } from './DrawerHeader'
import { DrawerBody } from './DrawerBody'
import { DrawerFooter } from './DrawerFooter'

export interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  navigationConfig?: NavigationConfig
  drawerConfig?: MobileDrawerConfig
  logoConfig?: LogoConfig
  languageSwitcher?: LanguageSwitcherConfig
  priceToggle?: PriceToggleConfig
  siteName?: string
}

export function MobileDrawer({
  isOpen,
  onClose,
  navigationConfig,
  drawerConfig,
  logoConfig,
  languageSwitcher,
  priceToggle,
  siteName = 'SiteForge',
}: MobileDrawerProps) {
  const drawerWidth = drawerConfig?.drawerWidth || 320

  // Handle ESC key to close drawer
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="drawer-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        style={{ width: `${drawerWidth}px` }}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <DrawerHeader
          onClose={onClose}
          logoConfig={logoConfig}
          siteName={siteName}
        />

        <DrawerBody
          navigationConfig={navigationConfig}
          onLinkClick={onClose}
        />

        <DrawerFooter
          contactInfo={drawerConfig?.contactInfo}
          showToggles={drawerConfig?.showToggles}
          languageSwitcher={languageSwitcher}
          priceToggle={priceToggle}
        />
      </div>

      <style jsx>{`
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 400;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background: var(--color-white, #fff);
          z-index: 401;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 16px rgba(0, 0, 0, 0.1);
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        /* Desktop: hide drawer */
        @media (min-width: 768px) {
          .mobile-drawer,
          .drawer-backdrop {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
