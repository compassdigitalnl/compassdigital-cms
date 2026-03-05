'use client'

/**
 * CheckoutTemplate1 - Multi-Step Checkout (Enterprise)
 *
 * Features:
 * - 4-step checkout flow with progress indicator
 * - Guest checkout support
 * - Address management with NL postcode autocomplete
 * - Multiple payment methods (iDEAL, Credit Card, Invoice)
 * - B2B support (PO numbers, invoice payment)
 * - Order summary with coupon support
 * - Responsive: Desktop sidebar, mobile collapsible
 *
 * Built with Phase 1 components - 100% component reuse
 */

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { ShoppingBag, ArrowLeft, ArrowRight, Mail, ChevronDown, ChevronUp } from 'lucide-react'

import { useEcommerceSettings } from '@/branches/ecommerce/hooks/useEcommerceSettings'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

// Phase 1 Components
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'

type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'review'

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

export default function CheckoutTemplate1() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, total, itemCount, updateQuantity, removeItem } = useCart()
  const { settings: ecomSettings } = useEcommerceSettings()
  const { formatPriceStr } = usePriceMode()

  // Current step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact')

  // Contact step
  const [email, setEmail] = useState('')
  const [isGuest, setIsGuest] = useState(true)

  // Address step
  const [billingAddress, setBillingAddress] = useState<Partial<Address> | null>(null)
  const [shippingAddress, setShippingAddress] = useState<Partial<Address> | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // Shipping step
  const [shippingMethod, setShippingMethod] = useState<string>('')

  // Payment step
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [poNumber, setPoNumber] = useState('')

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string>('')
  const [discount, setDiscount] = useState(0)

  // Mobile cart summary
  const [showCartSummary, setShowCartSummary] = useState(false)

  // Processing
  const [isProcessing, setIsProcessing] = useState(false)

  // Pricing
  const subtotal = total
  const freeShippingThreshold = ecomSettings.freeShippingThreshold
  const shippingCost = shippingMethod === 'express' ? 9.95 : subtotal >= freeShippingThreshold ? 0 : ecomSettings.shippingCost
  const tax = (subtotal + shippingCost - discount) * (ecomSettings.vatPercentage / 100)
  const grandTotal = subtotal + shippingCost + tax - discount

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="max-w-md text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--grey-mid)', opacity: 0.3 }} />
          <h1
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
          >
            Je winkelwagen is leeg
          </h1>
          <Link
            href="/shop/"
            className="btn btn-ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            Naar shop
          </Link>
        </div>
      </div>
    )
  }

  // Step validation
  const canProceedToShipping = user || (isGuest && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  const canProceedToPayment = billingAddress && (sameAsShipping || shippingAddress)
  const canProceedToReview = shippingMethod && paymentMethod && (paymentMethod !== 'invoice' || poNumber)

  // Handlers
  const handleApplyCoupon = async (code: string) => {
    // TODO: Implement real coupon validation
    if (code === 'WELCOME10') {
      setAppliedCoupon(code)
      setDiscount(subtotal * 0.1) // 10% discount
      return { valid: true, message: '10% korting toegepast!' }
    }
    return { valid: false, message: 'Kortingscode niet gevonden' }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    try {
      // TODO: Implement real order creation
      console.log('Creating order...', {
        email: user?.email || email,
        billingAddress,
        shippingAddress: sameAsShipping ? billingAddress : shippingAddress,
        shippingMethod,
        paymentMethod,
        poNumber,
        items,
        total: grandTotal,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to order confirmation
      router.push(`/order/success?email=${user?.email || email}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      alert('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--container-width, 1536px)', margin: '0 auto', padding: '0 var(--sp-6)' }} className="py-8">
        {/* Progress Stepper */}
        <div className="mb-8">
          <CheckoutProgressStepper
            steps={[
              { id: 1 as any, label: 'Contact', completed: canProceedToShipping },
              { id: 2 as any, label: 'Verzending', completed: canProceedToPayment },
              { id: 3 as any, label: 'Betaling', completed: canProceedToReview },
              { id: 4 as any, label: 'Bestellen', completed: false },
            ] as any}
            currentStep={currentStep as any}
            onStepClick={(step) => setCurrentStep(step as unknown as CheckoutStep)}
          />
        </div>

        {/* Mobile: Collapsible Cart Summary */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowCartSummary(!showCartSummary)}
            className="w-full rounded-xl p-4 flex items-center justify-between transition-all"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--grey)',
              boxShadow: 'var(--sh-sm)',
            }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" style={{ color: 'var(--teal)' }} />
              <div className="text-left">
                <div className="font-bold text-sm">Winkelwagen</div>
                <div className="text-xs" style={{ color: 'var(--grey-mid)' }}>
                  {itemCount} {itemCount === 1 ? 'product' : 'producten'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-bold text-lg">€ {formatPriceStr(grandTotal)}</div>
              {showCartSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {showCartSummary && (
            <div className="mt-3">
              <OrderSummary {...{} as any}
                variant="compact"
                subtotal={subtotal}
                shipping={shippingCost}
                tax={tax}
                total={grandTotal}
                discount={discount}
                itemCount={itemCount}
                freeShippingThreshold={freeShippingThreshold}
                currency="€"
              >
                <CouponInput {...{} as any} variant="compact" onApply={handleApplyCoupon} />
              </OrderSummary>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: Contact */}
            {currentStep === 'contact' && (
              <div
                className="rounded-xl p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--grey)',
                  boxShadow: 'var(--sh-md)',
                }}
              >
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                >
                  Contact informatie
                </h2>

                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5" style={{ color: 'var(--teal)' }} />
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--grey-mid)' }}>
                      Niet jij?{' '}
                      <Link className="underline font-medium" href="/logout/">
                        Uitloggen
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-3 mb-4">
                      <Link
                        href="/login/"
                        className="btn btn-primary"
                      >
                        Inloggen
                      </Link>
                      <span className="text-sm self-center" style={{ color: 'var(--grey-mid)' }}>
                        of
                      </span>
                      <Link
                        href="/register/"
                        className="text-sm underline font-medium self-center"
                        style={{ color: 'var(--teal)' }}
                      >
                        Account aanmaken
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <label className="block">
                        <span className="font-medium text-sm mb-2 block">E-mailadres</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jouw@email.nl"
                          className="w-full px-4 py-3 rounded-lg border transition-colors"
                          style={{
                            borderColor: 'var(--grey)',
                            background: 'var(--white)',
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCurrentStep('shipping')}
                  disabled={!canProceedToShipping}
                  className="btn btn-primary btn-lg w-full mt-6"
                >
                  Doorgaan naar verzending
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 2: Shipping */}
            {currentStep === 'shipping' && (
              <div className="space-y-6">
                {/* Billing Address */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--grey)',
                    boxShadow: 'var(--sh-md)',
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                  >
                    Factuuradres
                  </h2>
                  <AddressForm {...{} as any}
                    onSubmit={(address) => {
                      setBillingAddress(address)
                      if (sameAsShipping) setShippingAddress(address)
                    }}
                    initialData={billingAddress}
                    submitLabel="Adres opslaan"
                  />
                </div>

                {/* Same as Billing Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={(e) => {
                      setSameAsShipping(e.target.checked)
                      if (e.target.checked) setShippingAddress(billingAddress)
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--teal)' }}
                  />
                  <label htmlFor="sameAsShipping" className="font-medium text-sm cursor-pointer">
                    Verzendadres is hetzelfde als factuuradres
                  </label>
                </div>

                {/* Shipping Address */}
                {!sameAsShipping && (
                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: 'var(--white)',
                      border: '1px solid var(--grey)',
                      boxShadow: 'var(--sh-md)',
                    }}
                  >
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                    >
                      Verzendadres
                    </h2>
                    <AddressForm {...{} as any}
                      onSubmit={setShippingAddress}
                      initialData={shippingAddress}
                      submitLabel="Adres opslaan"
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('contact')}
                    className="btn btn-outline-neutral"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Terug
                  </button>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    disabled={!canProceedToPayment}
                    className="btn btn-primary flex-1"
                  >
                    Doorgaan naar betaling
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Shipping Method */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--grey)',
                    boxShadow: 'var(--sh-md)',
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                  >
                    Verzendmethode
                  </h2>
                  <div className="space-y-3">
                    <ShippingMethodCard {...{} as any}
                      id="standard"
                      name="Standaard verzending"
                      description="Bezorging binnen 2-3 werkdagen"
                      price={subtotal >= freeShippingThreshold ? 0 : ecomSettings.shippingCost}
                      estimatedDays="2-3 werkdagen"
                      selected={shippingMethod === 'standard'}
                      onSelect={() => setShippingMethod('standard')}
                    />
                    <ShippingMethodCard {...{} as any}
                      id="express"
                      name="Express verzending"
                      description="Bezorging de volgende werkdag"
                      price={9.95}
                      estimatedDays="1 werkdag"
                      selected={shippingMethod === 'express'}
                      onSelect={() => setShippingMethod('express')}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--grey)',
                    boxShadow: 'var(--sh-md)',
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                  >
                    Betaalmethode
                  </h2>
                  <div className="space-y-3">
                    <PaymentMethodCard {...{} as any}
                      id="ideal"
                      name="iDEAL"
                      description="Direct betalen via uw bank"
                      icon="🏦"
                      selected={paymentMethod === 'ideal'}
                      onSelect={() => setPaymentMethod('ideal')}
                      popular
                    />
                    <PaymentMethodCard {...{} as any}
                      id="creditcard"
                      name="Credit Card"
                      description="Visa, Mastercard, American Express"
                      icon="💳"
                      selected={paymentMethod === 'creditcard'}
                      onSelect={() => setPaymentMethod('creditcard')}
                    />
                    <PaymentMethodCard {...{} as any}
                      id="invoice"
                      name="Op rekening"
                      description="Betaal binnen 14 dagen (alleen B2B)"
                      icon="📋"
                      selected={paymentMethod === 'invoice'}
                      onSelect={() => setPaymentMethod('invoice')}
                      b2bOnly
                    />
                  </div>

                  {/* PO Number for Invoice */}
                  {paymentMethod === 'invoice' && (
                    <div className="mt-6">
                      <PONumberInput value={poNumber} onChange={setPoNumber} required />
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="btn btn-outline-neutral"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Terug
                  </button>
                  <button
                    onClick={() => setCurrentStep('review')}
                    disabled={!canProceedToReview}
                    className="btn btn-primary flex-1"
                  >
                    Doorgaan naar overzicht
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Place Order */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                {/* Order Items */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--grey)',
                    boxShadow: 'var(--sh-md)',
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
                  >
                    Bestelling controleren
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartLineItem {...{} as any}
                        key={item.id}
                        item={item}
                        onQuantityChange={(newQty) => updateQuantity(item.id, newQty)}
                        onRemove={() => removeItem(item.id)}
                        variant="card"
                      />
                    ))}
                  </div>
                </div>

                {/* Trust Signals */}
                <TrustSignals variant="horizontal" />

                {/* Place Order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isProcessing ? 'Bezig met verwerken...' : `Bestelling plaatsen (€ ${formatPriceStr(grandTotal)})`}
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--grey-mid)' }}>
                  Door uw bestelling te plaatsen gaat u akkoord met onze{' '}
                  <Link href="/algemene-voorwaarden" className="underline" style={{ color: 'var(--teal)' }}>
                    algemene voorwaarden
                  </Link>
                  .
                </p>

                <button
                  onClick={() => setCurrentStep('payment')}
                  className="btn btn-outline-neutral w-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar betaling
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary (1/3) - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary {...{} as any}
                variant="default"
                subtotal={subtotal}
                shipping={shippingCost}
                tax={tax}
                total={grandTotal}
                discount={discount}
                itemCount={itemCount}
                freeShippingThreshold={freeShippingThreshold}
                currency="€"
              >
                <div className="mb-4">
                  <CouponInput onApply={handleApplyCoupon as any} />
                </div>
              </OrderSummary>

              <div className="mt-6">
                <TrustSignals variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
