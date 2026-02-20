'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastProps } from './Toast'

interface ToastContextValue {
  showToast: (props: Omit<ToastProps, 'id' | 'onClose'>) => void
  showSuccessToast: (message: string, description?: string) => void
  showErrorToast: (message: string, description?: string) => void
  showAddToCartToast: (product: {
    name: string
    emoji?: string
    image?: string
    meta?: string
    quantity: number
  }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastWithId extends ToastProps {
  id: string
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (props: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const toast: ToastWithId = {
        ...props,
        id,
        onClose: () => removeToast(id),
      }
      setToasts((prev) => [...prev, toast])

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id)
      }, props.duration || 5000)
    },
    [removeToast],
  )

  const showSuccessToast = useCallback(
    (message: string, description?: string) => {
      showToast({
        type: 'success',
        title: message,
        description,
      })
    },
    [showToast],
  )

  const showErrorToast = useCallback(
    (message: string, description?: string) => {
      showToast({
        type: 'error',
        title: message,
        description,
      })
    },
    [showToast],
  )

  const showAddToCartToast = useCallback(
    (product: {
      name: string
      emoji?: string
      image?: string
      meta?: string
      quantity: number
    }) => {
      showToast({
        type: 'addToCart',
        title: `${product.name}`,
        description: product.meta,
        emoji: product.emoji,
        image: product.image,
        quantity: product.quantity,
        actions: [
          {
            label: 'Bekijk winkelwagen',
            href: '/cart',
            variant: 'primary',
          },
          {
            label: 'Verder winkelen',
            onClick: () => {},
            variant: 'outline',
          },
        ],
      })
    },
    [showToast],
  )

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccessToast,
        showErrorToast,
        showAddToCartToast,
      }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[600] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
