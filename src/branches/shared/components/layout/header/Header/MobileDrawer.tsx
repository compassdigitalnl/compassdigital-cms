'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { Header, Theme } from '@/payload-types'
import { X, ChevronRight, Phone, Mail } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { CMSLink } from '@/branches/shared/components/common/Link'

type Props = {
  isOpen: boolean
  onClose: () => void
  header: Header
  theme: Theme | null
}

export function MobileDrawer({ isOpen, onClose, header, theme }: Props) {
  const primaryColor = theme?.primaryColor || '#00897B'
  const secondaryColor = theme?.secondaryColor || '#0A1628'

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

  const navItems = header.navigation?.items || []
  const specialItems = header.navigation?.specialItems || []

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-[299] transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[300] flex flex-col transition-transform duration-300 ease-out lg:hidden shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          {header.logoOverride && typeof header.logoOverride === 'object' && header.logoOverride.url ? (
            <img
              src={header.logoOverride.url}
              alt={header.siteNameOverride || 'Logo'}
              className="h-7 w-auto"
            />
          ) : header.siteNameOverride ? (
            <span className="text-lg font-extrabold" style={{ color: secondaryColor }}>
              {header.siteNameAccent ? (
                <>
                  {header.siteNameOverride.replace(header.siteNameAccent, '')}
                  <span style={{ color: primaryColor }}>{header.siteNameAccent}</span>
                </>
              ) : (
                header.siteNameOverride
              )}
            </span>
          ) : (
            <span className="text-lg font-extrabold" style={{ color: secondaryColor }}>
              Site<span style={{ color: primaryColor }}>Forge</span>
            </span>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" style={{ color: secondaryColor }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Special Items */}
          {specialItems.length > 0 && (
            <>
              <div className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Speciale Items
              </div>
              {specialItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.url || '#'}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 text-base font-semibold transition-colors',
                    item.highlight
                      ? 'text-[#FF6B6B] hover:bg-red-50'
                      : 'hover:bg-gray-50'
                  )}
                  style={{ color: item.highlight ? '#FF6B6B' : secondaryColor }}
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-2 mx-5" />
            </>
          )}

          {/* Navigation Items */}
          {navItems.length > 0 && (
            <>
              <div className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Navigatie
              </div>
              {navItems.map((item) => (
                <div key={item.id}>
                  <CMSLink
                    {...(item.type === 'page' ? { reference: item.page } : { url: item.url })}
                    onClick={onClose}
                    className="flex items-center gap-3 px-5 py-3 text-base font-semibold hover:bg-gray-50 transition-colors"
                    style={{ color: secondaryColor }}
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  </CMSLink>
                  {item.children && item.children.length > 0 && (
                    <div className="bg-gray-50">
                      {item.children.map((child) => (
                        <CMSLink
                          key={child.id}
                          {...(typeof child.page === 'object' && 'slug' in child.page ? { reference: child.page } : {})}
                          onClick={onClose}
                          className="flex items-center gap-3 pl-12 pr-5 py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors text-gray-600"
                        >
                          {child.label}
                        </CMSLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5 flex-shrink-0 flex flex-col gap-3">
          <a
            href="tel:+31201234567"
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: secondaryColor }}
          >
            <Phone className="w-4 h-4" style={{ color: primaryColor }} />
            020 123 4567
          </a>
          <a
            href="mailto:info@example.com"
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: secondaryColor }}
          >
            <Mail className="w-4 h-4" style={{ color: primaryColor }} />
            info@example.com
          </a>
        </div>
      </div>
    </>
  )
}
