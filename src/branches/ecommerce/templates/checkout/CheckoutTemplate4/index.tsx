/**
 * CheckoutTemplate4 - Ultimate Checkout Template
 *
 * The most advanced multi-step checkout with full component integration,
 * modern UX patterns, and complete type safety.
 *
 * Features:
 * - 4-step checkout flow (Contact → Address → Shipping → Payment)
 * - Guest + logged-in user support with OAuth
 * - Compact product sidebar (no full CartLineItem)
 * - Real order API integration
 * - B2B support (PO numbers, invoice payment)
 * - Fully responsive (mobile-first)
 * - Full accessibility (ARIA, keyboard nav)
 *
 * @version 4.1
 * @date 3 Maart 2026
 */

'use client'

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, ArrowLeft, ChevronDown, ChevronUp, CreditCard, Package, CheckCircle } from 'lucide-react'

// Checkout Components
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { UNIFIED_STEPS, internalStepToStepperStep } from '@/branches/ecommerce/lib/checkoutFlows'
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'
import { CheckoutAuthPanel } from '@/branches/ecommerce/components/checkout/CheckoutAuthPanel'
import { TrustBadges } from '@/branches/ecommerce/components/auth/TrustBadges'
import type { GuestCheckoutFormData } from '@/branches/ecommerce/components/auth/GuestCheckoutForm'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'

interface Address {
  firstName: string
  lastName: string
  company?: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
  phone: string
  email?: string
}

interface CheckoutTemplate4Props {
  settings?: any
}

export default function CheckoutTemplate4({ settings }: CheckoutTemplate4Props) {
  const { user } = useAuth()
  const router = useRouter()
  const { items, total, itemCount, clearCart } = useCart()

  // Step management (1-4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Contact
  const [email, setEmail] = useState(user?.email || '')
  const [isGuest, setIsGuest] = useState(!user)
  const [guestData, setGuestData] = useState<GuestCheckoutFormData | null>(null)

  // Addresses
  const [billingAddress, setBillingAddress] = useState<Address | null>(null)
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Shipping
  const [shippingMethod, setShippingMethod] = useState<string>('')

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [poNumber, setPoNumber] = useState('')

  // Cart
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | undefined>()
  const [showMobileCart, setShowMobileCart] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // CMS data for shipping & payment
  const [cmsShippingMethods, setCmsShippingMethods] = useState<any[]>([])
  const [cmsPaymentOptions, setCmsPaymentOptions] = useState<any[]>([])

  // Fetch shipping methods from CMS
  useEffect(() => {
    fetch('/api/shipping-methods?where[isActive][equals]=true&sort=sortOrder&limit=20')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.docs?.length) setCmsShippingMethods(data.docs)
      })
      .catch(() => {})
  }, [])

  // Fetch payment options from CMS
  useEffect(() => {
    fetch('/api/checkout-payment-options?where[isActive][equals]=true&sort=sortOrder&depth=1&limit=20')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.docs?.length) setCmsPaymentOptions(data.docs)
      })
      .catch(() => {})
  }, [])

  // Pricing (from CMS settings with sensible defaults)
  const subtotal = total
  const vatPercentage = (settings?.vatPercentage ?? 21) / 100

  // Compute shipping cost from selected CMS method
  const selectedShipping = cmsShippingMethods.find((m) => m.slug === shippingMethod)
  const shippingCost = selectedShipping
    ? (selectedShipping.freeThreshold && subtotal >= selectedShipping.freeThreshold ? 0 : selectedShipping.price)
    : 0
  const discount = appliedCoupon?.discountAmount || 0
  const tax = (subtotal + shippingCost - discount) * vatPercentage
  const grandTotal = subtotal + shippingCost + tax - discount

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Je winkelwagen is leeg
          </h1>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200"
            style={{ background: 'var(--color-primary, #0A1628)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Naar shop
          </Link>
        </div>
      </div>
    )
  }

  // Step validation
  const canProceedToShipping = billingAddress && (sameAsBilling || shippingAddress)
  const canProceedToPayment = !!shippingMethod
  const canPlaceOrder = paymentMethod && (paymentMethod !== 'invoice' || poNumber)

  // Handlers
  const handleApplyCoupon = async (code: string) => {
    if (code === 'WELCOME10') {
      setAppliedCoupon({ code, discountAmount: subtotal * 0.1 })
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined)
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return

    setIsProcessing(true)
    try {
      // 1. Create server-side cart from localStorage items
      const cartResponse = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          items: items.map((item) => ({
            product: Number(item.id),
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          itemCount,
          subtotal,
          total: grandTotal,
          currency: 'EUR',
        }),
      })

      if (!cartResponse.ok) {
        const cartError = await cartResponse.json()
        throw new Error(cartError.message || 'Kon winkelwagen niet aanmaken')
      }

      const cartData = await cartResponse.json()
      const cartId = cartData.doc?.id

      if (!cartId) {
        throw new Error('Geen cart ID ontvangen')
      }

      // 2. Create order via checkout API
      const effectiveShipping = sameAsBilling ? billingAddress : shippingAddress
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          shippingAddress: effectiveShipping,
          billingAddress,
          paymentMethod,
          shippingMethod,
          guestEmail: !user ? email : undefined,
          guestName: !user
            ? guestData
              ? `${guestData.firstName} ${guestData.lastName}`
              : billingAddress
                ? `${billingAddress.firstName} ${billingAddress.lastName}`
                : undefined
            : undefined,
          guestPhone: !user && guestData?.phone ? guestData.phone : undefined,
        }),
      })

      if (!orderResponse.ok) {
        const orderError = await orderResponse.json()
        throw new Error(orderError.message || 'Bestelling kon niet worden geplaatst')
      }

      const orderResult = await orderResponse.json()

      // 3. Clear localStorage cart
      clearCart()

      // 4. Redirect to order confirmation
      router.push(`/order/${orderResult.order.id}`)
    } catch (error: any) {
      console.error('Order failed:', error)
      alert(error.message || 'Er ging iets mis bij het plaatsen van je bestelling. Probeer het opnieuw.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="t4-page">
      {/* Checkout progress stepper — full-width bar, consistent with cart */}
      <div className="t4-step-bar">
        <CheckoutProgressStepper
          currentStep={internalStepToStepperStep(currentStep)}
          steps={UNIFIED_STEPS}
          onStepClick={(stepId) => {
            if (stepId === 1) router.push('/cart')
          }}
        />
      </div>

      <div className="t4-container t4-section">
        {/* Page header */}
        <div className="t4-header">
          <div>
            <h1 className="t4-header__title">Afrekenen</h1>
            <p className="t4-header__sub">
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'}
            </p>
          </div>
          <div className="t4-header__links">
            <Link href="/cart" className="t4-header__link t4-header__link--ghost">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              Terug naar winkelwagen
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="t4-layout">
          {/* Left Column: Checkout Steps */}
          <div className="t4-main">
            {/* Step 1: Contact */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact informatie</h2>

                {user ? (
                  /* Logged-in user: welkom terug + trust badges */
                  <div className="space-y-4">
                    <h2
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-heading, "DM Serif Display", serif)',
                        color: 'var(--color-primary, #0A1628)',
                      }}
                    >
                      Welkom terug{(user as any).firstName ? `, ${(user as any).firstName}` : ''}
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Ingelogd als</p>
                        <p className="text-sm text-green-700">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: 'var(--color-primary, #0A1628)',
                        boxShadow: '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary-dark, #121F33)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary, #0A1628)'
                      }}
                    >
                      Ga door naar adres
                    </button>

                    <TrustBadges />
                  </div>
                ) : (
                  /* Guest / Login / Register tabs */
                  <CheckoutAuthPanel
                    defaultTab="login"
                    enableGuestCheckout={settings?.enableGuestCheckout ?? true}
                    onAuthenticated={({ email: authEmail, isGuest: authIsGuest, guestData: authGuestData }) => {
                      setEmail(authEmail)
                      setIsGuest(authIsGuest)
                      if (authGuestData) {
                        setGuestData(authGuestData)
                      }
                      setCurrentStep(2)
                    }}
                  />
                )}
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <AddressForm
                  title="Factuuradres"
                  submitLabel={false}
                  onChange={(address) => setBillingAddress(address as Address)}
                />

                {/* Shipping address toggle */}
                <label
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer select-none hover:border-gray-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!sameAsBilling}
                    onChange={(e) => {
                      setSameAsBilling(!e.target.checked)
                      if (!e.target.checked) setShippingAddress(null)
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--color-primary, #0A1628)' }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Afleveradres wijkt af van factuuradres
                  </span>
                </label>

                {!sameAsBilling && (
                  <AddressForm
                    title="Afleveradres"
                    submitLabel={false}
                    onChange={(address) => setShippingAddress(address as Address)}
                  />
                )}

                {/* Navigation buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid var(--color-primary, #0A1628)',
                      color: 'var(--color-primary, #0A1628)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary-glow, rgba(10,22,40,0.05))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={() => canProceedToShipping && setCurrentStep(3)}
                    disabled={!canProceedToShipping}
                    className="flex-1 py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: 'var(--color-primary, #0A1628)',
                      boxShadow: '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'var(--color-primary-dark, #121F33)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'var(--color-primary, #0A1628)'
                      }
                    }}
                  >
                    Ga door naar verzending
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Shipping */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {cmsShippingMethods.length > 0 ? (
                  cmsShippingMethods.map((method) => {
                    const effectivePrice = method.freeThreshold && subtotal >= method.freeThreshold
                      ? 0
                      : method.price
                    return (
                      <ShippingMethodCard
                        key={method.id}
                        method={{
                          id: String(method.id),
                          name: method.name,
                          slug: method.slug,
                          icon: method.icon || 'truck',
                          deliveryTime: method.deliveryTime || '',
                          price: effectivePrice,
                          isFree: effectivePrice === 0,
                          estimatedDays: method.estimatedDays,
                          freeThreshold: method.freeThreshold,
                        }}
                        selected={shippingMethod === method.slug}
                        onSelect={() => setShippingMethod(method.slug)}
                      />
                    )
                  })
                ) : (
                  <>
                    <ShippingMethodCard
                      method={{
                        id: 'standard',
                        name: 'Standaard verzending',
                        slug: 'standard',
                        icon: 'truck',
                        deliveryTime: '2-3 werkdagen',
                        price: shippingCost,
                        estimatedDays: 3,
                      }}
                      selected={shippingMethod === 'standard'}
                      onSelect={() => setShippingMethod('standard')}
                    />
                    <ShippingMethodCard
                      method={{
                        id: 'express',
                        name: 'Express verzending',
                        slug: 'express',
                        icon: 'zap',
                        deliveryTime: 'Volgende werkdag',
                        price: 9.95,
                        estimatedDays: 1,
                      }}
                      selected={shippingMethod === 'express'}
                      onSelect={() => setShippingMethod('express')}
                    />
                  </>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-3.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid var(--color-primary, #0A1628)',
                      color: 'var(--color-primary, #0A1628)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary-glow, rgba(10,22,40,0.05))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={() => canProceedToPayment && setCurrentStep(4)}
                    disabled={!canProceedToPayment}
                    className="flex-1 py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: 'var(--color-primary, #0A1628)',
                      boxShadow: '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'var(--color-primary-dark, #121F33)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'var(--color-primary, #0A1628)'
                      }
                    }}
                  >
                    Ga door naar betaling
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cmsPaymentOptions.length > 0 ? (
                    cmsPaymentOptions.map((option) => {
                      const logoUrl = typeof option.icon === 'object' && option.icon?.url
                        ? option.icon.url
                        : null
                      return (
                        <PaymentMethodCard
                          key={option.id}
                          method={{
                            id: String(option.id),
                            name: option.name,
                            slug: option.slug,
                            description: option.description || '',
                            logo: logoUrl
                              ? <img src={logoUrl} alt={option.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                              : option.slug === 'creditcard'
                                ? <CreditCard className="w-6 h-6" />
                                : option.slug === 'ideal'
                                  ? '🏦'
                                  : '💳',
                            isB2B: option.isB2B,
                            fee: option.fee,
                            badge: option.badge,
                          }}
                          selected={paymentMethod === option.slug}
                          onSelect={() => setPaymentMethod(option.slug)}
                        />
                      )
                    })
                  ) : (
                    <>
                      <PaymentMethodCard
                        method={{
                          id: 'ideal',
                          name: 'iDEAL',
                          slug: 'ideal',
                          description: 'Betaal direct via je bank',
                          logo: '🏦',
                        }}
                        selected={paymentMethod === 'ideal'}
                        onSelect={() => setPaymentMethod('ideal')}
                      />
                      <PaymentMethodCard
                        method={{
                          id: 'card',
                          name: 'Creditcard',
                          slug: 'creditcard',
                          description: 'Visa, Mastercard, Amex',
                          logo: <CreditCard className="w-6 h-6" />,
                        }}
                        selected={paymentMethod === 'card'}
                        onSelect={() => setPaymentMethod('card')}
                      />
                      <PaymentMethodCard
                        method={{
                          id: 'invoice',
                          name: 'Op rekening',
                          slug: 'invoice',
                          description: 'Betaal binnen 14 dagen',
                          logo: '📄',
                          isB2B: true,
                        }}
                        selected={paymentMethod === 'invoice'}
                        onSelect={() => setPaymentMethod('invoice')}
                      />
                    </>
                  )}
                </div>

                {paymentMethod === 'invoice' && (
                  <PONumberInput
                    value={poNumber}
                    onChange={setPoNumber}
                    required={true}
                  />
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid var(--color-primary, #0A1628)',
                      color: 'var(--color-primary, #0A1628)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary-glow, rgba(10,22,40,0.05))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder || isProcessing}
                    className="flex-1 py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: isProcessing
                        ? 'var(--color-text-secondary, #94A3B8)'
                        : 'var(--color-primary, #0A1628)',
                      boxShadow: isProcessing ? 'none' : '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = 'var(--color-primary-dark, #121F33)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = 'var(--color-primary, #0A1628)'
                      }
                    }}
                  >
                    {isProcessing ? 'Bezig...' : `Bestelling plaatsen - €${grandTotal.toFixed(2)}`}
                  </button>
                </div>

                <TrustSignals variant="compact" />
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="t4-sidebar">
            {/* Mobile Cart Toggle */}
            <button
              onClick={() => setShowMobileCart(!showMobileCart)}
              className="t4-mobile-toggle"
            >
              <span>
                Besteloverzicht ({itemCount} {itemCount === 1 ? 'product' : 'producten'})
              </span>
              {showMobileCart ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {/* Desktop: Always visible, Mobile: Collapsible */}
            <div className={`t4-sidebar__content ${showMobileCart ? 't4-sidebar__content--open' : ''}`}>
              {/* Compact Cart Items */}
              <div className="t4-order-items">
                <h3 className="t4-order-items__title">Je bestelling</h3>
                <div className="t4-order-items__list">
                  {items.map((item) => (
                    <div key={item.id} className="t4-order-item">
                      <div className="t4-order-item__thumb">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="t4-order-item__placeholder">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="t4-order-item__info">
                        <p className="t4-order-item__name">{item.title}</p>
                        <p className="t4-order-item__qty">{item.quantity}x €{item.price.toFixed(2)}</p>
                      </div>
                      <span className="t4-order-item__total">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="t4-order-items__footer">
                  <Link href="/cart" className="t4-order-items__edit">
                    Winkelwagen bewerken
                  </Link>
                </div>
              </div>

              {/* Coupon */}
              <div className="t4-coupon-bar">
                <CouponInput
                  onApply={handleApplyCoupon}
                  onRemove={handleRemoveCoupon}
                  appliedCoupon={appliedCoupon}
                />
              </div>

              {/* Summary card with navy header */}
              <div className="t4-summary-card">
                <div className="t4-summary-card__head">
                  <h3 className="t4-summary-card__title">Besteloverzicht</h3>
                </div>
                <div className="t4-summary-card__body">
                  <OrderSummary
                    subtotal={subtotal}
                    shipping={shippingCost}
                    tax={tax}
                    discount={discount}
                    discountCode={appliedCoupon?.code}
                    total={grandTotal}
                    onCheckout={handlePlaceOrder}
                    readonly={!canPlaceOrder || isProcessing}
                    sticky={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .t4-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .t4-step-bar {
          background: var(--white);
          border-bottom: 1px solid var(--grey);
          padding: var(--sp-6) 0;
        }
        .t4-container {
          max-width: var(--container-width, 1536px);
          margin: 0 auto;
          padding: 0 var(--sp-6);
        }
        .t4-section {
          padding-top: var(--sp-8);
          padding-bottom: var(--sp-16);
        }

        /* Header — matches CartTemplate4 */
        .t4-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--sp-8);
        }
        .t4-header__title {
          font-family: var(--font-display);
          font-size: var(--text-hero);
          color: var(--navy);
          line-height: 1.1;
        }
        .t4-header__sub {
          font-size: var(--text-body);
          color: var(--grey-mid);
          margin-top: var(--sp-2);
        }
        .t4-header__links {
          display: flex;
          gap: var(--sp-4);
        }
        .t4-header__links :global(.t4-header__link) {
          font-size: var(--text-body);
          font-weight: 600;
          text-decoration: none;
          padding: var(--sp-2) var(--sp-4);
          border-radius: var(--r-sm);
          transition: all var(--transition, 0.2s);
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .t4-header__links :global(.t4-header__link--ghost) {
          border: 1.5px solid var(--grey);
          color: var(--grey-dark);
        }
        .t4-header__links :global(.t4-header__link--ghost:hover) {
          border-color: var(--navy);
          color: var(--navy);
        }

        /* Layout — matches CartTemplate4 grid */
        .t4-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--sp-8);
          align-items: start;
        }

        /* Main checkout steps column */
        .t4-main {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }

        /* Sidebar */
        .t4-sidebar {
          position: sticky;
          top: 90px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        /* Mobile cart toggle */
        .t4-mobile-toggle {
          display: none;
        }

        /* Sidebar content */
        .t4-sidebar__content {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        /* Order items card */
        .t4-order-items {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-6);
          box-shadow: var(--sh-sm);
        }
        .t4-order-items__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: var(--navy);
          margin-bottom: var(--sp-4);
        }
        .t4-order-items__list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          max-height: 384px;
          overflow-y: auto;
        }
        .t4-order-item {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }
        .t4-order-item__thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--r-sm);
          background: var(--bg);
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }
        .t4-order-item__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--grey-mid);
        }
        .t4-order-item__info {
          flex: 1;
          min-width: 0;
        }
        .t4-order-item__name {
          font-size: var(--text-small);
          font-weight: 600;
          color: var(--navy);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .t4-order-item__qty {
          font-size: 12px;
          color: var(--grey-mid);
        }
        .t4-order-item__total {
          font-size: var(--text-small);
          font-weight: 700;
          color: var(--navy);
          flex-shrink: 0;
        }
        .t4-order-items__footer {
          margin-top: var(--sp-4);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--grey);
        }
        .t4-order-items__footer :global(.t4-order-items__edit) {
          font-size: var(--text-small);
          color: var(--color-primary, #0A1628);
          font-weight: 600;
          text-decoration: none;
        }
        .t4-order-items__footer :global(.t4-order-items__edit:hover) {
          color: var(--color-primary-dark, #121F33);
          text-decoration: underline;
        }

        /* Coupon bar */
        .t4-coupon-bar {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-4) var(--sp-6);
          box-shadow: var(--sh-sm);
        }

        /* Summary card — matches CartTemplate4 */
        .t4-summary-card {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          box-shadow: var(--sh-md);
          overflow: hidden;
        }
        .t4-summary-card__head {
          background: var(--navy);
          padding: var(--sp-4) var(--sp-6);
        }
        .t4-summary-card__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: white;
        }
        .t4-summary-card__body {
          padding: 0;
        }

        @media (max-width: 900px) {
          .t4-layout {
            grid-template-columns: 1fr;
          }
          .t4-sidebar {
            position: static;
          }
          .t4-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--sp-4);
          }
          .t4-header__title {
            font-size: var(--text-section);
          }
          .t4-mobile-toggle {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            background: var(--white);
            border-radius: var(--r-lg);
            border: 1px solid var(--grey);
            padding: var(--sp-4);
            font-weight: 700;
            color: var(--navy);
            box-shadow: var(--sh-sm);
            cursor: pointer;
          }
          .t4-sidebar__content {
            display: none;
          }
          .t4-sidebar__content--open {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}
