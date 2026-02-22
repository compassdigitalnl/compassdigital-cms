'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Header, Theme } from '@/payload-types'
import { getContainerMaxWidth } from '@/branches/shared/components/utilities/containerWidth'
import {
  BadgeCheck,
  Truck,
  Award,
  Gift,
  Zap,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  Megaphone,
  X,
} from 'lucide-react'
import { cn } from '@/utilities/cn'

const iconMap: Record<string, React.ComponentType<any>> = {
  BadgeCheck,
  Truck,
  Award,
  Gift,
  Zap,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  Megaphone,
}

type Props = {
  alertBar: NonNullable<Header['alertBar']>
  theme?: Theme | null
}

export function AlertBar({ alertBar, theme }: Props) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerClass = getContainerMaxWidth(theme?.containerWidth)

  useEffect(() => {
    // First mount - prevents hydration mismatch
    setIsMounted(true)

    // Check if alert was dismissed
    const dismissed = localStorage.getItem('alertBar_dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Check schedule
    if (alertBar.schedule?.useSchedule) {
      const now = new Date()
      if (alertBar.schedule.startDate) {
        const start = new Date(alertBar.schedule.startDate)
        if (now < start) {
          setIsVisible(false)
          return
        }
      }
      if (alertBar.schedule.endDate) {
        const end = new Date(alertBar.schedule.endDate)
        if (now > end) {
          setIsVisible(false)
          return
        }
      }
    }

    setIsVisible(true)
  }, [alertBar])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (alertBar.dismissible) {
      localStorage.setItem('alertBar_dismissed', 'true')
    }
  }

  // Render nothing on server to prevent hydration mismatch
  if (!isMounted) return null

  if (!alertBar.enabled || isDismissed || !isVisible) return null

  const Icon = alertBar.icon ? iconMap[alertBar.icon] : null

  // Type-based colors
  const typeColors = {
    info: {
      bg: '#EFF6FF',
      border: '#DBEAFE',
      text: '#1E40AF',
      icon: '#3B82F6',
    },
    success: {
      bg: '#F0FDF4',
      border: '#DCFCE7',
      text: '#166534',
      icon: '#22C55E',
    },
    warning: {
      bg: '#FFF8E1',
      border: '#FFECB3',
      text: '#F59E0B',
      icon: '#F59E0B',
    },
    error: {
      bg: '#FFF0F0',
      border: '#FFDBDB',
      text: '#DC2626',
      icon: '#FF6B6B',
    },
    promo: {
      bg: '#F5F3FF',
      border: '#E9D5FF',
      text: '#7C3AED',
      icon: '#8B5CF6',
    },
  }

  const colors = alertBar.customColors?.useCustomColors
    ? {
        bg: alertBar.customColors.backgroundColor || typeColors[alertBar.type || 'info'].bg,
        text: alertBar.customColors.textColor || typeColors[alertBar.type || 'info'].text,
        border: typeColors[alertBar.type || 'info'].border,
        icon: typeColors[alertBar.type || 'info'].icon,
      }
    : typeColors[alertBar.type || 'info']

  return (
    <div
      className="relative"
      style={{
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className={`${containerClass} mx-auto px-8 py-2.5 flex items-center justify-center gap-3`}>
        {Icon && <Icon className="w-4 h-4" style={{ color: colors.icon }} />}
        <p className="text-sm font-medium" style={{ color: colors.text }}>
          {alertBar.message}
        </p>
        {alertBar.link?.enabled && alertBar.link.label && alertBar.link.url && (
          <>
            <span style={{ color: colors.text + '40' }}>•</span>
            <Link
              href={alertBar.link.url}
              className="text-sm font-semibold hover:underline"
              style={{ color: colors.text }}
            >
              {alertBar.link.label} →
            </Link>
          </>
        )}
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
