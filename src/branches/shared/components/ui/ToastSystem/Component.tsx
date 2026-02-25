'use client'

import * as React from 'react'
import { Toast } from './Toast'
import type { Toast as ToastType, ToastConfig } from './types'

interface ToastSystemContextType {
  showToast: (config: ToastConfig) => void
  removeToast: (id: string) => void
  toasts: ToastType[]
}

const ToastSystemContext = React.createContext<ToastSystemContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastSystemContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastSystemProvider')
  }
  return context
}

interface ToastSystemProviderProps {
  children: React.ReactNode
  maxToasts?: number
}

export function ToastSystemProvider({
  children,
  maxToasts = 3,
}: ToastSystemProviderProps) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])
  const toastIdCounter = React.useRef(0)

  const showToast = React.useCallback(
    (config: ToastConfig) => {
      const id = `toast-${++toastIdCounter.current}`
      const newToast: ToastType = {
        ...config,
        id,
        timestamp: Date.now(),
      }

      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, newToast]

        // Remove oldest toast if we exceed maxToasts
        if (updatedToasts.length > maxToasts) {
          return updatedToasts.slice(1)
        }

        return updatedToasts
      })
    },
    [maxToasts],
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const value = React.useMemo(
    () => ({ showToast, removeToast, toasts }),
    [showToast, removeToast, toasts],
  )

  return (
    <ToastSystemContext.Provider value={value}>
      {children}
      <ToastSystemContainer toasts={toasts} removeToast={removeToast} />
    </ToastSystemContext.Provider>
  )
}

interface ToastSystemContainerProps {
  toasts: ToastType[]
  removeToast: (id: string) => void
}

function ToastSystemContainer({ toasts, removeToast }: ToastSystemContainerProps) {
  return (
    <div
      className="fixed top-5 right-5 flex flex-col gap-2 z-[var(--z-toast,400)] w-[380px] max-w-[calc(100vw-40px)] pointer-events-none sm:w-[380px] max-sm:w-[calc(100vw-32px)] max-sm:right-4"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Convenience hooks for common toast types
export function useSuccessToast() {
  const { showToast } = useToast()
  return React.useCallback(
    (title: string, message: string, action?: ToastConfig['action']) => {
      showToast({ type: 'success', title, message, action })
    },
    [showToast],
  )
}

export function useErrorToast() {
  const { showToast } = useToast()
  return React.useCallback(
    (title: string, message: string, action?: ToastConfig['action']) => {
      showToast({ type: 'error', title, message, action })
    },
    [showToast],
  )
}

export function useWarningToast() {
  const { showToast } = useToast()
  return React.useCallback(
    (title: string, message: string, action?: ToastConfig['action']) => {
      showToast({ type: 'warning', title, message, action })
    },
    [showToast],
  )
}

export function useInfoToast() {
  const { showToast } = useToast()
  return React.useCallback(
    (title: string, message: string, action?: ToastConfig['action']) => {
      showToast({ type: 'info', title, message, action })
    },
    [showToast],
  )
}
