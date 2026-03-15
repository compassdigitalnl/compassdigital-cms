'use client'

import { useState, useEffect } from 'react'
import { getContainerMaxWidth } from '@/branches/shared/components/providers/containerWidth'
import { X } from 'lucide-react'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { AlertBarProps } from './types'

const typeColors = {
  info: { bg: 'var(--color-info-light)', border: 'var(--color-info-light)', text: 'var(--color-info-dark)', icon: 'var(--color-info)' },
  success: { bg: 'var(--color-success-light)', border: 'var(--color-success-light)', text: 'var(--color-success-dark)', icon: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning-light)', border: 'var(--color-warning-light)', text: 'var(--color-warning-dark)', icon: 'var(--color-warning)' },
  error: { bg: 'var(--color-error-light)', border: 'var(--color-error-light)', text: 'var(--color-error-dark)', icon: 'var(--color-error)' },
  promo: { bg: 'var(--color-promo-light)', border: 'var(--color-promo-light)', text: 'var(--color-promo-dark)', icon: 'var(--color-promo)' },
}

export function AlertBar({ alertBar, theme }: AlertBarProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerClass = getContainerMaxWidth((theme as any)?.containerWidth)

  useEffect(() => {
    setIsMounted(true)

    const dismissed = localStorage.getItem('alertBar_dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    setIsVisible(true)
  }, [alertBar])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (alertBar.dismissible) {
      localStorage.setItem('alertBar_dismissed', 'true')
    }
  }

  if (!isMounted) return null
  if (!alertBar.enabled || isDismissed || !isVisible) return null

  const alertType = (alertBar.type || 'info') as keyof typeof typeColors
  const colors = typeColors[alertType]

  return (
    <div
      className="relative"
      style={{
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className={`${containerClass} mx-auto px-4 py-2.5 flex items-center justify-center gap-3`}>
        {alertBar.icon && <Icon name={alertBar.icon} size={16} style={{ color: colors.icon }} />}
        <p className="text-sm font-medium" style={{ color: colors.text }}>
          {alertBar.message}
        </p>
        {alertBar.dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-auto p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Sluit melding"
          >
            <X className="w-4 h-4" style={{ color: colors.text }} />
          </button>
        )}
      </div>
    </div>
  )
}
