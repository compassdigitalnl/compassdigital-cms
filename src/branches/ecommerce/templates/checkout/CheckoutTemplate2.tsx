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

import { useEcommerceSettings } from '@/branches/ecommerce/hooks/useEcommerceSettings'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

// Phase 1 Components
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'

export default function CheckoutTemplate2() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, total, itemCount } = useCart()
  const { settings: ecomSettings } = useEcommerceSettings()
  const { displayPrice, showInclVAT, vatLabel } = usePriceMode()

  // Form state
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<Record<string, string> | null>(null)
  const [shippingMethod, setShippingMethod] = useState<string>('standard')
  const [paymentMethod, setPaymentMethod] = useState<string>('ideal')
  const [poNumber, setPoNumber] = useState('')

  // Coupon
  const [discount, setDiscount] = useState(0)

  // Processing
  const [isProcessing, setIsProcessing] = useState(false)

  // Pricing — use priceMode-aware subtotal
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = displayPrice(item.unitPrice ?? item.price, item.taxClass as any) ?? (item.unitPrice ?? item.price)
    return sum + unitPrice * item.quantity
  }, 0)
  const freeShippingThreshold = ecomSettings.freeShippingThreshold
  const shippingCost = shippingMethod === 'express' ? 9.95 : subtotal >= freeShippingThreshold ? 0 : ecomSettings.shippingCost
  // In B2C mode prices already include VAT, so don't add tax on top
  const tax = showInclVAT ? 0 : (subtotal + shippingCost - discount) * (ecomSettings.vatPercentage / 100)
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
            Winkelwagen is leeg
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

  // Validation
  const canPlaceOrder =
    (user || email) && address && shippingMethod && paymentMethod && (paymentMethod !== 'invoice' || poNumber)

  // Handlers
  const handleApplyCoupon = async (code: string) => {
    // TODO: Implement real coupon validation
    if (code === 'WELCOME10') {
      setDiscount(subtotal * 0.1)
    }
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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--container-width, 1536px)', margin: '0 auto', padding: '0 var(--sp-6)' }} className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
          >
            Afrekenen
          </h1>
          <Link
            href="/cart/"
            className="btn btn-ghost btn-sm w-fit"
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
                background: 'var(--white)',
                border: '1px solid var(--grey)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
              >
                1. Contact
              </h2>

              {user ? (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: 'var(--teal)' }} />
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
                      style={{ borderColor: 'var(--grey)', background: 'var(--white)' }}
                    />
                  </label>
                  <p className="text-xs" style={{ color: 'var(--grey-mid)' }}>
                    Heb je een account?{' '}
                    <Link href="/inloggen/" className="underline font-medium" style={{ color: 'var(--teal)' }}>
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
                background: 'var(--white)',
                border: '1px solid var(--grey)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
              >
                2. Adres
              </h2>
              <AddressForm
                onSubmit={(data) => setAddress(data as any)}
                submitLabel="Adres opslaan"
              />
            </div>

            {/* 3. Shipping Method */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--grey)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
              >
                3. Verzending
              </h2>
              <div className="space-y-3">
                <ShippingMethodCard
                  method={{
                    id: 'standard',
                    name: 'Standaard',
                    slug: 'standard',
                    icon: 'truck',
                    deliveryTime: '2-3 werkdagen',
                    price: subtotal >= freeShippingThreshold ? 0 : ecomSettings.shippingCost,
                  }}
                  selected={shippingMethod === 'standard'}
                  onSelect={() => setShippingMethod('standard')}
                />
                <ShippingMethodCard
                  method={{
                    id: 'express',
                    name: 'Express',
                    slug: 'express',
                    icon: 'zap',
                    deliveryTime: 'Volgende werkdag',
                    price: 9.95,
                  }}
                  selected={shippingMethod === 'express'}
                  onSelect={() => setShippingMethod('express')}
                />
              </div>
            </div>

            {/* 4. Payment Method */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--grey)',
                boxShadow: 'var(--sh-sm)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
              >
                4. Betaling
              </h2>
              <div className="space-y-3">
                <PaymentMethodCard
                  method={{
                    id: 'ideal',
                    name: 'iDEAL',
                    slug: 'ideal',
                    description: 'Direct via uw bank',
                    logo: '\uD83C\uDFE6',
                    badge: 'Populair',
                  }}
                  selected={paymentMethod === 'ideal'}
                  onSelect={() => setPaymentMethod('ideal')}
                />
                <PaymentMethodCard
                  method={{
                    id: 'creditcard',
                    name: 'Credit Card',
                    slug: 'creditcard',
                    description: 'Visa, Mastercard, Amex',
                    logo: '\uD83D\uDCB3',
                  }}
                  selected={paymentMethod === 'creditcard'}
                  onSelect={() => setPaymentMethod('creditcard')}
                />
                <PaymentMethodCard
                  method={{
                    id: 'invoice',
                    name: 'Op rekening',
                    slug: 'invoice',
                    description: 'Betaal binnen 14 dagen',
                    logo: '\uD83D\uDCCB',
                    isB2B: true,
                  }}
                  selected={paymentMethod === 'invoice'}
                  onSelect={() => setPaymentMethod('invoice')}
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
              className="btn btn-primary btn-lg w-full"
            >
              {isProcessing ? (
                'Bezig met verwerken...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Bestelling plaatsen ({'\u20AC'} {grandTotal.toFixed(2)})
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--grey-mid)' }}>
              Door uw bestelling te plaatsen gaat u akkoord met onze{' '}
              <Link href="/algemene-voorwaarden" className="underline" style={{ color: 'var(--teal)' }}>
                algemene voorwaarden
              </Link>
              .
            </p>
          </div>

          {/* Sidebar: Order Summary (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
                subtotal={subtotal}
                shipping={shippingCost}
                tax={tax}
                total={grandTotal}
                discount={discount}
                readonly
              />

              <div className="mt-4">
                <CouponInput onApply={handleApplyCoupon} />
              </div>

              <div className="mt-4">
                <TrustSignals
                  variant="compact"
                  signals={[
                    { icon: 'ShieldCheck', text: 'Veilig betalen' },
                    { icon: 'Truck', text: `Gratis vanaf \u20AC${ecomSettings.freeShippingThreshold}` },
                    { icon: 'RotateCcw', text: '30 dagen retour' },
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
