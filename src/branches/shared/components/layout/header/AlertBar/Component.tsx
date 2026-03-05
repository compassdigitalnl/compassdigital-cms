'use client'

import { useState, useEffect } from 'react'
import { getContainerMaxWidth } from '@/branches/shared/components/utilities/containerWidth'
import { X } from 'lucide-react'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { AlertBarProps } from './types'

const typeColors = {
  info: { bg: '#EFF6FF', border: '#DBEAFE', text: '#1E40AF', icon: '#3B82F6' },
  success: { bg: '#F0FDF4', border: '#DCFCE7', text: '#166534', icon: '#22C55E' },
  warning: { bg: '#FFF8E1', border: '#FFECB3', text: '#F59E0B', icon: '#F59E0B' },
  error: { bg: '#FFF0F0', border: '#FFDBDB', text: '#DC2626', icon: '#FF6B6B' },
  promo: { bg: '#F5F3FF', border: '#E9D5FF', text: '#7C3AED', icon: '#8B5CF6' },
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
