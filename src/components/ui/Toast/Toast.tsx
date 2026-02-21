'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, X, ShoppingCart, ArrowRight } from 'lucide-react'

export interface ToastAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'outline'
}

export interface ToastProps {
  id?: string
  type?: 'success' | 'error' | 'info' | 'addToCart'
  title: string
  description?: string
  emoji?: string
  image?: string
  quantity?: number
  actions?: ToastAction[]
  duration?: number
  onClose?: () => void
}

export function Toast({
  type = 'info',
  title,
  description,
  emoji,
  image,
  quantity,
  actions,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const step = 100 / (duration / 50)
        return Math.max(0, prev - step)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => onClose?.(), 300)
  }

  return (
    <div
      className={`relative bg-white border rounded-2xl shadow-2xl p-4 flex gap-3.5 items-start w-96 max-w-[calc(100vw-40px)] transition-transform duration-400 pointer-events-auto overflow-hidden ${
        show ? 'translate-x-0' : 'translate-x-[120%]'
      }`}
      style={{
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded flex items-center justify-center transition-colors"
        style={{
          backgroundColor: show ? 'transparent' : 'transparent',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
      </button>

      {/* Icon/Image */}
      {type === 'addToCart' && (emoji || image) && (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[26px] flex-shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
          {emoji || (image && <img src={image} alt="" className="w-full h-full object-cover rounded-lg" />)}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Success/Error Indicator */}
        {type === 'addToCart' && (
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: 'var(--color-success)' }}>
            <CheckCircle className="w-3.5 h-3.5" />
            Toegevoegd aan winkelwagen
            {quantity && quantity > 1 && <span>({quantity}×)</span>}
          </div>
        )}

        {type === 'success' && !actions && (
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: 'var(--color-success)' }}>
            <CheckCircle className="w-3.5 h-3.5" />
            Gelukt
          </div>
        )}

        {type === 'error' && (
          <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: 'var(--color-error)' }}>
            <AlertCircle className="w-3.5 h-3.5" />
            Fout
          </div>
        )}

        {/* Title */}
        <div className="text-sm font-bold leading-snug pr-6" style={{ color: 'var(--color-text-primary)' }}>{title}</div>

        {/* Description */}
        {description && <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{description}</div>}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-2.5">
            {actions.map((action, idx) => {
              const ButtonContent = (
                <>
                  {action.variant === 'primary' && <ShoppingCart className="w-3 h-3" />}
                  {action.label}
                  {action.variant === 'outline' && <ArrowRight className="w-3 h-3" />}
                </>
              )

              const baseClassName = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5'

              const primaryStyle = {
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }

              const outlineStyle = {
                backgroundColor: 'white',
                color: 'var(--color-text-primary)',
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border)',
              }

              const className = `${baseClassName} ${action.variant === 'primary' ? '' : ''}`

              return action.href ? (
                <Link
                  key={idx}
                  href={action.href}
                  className={className}
                  style={action.variant === 'primary' ? primaryStyle : outlineStyle}
                  onMouseEnter={(e) => {
                    if (action.variant === 'primary') {
                      e.currentTarget.style.backgroundColor = 'var(--color-secondary)'
                    } else {
                      e.currentTarget.style.borderColor = 'var(--color-primary)'
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (action.variant === 'primary') {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                    } else {
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                    }
                  }}
                  onClick={() => {
                    action.onClick?.()
                    handleClose()
                  }}
                >
                  {ButtonContent}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick?.()
                    handleClose()
                  }}
                  className={className}
                  style={action.variant === 'primary' ? primaryStyle : outlineStyle}
                  onMouseEnter={(e) => {
                    if (action.variant === 'primary') {
                      e.currentTarget.style.backgroundColor = 'var(--color-secondary)'
                    } else {
                      e.currentTarget.style.borderColor = 'var(--color-primary)'
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (action.variant === 'primary') {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                    } else {
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                    }
                  }}
                >
                  {ButtonContent}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div
          className="h-full rounded-b-2xl transition-all"
          style={{
            backgroundColor: 'var(--color-primary)',
            width: `${progress}%`,
            transition: 'width 50ms linear',
          }}
        />
      </div>
    </div>
  )
}
