'use client'

import React, { useEffect } from 'react'
import { CMSLink } from '@/branches/shared/components/common/Link'
import type { SimpleDropdownProps } from './types'

export function SimpleDropdown({
  items,
  isOpen,
  onClose,
  primaryColor = 'var(--color-primary)',
  secondaryColor = 'var(--color-secondary)',
}: SimpleDropdownProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-simple-dropdown]')) {
        onClose()
      }
    }
    // Delay to avoid closing immediately on the click that opens it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      data-simple-dropdown
      className="absolute top-full left-0 bg-white border rounded-b-xl shadow-lg min-w-[200px] z-[195]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {items.map((child) => (
        <CMSLink
          key={child.id}
          {...(typeof child.page === 'object' &&
          child.page !== null &&
          'slug' in (child.page as Record<string, unknown>)
            ? { reference: child.page }
            : {})}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm font-medium transition-colors first:rounded-t-xl last:rounded-b-xl"
          style={{ color: secondaryColor }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
            e.currentTarget.style.color = primaryColor
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = secondaryColor
          }}
        >
          {child.label}
        </CMSLink>
      ))}
    </div>
  )
}
