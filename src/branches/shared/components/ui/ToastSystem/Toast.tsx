'use client'

import * as React from 'react'
import { X, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/utilities/cn'
import type { Toast as ToastType, ToastIconConfig } from './types'

const TOAST_ICONS: Record<ToastType['type'], ToastIconConfig> = {
  success: {
    icon: 'check-circle',
    backgroundColor: 'var(--green-light, #E8F5E9)',
    iconColor: 'var(--green, #00C853)',
    progressColor: 'var(--green, #00C853)',
  },
  error: {
    icon: 'x-circle',
    backgroundColor: 'var(--coral-light, #FFF0F0)',
    iconColor: 'var(--coral, #FF6B6B)',
    progressColor: 'var(--coral, #FF6B6B)',
  },
  warning: {
    icon: 'alert-triangle',
    backgroundColor: 'var(--amber-light, #FFF8E1)',
    iconColor: 'var(--amber, #F59E0B)',
    progressColor: 'var(--amber, #F59E0B)',
  },
  info: {
    icon: 'info',
    backgroundColor: 'var(--blue-light, #E3F2FD)',
    iconColor: 'var(--blue, #2196F3)',
    progressColor: 'var(--blue, #2196F3)',
  },
}

const ICON_COMPONENTS = {
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'alert-triangle': AlertTriangle,
  info: Info,
}

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isShowing, setIsShowing] = React.useState(false)
  const [isRemoving, setIsRemoving] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const progressRef = React.useRef<HTMLDivElement>(null)

  const config = TOAST_ICONS[toast.type]
  const IconComponent = ICON_COMPONENTS[config.icon as keyof typeof ICON_COMPONENTS]
  const duration = toast.duration ?? 5000

  React.useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => {
      setIsShowing(true)
    })

    // Auto-dismiss timer
    timeoutRef.current = setTimeout(() => {
      handleClose()
    }, duration + 500) // Add 500ms buffer for progress bar

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [duration])

  const handleClose = () => {
    setIsRemoving(true)
    setIsShowing(false)

    // Remove from DOM after animation
    setTimeout(() => {
      onClose(toast.id)
    }, 400)
  }

  const handleActionClick = () => {
    if (toast.action?.onClick) {
      toast.action.onClick()
      handleClose()
    }
  }

  return (
    <div
      className={cn(
        'relative flex gap-3 items-start bg-[var(--white,#FAFBFC)] border border-[var(--grey,#E8ECF1)] rounded-[14px] p-[14px_16px] shadow-[0_16px_48px_rgba(10,22,40,0.12)] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto',
        isShowing && !isRemoving ? 'translate-x-0' : 'translate-x-[120%]',
      )}
      role="alert"
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <IconComponent className="w-[17px] h-[17px]" style={{ color: config.iconColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-[var(--navy,#0A1628)] mb-0.5">
          {toast.title}
        </div>
        <div className="text-[13px] text-[var(--grey-mid,#94A3B8)] leading-[1.3]">
          {toast.message}
        </div>
        {toast.action && (
          <button
            onClick={handleActionClick}
            className="inline-block mt-1 text-[12px] font-bold text-[var(--teal,#00897B)] cursor-pointer hover:underline transition-all"
            tabIndex={0}
            role="button"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 hover:bg-[var(--grey-light,#F1F4F8)] transition-colors duration-[120ms]"
        aria-label="Sluiten"
      >
        <X className="w-[14px] h-[14px] text-[var(--grey-mid,#94A3B8)]" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-[var(--grey-light,#F1F4F8)] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full rounded-full w-full"
          style={{
            backgroundColor: config.progressColor,
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  )
}
