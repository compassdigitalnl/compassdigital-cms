'use client'

import { useRouter } from 'next/navigation'
import { AddToCartToastProvider } from './ToastManager'
import type { ReactNode } from 'react'

interface AddToCartToastProviderClientProps {
  children: ReactNode
  maxToasts?: number
  autoDismiss?: number
}

/**
 * Client wrapper for AddToCartToastProvider with router navigation
 */
export function AddToCartToastProviderClient({
  children,
  maxToasts = 3,
  autoDismiss = 5000,
}: AddToCartToastProviderClientProps) {
  const router = useRouter()

  const handleViewCart = () => {
    router.push('/cart')
  }

  const handleContinueShopping = () => {
    // Toast already closes, no navigation needed
  }

  return (
    <AddToCartToastProvider
      maxToasts={maxToasts}
      autoDismiss={autoDismiss}
      onViewCart={handleViewCart}
      onContinueShopping={handleContinueShopping}
    >
      {children}
    </AddToCartToastProvider>
  )
}
