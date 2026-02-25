'use client'

/**
 * CheckoutTemplate2 - Single-Page Checkout (Minimal)
 *
 * Features:
 * - Clean single-page layout (all steps visible)
 * - Compact components with minimal variant
 * - Guest checkout optimized
 * - Simplified payment flow
 * - Mobile-first responsive design
 * - Faster completion rate
 *
 * Built with Phase 1 components - 100% component reuse
 */

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingBag, ArrowLeft, Mail, CheckCircle } from 'lucide-react'

// Phase 1 Components
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'
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

export default function CheckoutTemplate2() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, total, itemCount } = useCart()

  // Form state
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<Partial<Address> | null>(null)
  const [shippingMethod, setShippingMethod] = useState<string>('standard')
  const [paymentMethod, setPaymentMethod] = useState<string>('ideal')
  const [poNumber, setPoNumber] = useState('')

  // Coupon
  const [discount, setDiscount] = useState(0)

  // Processing
  const [isProcessing, setIsProcessing] = useState(false)

  // Pricing
  const subtotal = total
  const freeShippingThreshold = 150
  const shippingCost = shippingMethod === 'express' ? 9.95 : subtotal >= freeShippingThreshold ? 0 : 6.95
  const tax = (subtotal + shippingCost - discount) * 0.21
  const grandTotal = subtotal + shippingCost + tax - discount

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-md text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--color-text-muted)', opacity: 0.3 }} />
          <h1
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            Winkelwagen is leeg
          </h1>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Naar shop
          </Link>
        </div>
      </div>
    )
  }

  // Validation
  const canPlaceOrder =
    (user || email) && address && shippingMethod && paymentMethod && (paymentMethod !== 'invoice' || poNumber)

  // Handlers
  const handleApplyCoupon = async (code: string) => {
    // TODO: Implement real coupon validation
    if (code === 'WELCOME10') {
      setDiscount(subtotal * 0.1)
      return { valid: true, message: '10% korting toegepast!' }
    }
    return { valid: false, message: 'Kortingscode niet gevonden' }
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return

    setIsProcessing(true)
    try {
      // TODO: Implement real order creation
      console.log('Creating order...', {
        email: user?.email || email,
        address,
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
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            Afrekenen
          </h1>
          <Link
            href="/cart/"
            className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity w-fit"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar winkelwagen
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Contact */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--color-base-0)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                1. Contact
              </h2>

              {user ? (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  <p className="font-medium">{user.email}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block">
                    <span className="font-medium text-sm mb-2 block">E-mailadres</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jouw@email.nl"
                      className="w-full px-4 py-3 rounded-lg border transition-colors"
                      style={{ borderColor: 'var(--color-border)', background: 'var(--color-base-0)' }}
                    />
                  </label>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Heb je een account?{' '}
                    <Link href="/login/" className="underline font-medium" style={{ color: 'var(--color-primary)' }}>
                      Inloggen
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* 2. Address */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--color-base-0)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                2. Adres
              </h2>
              <AddressForm
                onSubmit={setAddress}
                initialData={address}
                submitLabel="Adres opslaan"
                variant="compact"
              />
            </div>

            {/* 3. Shipping Method */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--color-base-0)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                3. Verzending
              </h2>
              <div className="space-y-3">
                <ShippingMethodCard
                  id="standard"
                  name="Standaard"
                  description="2-3 werkdagen"
                  price={subtotal >= freeShippingThreshold ? 0 : 6.95}
                  estimatedDays="2-3 werkdagen"
                  selected={shippingMethod === 'standard'}
                  onSelect={() => setShippingMethod('standard')}
                  variant="compact"
                />
                <ShippingMethodCard
                  id="express"
                  name="Express"
                  description="Volgende werkdag"
                  price={9.95}
                  estimatedDays="1 werkdag"
                  selected={shippingMethod === 'express'}
                  onSelect={() => setShippingMethod('express')}
                  variant="compact"
                />
              </div>
            </div>

            {/* 4. Payment Method */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--color-base-0)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
              >
                4. Betaling
              </h2>
              <div className="space-y-3">
                <PaymentMethodCard
                  id="ideal"
                  name="iDEAL"
                  description="Direct via uw bank"
                  icon="🏦"
                  selected={paymentMethod === 'ideal'}
                  onSelect={() => setPaymentMethod('ideal')}
                  variant="compact"
                  popular
                />
                <PaymentMethodCard
                  id="creditcard"
                  name="Credit Card"
                  description="Visa, Mastercard, Amex"
                  icon="💳"
                  selected={paymentMethod === 'creditcard'}
                  onSelect={() => setPaymentMethod('creditcard')}
                  variant="compact"
                />
                <PaymentMethodCard
                  id="invoice"
                  name="Op rekening"
                  description="Betaal binnen 14 dagen"
                  icon="📋"
                  selected={paymentMethod === 'invoice'}
                  onSelect={() => setPaymentMethod('invoice')}
                  variant="compact"
                  b2bOnly
                />
              </div>

              {paymentMethod === 'invoice' && (
                <div className="mt-4">
                  <PONumberInput value={poNumber} onChange={setPoNumber} required variant="compact" />
                </div>
              )}
            </div>

            {/* Trust Signals */}
            <TrustSignals variant="compact" />

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: 'white', boxShadow: 'var(--shadow)' }}
            >
              {isProcessing ? (
                'Bezig met verwerken...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Bestelling plaatsen (€ {grandTotal.toFixed(2)})
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
              Door uw bestelling te plaatsen gaat u akkoord met onze{' '}
              <Link href="/algemene-voorwaarden" className="underline" style={{ color: 'var(--color-primary)' }}>
                algemene voorwaarden
              </Link>
              .
            </p>
          </div>

          {/* Sidebar: Order Summary (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
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
                <div className="mb-3">
                  <CouponInput variant="compact" onApply={handleApplyCoupon} />
                </div>
              </OrderSummary>

              <div className="mt-4">
                <TrustSignals
                  variant="compact"
                  signals={[
                    { icon: 'ShieldCheck', label: 'Veilig betalen' },
                    { icon: 'Truck', label: 'Gratis vanaf €150' },
                    { icon: 'RotateCcw', label: '30 dagen retour' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
