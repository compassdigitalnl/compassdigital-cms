'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'

// Type for alert bar settings (from global)
interface AlertBarSettings {
  enabled?: boolean
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'promo'
  icon?: string
  link?: {
    enabled?: boolean
    label?: string
    url?: string
  }
  dismissible?: boolean
  schedule?: {
    useSchedule?: boolean
    startDate?: string
    endDate?: string
  }
  customColors?: {
    useCustomColors?: boolean
    backgroundColor?: string
    textColor?: string
  }
}

const typeStyles = {
  info: {
    bg: 'bg-blue-600',
    text: 'text-white',
    icon: 'Info',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-white',
    icon: 'CheckCircle',
  },
  warning: {
    bg: 'bg-amber-500',
    text: 'text-white',
    icon: 'AlertTriangle',
  },
  error: {
    bg: 'bg-red-600',
    text: 'text-white',
    icon: 'AlertCircle',
  },
  promo: {
    bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
    text: 'text-white',
    icon: 'Gift',
  },
}

export const AlertBar: React.FC<{ settings?: AlertBarSettings }> = ({ settings }) => {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('alertBarDismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  if (!settings?.enabled || !settings.message || isDismissed) {
    return null
  }

  // Check schedule
  if (settings.schedule?.useSchedule) {
    const now = new Date()
    if (settings.schedule.startDate && new Date(settings.schedule.startDate) > now) {
      return null
    }
    if (settings.schedule.endDate && new Date(settings.schedule.endDate) < now) {
      return null
    }
  }

  const type = settings.type || 'info'
  const style = typeStyles[type]
  const customColors = settings.customColors?.useCustomColors

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('alertBarDismissed', 'true')
  }

  return (
    <div
      className={`relative ${customColors ? '' : style.bg} border-b border-white/10`}
      style={
        customColors
          ? {
              backgroundColor: settings.customColors?.backgroundColor,
              color: settings.customColors?.textColor,
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 py-3 text-sm md:text-base">
          {/* Icon */}
          {settings.icon && (
            <Icon
              name={settings.icon}
              size={20}
              className={customColors ? '' : style.text}
            />
          )}

          {/* Message */}
          <span className={`font-medium ${customColors ? '' : style.text}`}>
            {settings.message}
          </span>

          {/* CTA Link */}
          {settings.link?.enabled && settings.link.url && settings.link.label && (
            <Link
              href={settings.link.url}
              className={`${customColors ? 'underline hover:no-underline' : 'underline hover:no-underline'} font-semibold`}
            >
              {settings.link.label}
            </Link>
          )}

          {/* Dismiss Button */}
          {settings.dismissible && (
            <button
              onClick={handleDismiss}
              className={`ml-auto ${customColors ? 'hover:opacity-70' : 'text-white/80 hover:text-white'} transition-opacity`}
              aria-label="Sluiten"
            >
              <Icon name="X" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
