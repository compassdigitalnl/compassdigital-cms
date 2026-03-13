'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { cn } from '@/utilities/cn'
import type { ManualMegaMenuProps } from './types'

export function ManualMegaMenu({
  columns,
  isOpen,
  onClose,
  navTop,
  primaryColor = 'var(--color-primary)',
  secondaryColor = 'var(--color-secondary)',
}: ManualMegaMenuProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const colCount = Math.min(columns.length, 4)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        style={{ top: `${navTop}px` }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 right-0 z-[60]" style={{ top: `${navTop}px` }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
          <div
            className="bg-white rounded-b-2xl shadow-2xl overflow-hidden border-t-2"
            style={{ borderColor: primaryColor }}
          >
            <div
              className="grid gap-0 p-6"
              style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
            >
              {columns.map((col, colIdx) => (
                <div
                  key={col.id || colIdx}
                  className={cn('px-4', colIdx > 0 && 'border-l')}
                  style={colIdx > 0 ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  {col.title && (
                    <div className="flex items-center gap-2.5 mb-4">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary-glow)' }}
                      >
                        <span
                          className="text-xs font-black"
                          style={{ color: primaryColor }}
                        >
                          {col.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h4
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: secondaryColor }}
                      >
                        {col.title}
                      </h4>
                    </div>
                  )}
                  <ul className="space-y-0.5">
                    {(col.links || []).map((link, linkIdx) => (
                      <li key={link.id || linkIdx}>
                        <Link
                          href={link.url || '#'}
                          onClick={onClose}
                          className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-[var(--color-surface)]"
                          style={{ color: secondaryColor }}
                          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = primaryColor
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = secondaryColor
                          }}
                        >
                          {link.icon && (
                            <Icon name={link.icon} size={16} className="mt-0.5 shrink-0" />
                          )}
                          <div>
                            <span className="font-medium">{link.label}</span>
                            {link.description && (
                              <p
                                className="mt-0.5 text-xs leading-snug"
                                style={{ color: 'var(--color-text-muted)' }}
                              >
                                {link.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
