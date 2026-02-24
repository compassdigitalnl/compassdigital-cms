'use client'

import React, { useState, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

/**
 * B18 - InfoBox Block Component
 *
 * Status notification callout with variant-specific styling and optional dismissal.
 *
 * FEATURES:
 * - 4 variants: info (blue), success (green), warning (amber), error (coral)
 * - Lucide icons (auto-default per variant or custom)
 * - Dismissible with localStorage persistence
 * - Lexical rich text description
 * - Configurable max width and margins
 * - Border-left accent design
 *
 * @see src/branches/shared/blocks/InfoBox/config.ts
 * @see docs/refactoring/sprint-6/b18-infobox.html
 */

type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error'
type MaxWidth = 'narrow' | 'wide' | 'full'
type Margin = 'none' | 'sm' | 'md' | 'lg'

interface InfoBoxBlockProps {
  variant?: InfoBoxVariant
  icon?: string
  title?: string
  description?: any // Lexical JSON
  dismissible?: boolean
  persistent?: boolean
  storageKey?: string
  maxWidth?: MaxWidth
  marginTop?: Margin
  marginBottom?: Margin
}

// Variant configuration (uses theme colors)
const variantConfig = {
  info: {
    bgColor: 'bg-blue-light',
    borderColor: 'border-l-blue',
    iconColor: 'text-blue',
    textColor: 'text-blue',
    defaultIcon: Info,
  },
  success: {
    bgColor: 'bg-green-light',
    borderColor: 'border-l-green',
    iconColor: 'text-green',
    textColor: 'text-green',
    defaultIcon: CheckCircle,
  },
  warning: {
    bgColor: 'bg-amber-light',
    borderColor: 'border-l-amber',
    iconColor: 'text-amber',
    textColor: 'text-amber',
    defaultIcon: AlertTriangle,
  },
  error: {
    bgColor: 'bg-coral-light',
    borderColor: 'border-l-coral',
    iconColor: 'text-coral',
    textColor: 'text-coral',
    defaultIcon: XCircle,
  },
}

// Simple Lexical renderer (extracts text from Lexical JSON)
function renderLexicalContent(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  const extractText = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (node.text) return node.text
    if (node.children) {
      return node.children.map((child: any) => extractText(child)).join(' ')
    }
    if (Array.isArray(node)) {
      return node.map((item) => extractText(item)).join(' ')
    }
    return ''
  }

  return extractText(content)
}

export const InfoBoxBlockComponent: React.FC<InfoBoxBlockProps> = ({
  variant = 'info',
  icon,
  title,
  description,
  dismissible = false,
  persistent = false,
  storageKey,
  maxWidth = 'wide',
  marginTop = 'md',
  marginBottom = 'md',
}) => {
  const [dismissed, setDismissed] = useState(false)

  // Check localStorage if persistent dismissal
  useEffect(() => {
    if (dismissible && persistent && storageKey) {
      try {
        const isDismissed = localStorage.getItem(`infobox-${storageKey}`)
        if (isDismissed === 'true') {
          setDismissed(true)
        }
      } catch (error) {
        // Handle localStorage errors (e.g., private browsing)
        console.warn('InfoBox: localStorage not available', error)
      }
    }
  }, [dismissible, persistent, storageKey])

  const handleDismiss = () => {
    setDismissed(true)
    if (persistent && storageKey) {
      try {
        localStorage.setItem(`infobox-${storageKey}`, 'true')
      } catch (error) {
        console.warn('InfoBox: Failed to save dismissal to localStorage', error)
      }
    }
  }

  if (dismissed) return null

  const config = variantConfig[variant]
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<any>) || config.defaultIcon
    : config.defaultIcon

  const maxWidthClasses = {
    narrow: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-full',
  }

  const marginTopClasses = {
    none: '',
    sm: 'mt-3',
    md: 'mt-6',
    lg: 'mt-12',
  }

  const marginBottomClasses = {
    none: '',
    sm: 'mb-3',
    md: 'mb-6',
    lg: 'mb-12',
  }

  const renderedDescription = renderLexicalContent(description)

  return (
    <section className={`w-full ${marginTopClasses[marginTop]} ${marginBottomClasses[marginBottom]}`}>
      <div className={`mx-auto px-6 ${maxWidthClasses[maxWidth]}`}>
        <div
          className={`relative p-5 rounded-lg border-l-[3px] ${config.bgColor} ${config.borderColor}`}
        >
          <div className="flex items-start gap-3">
            {IconComponent && (
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`}
              />
            )}
            <div className={`flex-1 ${dismissible ? 'pr-8' : ''}`}>
              {title && (
                <strong
                  className={`block text-sm font-bold mb-1.5 ${config.iconColor}`}
                >
                  {title}
                </strong>
              )}
              {renderedDescription && (
                <div className="text-[13px] text-grey-dark leading-relaxed">
                  {renderedDescription}
                </div>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={`absolute top-4 right-4 p-1 rounded hover:bg-black/5 transition-colors opacity-60 hover:opacity-100 ${config.iconColor}`}
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
