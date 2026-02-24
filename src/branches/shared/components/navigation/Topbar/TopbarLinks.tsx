/**
 * TopbarLinks Component
 *
 * Displays USP messages or links on the left side of the topbar
 * Supports icons, text, and optional links
 */

'use client'

import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { TopbarMessage } from '@/globals/Header.types'

export interface TopbarLinksProps {
  messages: TopbarMessage[]
  textColor?: string
}

export function TopbarLinks({ messages, textColor = 'var(--color-white)' }: TopbarLinksProps) {
  return (
    <div className="topbar-links" style={{ color: textColor }}>
      {messages.map((message, index) => {
        const IconComponent = message.icon
          ? (LucideIcons as any)[
              message.icon
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('')
            ]
          : null

        const content = (
          <>
            {IconComponent && (
              <IconComponent className="topbar-icon" size={14} aria-hidden="true" />
            )}
            <span>{message.text}</span>
          </>
        )

        if (message.link) {
          return (
            <Link key={index} href={message.link} className="topbar-link">
              {content}
            </Link>
          )
        }

        return (
          <div key={index} className="topbar-message">
            {content}
          </div>
        )
      })}

      <style jsx>{`
        .topbar-links {
          display: flex;
          align-items: center;
          gap: var(--space-6, 24px);
          font-size: var(--font-size-sm, 12px);
        }

        .topbar-link,
        .topbar-message {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s ease;
        }

        .topbar-link:hover {
          opacity: 0.8;
        }

        :global(.topbar-icon) {
          flex-shrink: 0;
        }

        /* Mobile: show only first message */
        @media (max-width: 767px) {
          .topbar-links {
            gap: var(--space-3, 12px);
          }

          .topbar-link:not(:first-child),
          .topbar-message:not(:first-child) {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
