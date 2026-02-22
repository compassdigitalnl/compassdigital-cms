'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import CheckoutSteps from '@/branches/ecommerce/components/checkout/CheckoutSteps'
import CheckoutSummary from '@/branches/ecommerce/components/checkout/CheckoutSummary'
import GuestCheckoutForm from '@/branches/ecommerce/components/GuestCheckoutForm'
import { CreditCard, MapPin, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * CheckoutTemplate2 - Multi-step Checkout Flow
 *
 * Modern checkout template with clear step-by-step process.
 *
 * Steps:
 * 1. Cart (handled by cart page)
 * 2. Customer Info (login or guest)
 * 3. Payment Method
 * 4. Order Confirmation
 *
 * Features:
 * - Visual step indicator
 * - Guest checkout support
 * - Multiple payment methods
 * - Order summary sidebar
 * - Responsive design
 */

export default function CheckoutTemplate2() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, total, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(2) // Start at step 2 (Gegevens)
  const [isGuest, setIsGuest] = useState(searchParams?.get('guest') === 'true')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  // Form state
  const [guestData, setGuestData] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('ideal')
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if cart is empty (except on confirmation step)
  if (items.length === 0 && currentStep < 4) {
    router.push('/cart')
    return null
  }

  const handleGuestSubmit = async (data: any) => {
    setGuestData(data)
    setCurrentStep(3) // Move to payment step
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true)

    try {
      // TODO: Implement actual order creation API call
      console.log('Creating order...', {
        guestData,
        paymentMethod,
        items,
        total,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear cart
      clearCart()

      // Move to confirmation step
      setCurrentStep(4)
    } catch (error) {
      console.error('Order creation failed:', error)
      alert('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface, #f8f9fb)' }}>
      {/* Steps Indicator */}
      <CheckoutSteps
        currentStep={currentStep}
        onStepClick={currentStep < 4 ? setCurrentStep : undefined}
        allowClickPrevious={currentStep < 4}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Step Content */}
          <div>
            {/* Step 2: Customer Info */}
            {currentStep === 2 && (
              <StepPanel
                icon={<MapPin className="w-6 h-6" />}
                title="Uw gegevens"
                subtitle="Vul uw contactgegevens in om door te gaan"
              >
                {isGuest ? (
                  <GuestCheckoutForm
                    onSubmit={handleGuestSubmit}
                    onRegisterClick={() => router.push('/register')}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="mb-6 text-base" style={{ color: 'var(--color-text-muted)' }}>
                      Log in om door te gaan, of bestel als gast.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => router.push('/login')}
                        className="px-8 py-4 rounded-xl font-bold transition-all hover:opacity-90"
                        style={{
                          background: 'var(--color-primary)',
                          color: 'white',
                        }}
                      >
                        Inloggen
                      </button>
                      <button
                        onClick={() => setIsGuest(true)}
                        className="px-8 py-4 rounded-xl border-2 font-bold transition-all hover:bg-gray-50"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        Gast checkout
                      </button>
                    </div>
                  </div>
                )}
              </StepPanel>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <StepPanel
                icon={<CreditCard className="w-6 h-6" />}
                title="Betaling"
                subtitle="Kies uw betaalmethode"
              >
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50 disabled:opacity-50"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Terug
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 relative overflow-hidden group"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                    }}
                  >
                    {isProcessing ? 'Bezig met verwerken...' : 'Bestelling plaatsen'}
                    {!isProcessing && <ArrowRight className="w-4 h-4" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  </button>
                </div>

                {/* Terms Notice */}
                <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-muted)' }}>
                  Door uw bestelling te plaatsen gaat u akkoord met onze{' '}
                  <a href="/algemene-voorwaarden" className="underline" style={{ color: 'var(--color-primary)' }}>
                    algemene voorwaarden
                  </a>
                  .
                </p>
              </StepPanel>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <StepPanel
                icon={<CheckCircle className="w-6 h-6" style={{ color: 'var(--color-success)' }} />}
                title="Bestelling geplaatst!"
                subtitle="Bedankt voor uw bestelling"
              >
                <OrderConfirmation
                  orderNumber={`ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`}
                  email={guestData?.email || 'customer@example.com'}
                />
              </StepPanel>
            )}
          </div>

          {/* Right: Summary Sidebar (hide on confirmation) */}
          {currentStep < 4 && (
            <CheckoutSummary
              discount={discount}
              couponCode={couponCode}
              onRemoveCoupon={() => {
                setCouponCode('')
                setDiscount(0)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP PANEL
// ═════════════════════════════════════════════════════════════════════════════

function StepPanel({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl border p-6 lg:p-8"
      style={{
        background: 'white',
        borderColor: 'var(--color-border, #e2e8f0)',
        boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.08))',
      }}
    >
      <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary-bg, #e0f2f1)' }}
        >
          <div style={{ color: 'var(--color-primary, #00897b)' }}>{icon}</div>
        </div>
        <div className="min-w-0">
          <h2
            className="text-2xl lg:text-3xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h2>
          <p className="text-sm lg:text-base" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// PAYMENT METHOD SELECTOR
// ═════════════════════════════════════════════════════════════════════════════

function PaymentMethodSelector({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (method: string) => void
}) {
  const methods = [
    {
      id: 'ideal',
      name: 'iDEAL',
      icon: '🏦',
      desc: 'Direct betalen via uw bank',
      popular: true,
    },
    {
      id: 'creditcard',
      name: 'Credit Card',
      icon: '💳',
      desc: 'Visa, Mastercard, American Express',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      desc: 'Betaal met PayPal',
    },
    {
      id: 'invoice',
      name: 'Op rekening',
      icon: '📋',
      desc: 'Betaal binnen 14 dagen (alleen B2B)',
      b2bOnly: true,
    },
  ]

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className="w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-md"
          style={{
            borderColor:
              selected === method.id
                ? 'var(--color-primary, #00897b)'
                : 'var(--color-border, #e2e8f0)',
            background: selected === method.id ? 'var(--color-primary-bg, #e0f2f1)' : 'white',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{method.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-bold text-base lg:text-lg"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {method.name}
                </span>
                {method.popular && (
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-bold"
                    style={{
                      background: 'var(--color-primary, #00897b)',
                      color: 'white',
                    }}
                  >
                    Populair
                  </span>
                )}
                {method.b2bOnly && (
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-bold"
                    style={{
                      background: 'var(--color-secondary, #0a2647)',
                      color: 'white',
                    }}
                  >
                    B2B
                  </span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {method.desc}
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                selected === method.id ? 'scale-110' : 'scale-100'
              }`}
              style={{
                borderColor:
                  selected === method.id
                    ? 'var(--color-primary, #00897b)'
                    : 'var(--color-border, #cbd5e1)',
              }}
            >
              {selected === method.id && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: 'var(--color-primary, #00897b)' }}
                />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ORDER CONFIRMATION
// ═════════════════════════════════════════════════════════════════════════════

function OrderConfirmation({
  orderNumber,
  email,
}: {
  orderNumber: string
  email: string
}) {
  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div
        className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
        style={{ background: 'var(--color-success-bg, #f0fdf4)' }}
      >
        <CheckCircle
          className="w-12 h-12"
          style={{ color: 'var(--color-success, #16a34a)' }}
        />
      </div>

      <h3
        className="text-3xl font-bold mb-3"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
        }}
      >
        Bestelling geplaatst!
      </h3>

      <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
        Bedankt voor uw bestelling. We hebben een bevestiging gestuurd naar{' '}
        <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>
      </p>

      {/* Order Number */}
      <div
        className="inline-block px-8 py-4 rounded-xl mb-10"
        style={{
          background: 'var(--color-surface, #f1f5f9)',
          border: '2px dashed var(--color-border, #cbd5e1)',
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Bestelnummer
        </div>
        <div
          className="text-2xl font-bold"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--color-text-primary)',
          }}
        >
          {orderNumber}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <a
          href="/"
          className="inline-block px-8 py-4 rounded-xl font-bold transition-all hover:opacity-90"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          Terug naar home
        </a>
        <a
          href="/shop"
          className="inline-block px-8 py-4 rounded-xl border-2 font-bold transition-all hover:bg-gray-50"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          Verder winkelen
        </a>
      </div>

      {/* Timeline */}
      <div
        className="pt-10 border-t max-w-2xl mx-auto"
        style={{ borderColor: 'var(--color-border, #e2e8f0)' }}
      >
        <h4
          className="text-sm font-bold uppercase tracking-wider mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Wat gebeurt er nu?
        </h4>
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <TimelineStep
            icon="📧"
            title="Bevestiging ontvangen"
            desc="U heeft een orderbevestiging ontvangen per email"
          />
          <TimelineStep
            icon="📦"
            title="In behandeling"
            desc="Uw bestelling wordt ingepakt en verzendklaar gemaakt"
          />
          <TimelineStep
            icon="🚚"
            title="Verzending"
            desc="U ontvangt een track & trace code zodra het pakket verstuurd is"
          />
        </div>
      </div>
    </div>
  )
}

function TimelineStep({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-bold text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {desc}
      </div>
    </div>
  )
}
