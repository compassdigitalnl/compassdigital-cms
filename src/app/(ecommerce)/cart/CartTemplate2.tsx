/**
 * Cart Template 2 - Modern Component-Based Version
 *
 * Alternative cart template with:
 * - Checkout progress stepper at top
 * - CartLineItem for cart items
 * - FreeShippingProgress for shipping incentive
 * - OrderSummary for checkout sidebar
 * - CouponInput for discount codes
 * - TrustSignals for trust badges
 * - RecentlyViewed component for recommendations
 *
 * Original: 569 lines → New: ~370 lines (-35% reduction)
 */

'use client'

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

// Modern Components
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper/Component'
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem/Component'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary/Component'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput/Component'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress/Component'
import { TrustSignals } from '@/branches/ecommerce/components/ui/TrustSignals/Component'
import { RecentlyViewed } from '@/branches/ecommerce/components/account/RecentlyViewed/Component'

interface CartTemplate2Props {
  onCheckout?: () => void
}

export default function CartTemplate2({ onCheckout }: CartTemplate2Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | undefined>()
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | undefined>()

  const handleCheckout = () => {
    if (onCheckout) onCheckout()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  // Calculate totals
  const shipping = total >= 150 ? 0 : 6.95
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const subtotal = total
  const tax = (total - discount + shipping) * 0.21
  const grandTotal = total - discount + shipping + tax

  // Free shipping threshold
  const freeShippingThreshold = 150

  // Coupon handlers
  const handleApplyCoupon = async (code: string) => {
    setCouponLoading(true)
    setCouponError(undefined)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation (in production, call API)
    if (code.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: code.toUpperCase(), discount: total * 0.1 })
      setCouponCode('')
    } else {
      setCouponError('Ongeldige kortingscode')
    }

    setCouponLoading(false)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined)
  }

  // ========================================
  // EMPTY CART STATE
  // ========================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--color-border)' }}
            >
              <ShoppingCart className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Je winkelwagen is leeg
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Voeg producten toe om te beginnen met winkelen.
            </p>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-xl font-bold transition-all hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Ga naar shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Group items by parentProductId (same logic as Template1)
  const groupedItems: {
    parentProduct: { id: number | string; title: string } | null
    items: typeof items
  }[] = []

  const itemsWithParent = items.filter((i) => i.parentProductId)
  const itemsWithoutParent = items.filter((i) => !i.parentProductId)

  const parentGroups = new Map<number | string, typeof items>()
  itemsWithParent.forEach((item) => {
    const parentId = item.parentProductId!
    if (!parentGroups.has(parentId)) {
      parentGroups.set(parentId, [])
    }
    parentGroups.get(parentId)!.push(item)
  })

  parentGroups.forEach((groupItems, parentId) => {
    groupedItems.push({
      parentProduct: {
        id: parentId,
        title: groupItems[0].parentProductTitle || `Grouped Product ${parentId}`,
      },
      items: groupItems,
    })
  })

  if (itemsWithoutParent.length > 0) {
    groupedItems.push({
      parentProduct: null,
      items: itemsWithoutParent,
    })
  }

  // Custom checkout steps for cart page
  const checkoutSteps = [
    { id: 1, label: 'Winkelwagen' },
    { id: 2, label: 'Gegevens' },
    { id: 3, label: 'Betaling' },
    { id: 4, label: 'Bevestiging' },
  ]

  // ========================================
  // MAIN CART LAYOUT
  // ========================================

  return (
    <div className="min-h-screen pb-32 lg:pb-20" style={{ background: 'var(--color-surface)' }}>
      {/* ========================================
          CHECKOUT PROGRESS STEPPER
          ======================================== */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <CheckoutProgressStepper currentStep={1} steps={checkoutSteps} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================
            PAGE HEADER
            ======================================== */}
        <div className="flex justify-between items-end mb-7">
          <div>
            <h1
              className="text-3xl lg:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Uw winkelwagen
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'} — Laatst bijgewerkt zojuist
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/shop/"
              className="px-4 py-2 rounded-lg border font-semibold text-sm transition-colors hover:bg-gray-50"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              ← Verder winkelen
            </Link>
          </div>
        </div>

        {/* ========================================
            CART LAYOUT (Items + Sidebar)
            ======================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ========================================
              LEFT: CART ITEMS
              ======================================== */}
          <div>
            <div className="flex flex-col gap-4">
              {groupedItems.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {group.items.map((item) => {
                      // Transform CartItem to CartLineItem props
                      const product = {
                        id: item.id,
                        name: item.title,
                        slug: item.slug || '',
                        sku: item.sku || '',
                        brand: item.sku?.split('-')[0] || 'PRODUCT',
                        image: item.image
                          ? { url: item.image, alt: item.title }
                          : undefined,
                        price: item.unitPrice ?? item.price,
                        oldPrice: item.unitPrice && item.unitPrice < item.price ? item.price : undefined,
                        unit: 'stuk',
                        stockStatus: 'in-stock' as const,
                        stockText: 'Op voorraad — morgen geleverd',
                        minQuantity: item.minOrderQuantity || 1,
                        maxQuantity: item.maxOrderQuantity || item.stock,
                        orderMultiple: item.orderMultiple || 1,
                      }

                      return (
                        <CartLineItem
                          key={item.id}
                          product={product}
                          quantity={item.quantity}
                          onQuantityChange={(newQty) => updateQuantity(item.id, newQty)}
                          onRemove={() => removeItem(item.id)}
                          currencySymbol="€"
                          locale="nl-NL"
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ========================================
                COUPON INPUT (below cart items)
                ======================================== */}
            <div className="mt-4">
              <CouponInput
                appliedCoupon={appliedCoupon}
                isLoading={couponLoading}
                errorMessage={couponError}
                currencySymbol="€"
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                placeholder="Kortingscode invoeren..."
                buttonText="Toepassen"
              />
            </div>
          </div>

          {/* ========================================
              RIGHT: SIDEBAR (Desktop Only)
              ======================================== */}
          <div className="hidden lg:block lg:sticky lg:top-24 flex flex-col gap-4">
            {/* Free Shipping Progress */}
            {shipping > 0 && (
              <FreeShippingProgress
                currentTotal={total}
                threshold={freeShippingThreshold}
                currencySymbol="€"
                locale="nl-NL"
              />
            )}

            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              discountCode={appliedCoupon?.code}
              shipping={shipping === 0 ? 'free' : shipping}
              tax={tax}
              total={grandTotal}
              showQuoteButton={true}
              sticky={false}
              readonly={false}
              taxRate={21}
              currencySymbol="€"
              locale="nl-NL"
              onCheckout={handleCheckout}
              onRequestQuote={() => {
                window.location.href = '/quote'
              }}
            />

            {/* Trust Signals */}
            <TrustSignals
              variant="minimal"
              signals={[
                { type: 'payment', label: 'SSL beveiligd' },
                { type: 'delivery', label: 'Morgen in huis' },
                { type: 'return', label: '30 dagen retour' },
                { type: 'support', label: 'Persoonlijk advies' },
              ]}
            />
          </div>
        </div>

        {/* ========================================
            RECENTLY VIEWED SECTION
            ======================================== */}
        <div className="mt-12">
          <RecentlyViewed
            maxItems={4}
            title="Recent bekeken"
            viewAllHref="/account/recent"
          />
        </div>
      </div>
    </div>
  )
}
