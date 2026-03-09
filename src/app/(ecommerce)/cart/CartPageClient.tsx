'use client'

import { useABTest } from '@/features/ab-testing/components'
import CartTemplate1 from '@/branches/ecommerce/shared/templates/cart/CartTemplate1'
import CartTemplate2 from '@/branches/ecommerce/shared/templates/cart/CartTemplate2'
import CartTemplate4 from '@/branches/ecommerce/shared/templates/cart/CartTemplate4'
import { ShoppingCart } from 'lucide-react'

interface CartPageClientProps {
  defaultTemplate: string
  contactPhone?: string
}

export default function CartPageClient({ defaultTemplate, contactPhone }: CartPageClientProps) {
  const { variant, isLoading, trackConversion } = useABTest('cart')

  // Loading state
  if (isLoading) {
    return <CartSkeleton />
  }

  // Handle conversion tracking
  const handleCheckout = () => {
    trackConversion()
  }

  // Use A/B test variant if available, otherwise use default from settings
  const templateToUse = variant || defaultTemplate

  // Render appropriate template
  if (templateToUse === 'template4') {
    return <CartTemplate4 onCheckout={handleCheckout} />
  }

  if (templateToUse === 'template2') {
    return <CartTemplate2 onCheckout={handleCheckout} />
  }

  // Default to template1
  return <CartTemplate1 onCheckout={handleCheckout} contactPhone={contactPhone} />
}

function CartSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-surface, #f8f9fb)' }}
    >
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
          style={{ background: 'var(--color-border, #e2e8f0)' }}
        >
          <ShoppingCart className="w-8 h-8" style={{ color: 'var(--color-text-muted, #64748b)' }} />
        </div>
        <div
          className="h-6 w-48 mx-auto rounded animate-pulse mb-3"
          style={{ background: 'var(--color-border, #e2e8f0)' }}
        />
        <div
          className="h-4 w-64 mx-auto rounded animate-pulse"
          style={{ background: 'var(--color-border, #e2e8f0)' }}
        />
      </div>
    </div>
  )
}
