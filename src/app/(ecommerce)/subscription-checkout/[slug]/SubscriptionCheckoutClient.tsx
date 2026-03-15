'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CreditCard, CheckCircle, Loader2,
  BookOpen, ArrowRight, ChevronDown, ChevronUp, ShoppingBag,
} from 'lucide-react'
import { useAuth } from '@/providers/Auth'
import { useEcommerceSettings } from '@/branches/ecommerce/shared/hooks/useEcommerceSettings'
import { CheckoutProgressStepper } from '@/branches/ecommerce/shared/components/checkout/CheckoutProgressStepper'
import { CheckoutAuthPanel } from '@/branches/ecommerce/shared/components/checkout/CheckoutAuthPanel'
import { AddressForm } from '@/branches/ecommerce/shared/components/checkout/AddressForm'
import { PaymentMethodCard } from '@/branches/ecommerce/shared/components/checkout/PaymentMethodCard'
import { TrustBadges } from '@/branches/ecommerce/shared/components/auth/TrustBadges'
import { TrustSignals } from '@/branches/shared/components/ui/marketing/TrustSignals'
import { PricingPlanCard } from '@/branches/shared/components/ui/ecommerce/pricing/PricingPlanCard'
import { LucideIcon } from '@/branches/ecommerce/shared/components/ui/LucideIcon'
import type { PricingPlan } from '@/branches/shared/components/ui/ecommerce/pricing/PricingPlanCard/types'
import type { Address } from '@/branches/ecommerce/shared/components/checkout/AddressForm/types'
import type { GuestCheckoutFormData } from '@/branches/ecommerce/shared/components/auth/GuestCheckoutForm'

interface SubscriptionCheckoutClientProps {
  magazineName: string
  magazineSlug: string
  plans: PricingPlan[]
  selectedPlanId?: number | string
}

const SUB_STEPS = [
  { id: 1, label: 'Abonnement' },
  { id: 2, label: 'Gegevens' },
  { id: 3, label: 'Adres' },
  { id: 4, label: 'Betaling' },
  { id: 5, label: 'Bevestiging' },
]

export default function SubscriptionCheckoutClient({
  magazineName,
  magazineSlug,
  plans,
  selectedPlanId: initialPlanId,
}: SubscriptionCheckoutClientProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { settings: ecomSettings } = useEcommerceSettings()
  const cmsPaymentOptions = ecomSettings.paymentOptions

  // Step management: 1=Plan, 2=Contact, 3=Adres, 4=Betaling, 5=Bevestiging
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  // Step 1: Plan
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    initialPlanId || plans.find((p) => p.highlighted)?.id || plans[0]?.id,
  )

  // Step 2: Contact
  const [email, setEmail] = useState(user?.email || '')
  const [isGuest, setIsGuest] = useState(!user)
  const [guestData, setGuestData] = useState<GuestCheckoutFormData | null>(null)

  // Step 3: Address
  const [billingAddress, setBillingAddress] = useState<Address | null>(null)

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<string>('')

  // Step 5: Confirm
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // Mobile sidebar toggle
  const [showMobileSummary, setShowMobileSummary] = useState(false)

  const selectedPlan = plans.find((p) => p.id === selectedId) || plans[0]
  const price = selectedPlan?.price ?? 0
  const formatPrice = (p: number) => `€ ${p.toFixed(2).replace('.', ',')}`

  // Validation
  const isAddressComplete = (addr: Address | null): boolean => {
    if (!addr) return false
    return !!(
      addr.firstName?.trim() &&
      addr.lastName?.trim() &&
      addr.street?.trim() &&
      addr.houseNumber?.trim() &&
      addr.postalCode?.trim() &&
      addr.city?.trim() &&
      addr.country?.trim()
    )
  }

  const canProceedToContact = !!selectedId
  const canProceedToAddress = !!email
  const canProceedToPayment = isAddressComplete(billingAddress)
  const canProceedToConfirm = !!paymentMethod
  const canPlaceOrder = canProceedToContact && canProceedToAddress && canProceedToPayment && canProceedToConfirm

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedId(plan.id)
    setError(null)
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/subscription/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazineSlug,
          planId: selectedPlan.id,
          customer: {
            firstName: billingAddress?.firstName || guestData?.firstName || '',
            lastName: billingAddress?.lastName || guestData?.lastName || '',
            email,
            phone: guestData?.phone || '',
          },
          address: {
            street: billingAddress?.street || '',
            houseNumber: billingAddress?.houseNumber || '',
            postalCode: billingAddress?.postalCode || '',
            city: billingAddress?.city || '',
          },
          paymentMethod,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrderNumber(data.orderNumber || `#${data.orderId}`)
        setOrderConfirmed(true)
      } else {
        setError(data.error || 'Er is een fout opgetreden. Probeer het opnieuw.')
      }
    } catch {
      setError('Verbindingsfout. Controleer je internet en probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Order Confirmed (Step 5 success) ──
  if (orderConfirmed) {
    return (
      <div className="sub-page">
        <div className="sub-container" style={{ maxWidth: 800, paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-16)' }}>
          <div className="sub-confirm-card">
            <div className="sub-confirm-icon">
              <CheckCircle size={32} />
            </div>
            <h1 className="sub-confirm-title">Bestelling geplaatst!</h1>
            <p className="sub-confirm-text">
              Je abonnement op <strong>{magazineName}</strong> — {selectedPlan?.name} is ontvangen.
            </p>
            <p className="sub-confirm-order">Bestelnummer: <strong>{orderNumber}</strong></p>

            <div className="sub-confirm-summary">
              <span>{magazineName} — {selectedPlan?.name}</span>
              <span className="sub-confirm-price">{formatPrice(price)}</span>
            </div>

            <div className="sub-confirm-actions">
              <Link href={`/magazines/${magazineSlug}`} className="btn btn-primary btn-lg">
                Terug naar {magazineName} <ArrowRight size={16} />
              </Link>
              <Link href="/magazines" className="btn btn-outline-primary">
                Alle magazines
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .sub-page { min-height: 100vh; background: var(--bg); }
          .sub-container { max-width: var(--container-width, 1536px); margin: 0 auto; padding: 0 var(--sp-6); }
          .sub-confirm-card { background: var(--white); border-radius: var(--r-lg); border: 1px solid var(--grey); box-shadow: var(--sh-lg); padding: var(--sp-10, 40px); text-align: center; }
          .sub-confirm-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--color-success-light, #E8F5E9); display: flex; align-items: center; justify-content: center; color: var(--green); margin: 0 auto var(--sp-5, 20px); }
          .sub-confirm-title { font-family: var(--font-display); font-size: var(--text-section, 28px); color: var(--navy); margin-bottom: var(--sp-2); }
          .sub-confirm-text { font-size: var(--text-body); color: var(--grey-dark); margin-bottom: var(--sp-1); }
          .sub-confirm-order { font-size: var(--text-small); color: var(--grey-mid); margin-bottom: var(--sp-6); }
          .sub-confirm-summary { display: flex; justify-content: space-between; align-items: center; background: var(--bg); border: 1px solid var(--grey); border-radius: var(--r-md, 10px); padding: var(--sp-4) var(--sp-6); margin-bottom: var(--sp-6); font-size: var(--text-body); color: var(--navy); }
          .sub-confirm-price { font-family: var(--font-display); font-size: var(--text-card-title, 18px); font-weight: 800; }
          .sub-confirm-actions { display: flex; flex-direction: column; align-items: center; gap: var(--sp-3); }
          @media (min-width: 640px) { .sub-confirm-actions { flex-direction: row; justify-content: center; } }
        `}</style>
      </div>
    )
  }

  // ── Multi-step Checkout ──
  return (
    <div className="sub-page">
      {/* Stepper bar — identical to CheckoutTemplate4 */}
      <div className="sub-step-bar">
        <CheckoutProgressStepper
          currentStep={currentStep}
          steps={SUB_STEPS}
          onStepClick={(stepId) => {
            if (stepId < currentStep) setCurrentStep(stepId as 1 | 2 | 3 | 4 | 5)
          }}
        />
      </div>

      <div className="sub-container sub-section">
        {/* Page header — matches CheckoutTemplate4 */}
        <div className="sub-header">
          <div>
            <h1 className="sub-header__title">Afrekenen</h1>
            <p className="sub-header__sub">{magazineName} abonnement</p>
          </div>
          <div className="sub-header__links">
            <Link href={`/magazines/${magazineSlug}`} className="sub-header__link sub-header__link--ghost">
              <ArrowLeft size={14} />
              Terug naar {magazineName}
            </Link>
          </div>
        </div>

        {/* Main Grid — identical to CheckoutTemplate4 */}
        <div className="sub-layout">
          {/* Left Column: Checkout Steps */}
          <div className="sub-main">

            {/* ── STEP 1: Plan kiezen ── */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-light">
                <h2 className="text-xl font-bold text-navy mb-4">Kies je abonnement</h2>
                <div className={`sub-plan-grid ${plans.length <= 2 ? 'sub-plan-grid--2' : 'sub-plan-grid--3'}`}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`sub-plan-wrap ${selectedId === plan.id ? 'sub-plan-wrap--selected' : ''}`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <PricingPlanCard
                        plan={{ ...plan, href: undefined, buttonLabel: selectedId === plan.id ? 'Geselecteerd' : plan.buttonLabel, buttonVariant: selectedId === plan.id ? 'fill' : 'outline' }}
                        onSelect={handleSelectPlan}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: Contact — identical to CheckoutTemplate4 ── */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-light">
                <h2 className="text-xl font-bold text-navy mb-4">Contact informatie</h2>

                {user ? (
                  <div className="space-y-4">
                    <h2
                      className="text-2xl mb-1"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
                    >
                      Welkom terug{(user as any).firstName ? `, ${(user as any).firstName}` : ''}
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Ingelogd als</p>
                        <p className="text-sm text-green-700">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setEmail(user.email); setIsGuest(false); setCurrentStep(3) }}
                      className="btn btn-primary btn-lg w-full"
                    >
                      Ga door naar adres
                    </button>

                    <TrustBadges />
                  </div>
                ) : (
                  <CheckoutAuthPanel
                    defaultTab="login"
                    enableGuestCheckout={ecomSettings.enableGuestCheckout}
                    onAuthenticated={({ email: authEmail, isGuest: authIsGuest, guestData: authGuestData }) => {
                      setEmail(authEmail)
                      setIsGuest(authIsGuest)
                      if (authGuestData) setGuestData(authGuestData)
                      setCurrentStep(3)
                    }}
                  />
                )}

                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Adres — identical to CheckoutTemplate4 ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <AddressForm
                  title="Factuuradres"
                  submitLabel={false}
                  onChange={(address) => setBillingAddress(address as Address)}
                />

                <div className="flex gap-4">
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={() => canProceedToPayment && setCurrentStep(4)}
                    disabled={!canProceedToPayment}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    Ga door naar betaling
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Betaling — identical to CheckoutTemplate4 ── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cmsPaymentOptions.length > 0 ? (
                    cmsPaymentOptions.map((option) => {
                      const logoUrl = typeof option.icon === 'object' && option.icon?.url
                        ? option.icon.url
                        : null
                      const lucideIconName = option.lucideIcon || null
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
                              : lucideIconName
                                ? <LucideIcon name={lucideIconName} size={22} color="var(--teal)" />
                                : <CreditCard size={22} color="var(--teal)" />,
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
                        selected={paymentMethod === 'creditcard'}
                        onSelect={() => setPaymentMethod('creditcard')}
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

                <div className="flex gap-4">
                  <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={() => canProceedToConfirm && setCurrentStep(5)}
                    disabled={!canProceedToConfirm}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    Ga door naar bevestiging
                  </button>
                </div>

                <TrustSignals variant="compact" />
              </div>
            )}

            {/* ── STEP 5: Bevestiging ── */}
            {currentStep === 5 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-light space-y-6">
                <h2 className="text-xl font-bold text-navy">Controleer je bestelling</h2>

                <div className="border border-grey-light rounded-xl bg-grey-light divide-y divide-grey-light">
                  <ReviewRow label="Abonnement" value={`${magazineName} — ${selectedPlan?.name}`} onClick={() => setCurrentStep(1)} />
                  <ReviewRow label="E-mail" value={email} onClick={() => setCurrentStep(2)} />
                  {billingAddress && (
                    <ReviewRow
                      label="Adres"
                      value={`${billingAddress.firstName} ${billingAddress.lastName}, ${billingAddress.street} ${billingAddress.houseNumber}, ${billingAddress.postalCode} ${billingAddress.city}`}
                      onClick={() => setCurrentStep(3)}
                    />
                  )}
                  <ReviewRow
                    label="Betaalmethode"
                    value={
                      (cmsPaymentOptions.find((o) => o.slug === paymentMethod)?.name) ||
                      (paymentMethod === 'ideal' ? 'iDEAL' : paymentMethod === 'creditcard' ? 'Creditcard' : paymentMethod === 'invoice' ? 'Op rekening' : paymentMethod)
                    }
                    onClick={() => setCurrentStep(4)}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: 'var(--color-error-dark)' }}>
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setCurrentStep(4)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder || isSubmitting}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    {isSubmitting ? 'Bezig...' : `Bestelling plaatsen — ${formatPrice(price)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar — matches CheckoutTemplate4 */}
          <div className="sub-sidebar">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowMobileSummary(!showMobileSummary)}
              className="sub-mobile-toggle"
            >
              <span>Besteloverzicht</span>
              {showMobileSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Sidebar content */}
            <div className={`sub-sidebar__content ${showMobileSummary ? 'sub-sidebar__content--open' : ''}`}>
              {/* Order items card */}
              <div className="sub-order-items">
                <h3 className="sub-order-items__title">Je bestelling</h3>
                <div className="sub-order-item">
                  <div className="sub-order-item__thumb">
                    <BookOpen size={20} />
                  </div>
                  <div className="sub-order-item__info">
                    <p className="sub-order-item__name">{magazineName} — {selectedPlan?.name}</p>
                    <p className="sub-order-item__qty">1x {formatPrice(price)}</p>
                  </div>
                  <span className="sub-order-item__total">{formatPrice(price)}</span>
                </div>
                <div className="sub-order-items__footer">
                  <button type="button" onClick={() => setCurrentStep(1)} className="sub-order-items__edit">
                    Abonnement wijzigen
                  </button>
                </div>
              </div>

              {/* Summary card with navy header — identical to CheckoutTemplate4 */}
              <div className="sub-summary-card">
                <div className="sub-summary-card__head">
                  <h3 className="sub-summary-card__title">Besteloverzicht</h3>
                </div>
                <div className="sub-summary-card__body">
                  <div className="sub-summary-row">
                    <span>Subtotaal</span>
                    <span className="sub-summary-value">{formatPrice(price)}</span>
                  </div>
                  <div className="sub-summary-row">
                    <span>Verzendkosten</span>
                    <span className="sub-summary-value sub-summary-value--green">Gratis</span>
                  </div>

                  <hr className="sub-summary-divider" />

                  <div className="sub-summary-total">
                    <span className="sub-summary-total__label">Totaal</span>
                    <span className="sub-summary-total__value">{formatPrice(price)}</span>
                  </div>

                  {selectedPlan?.priceSuffix && (
                    <div className="sub-summary-note">{selectedPlan.priceSuffix}</div>
                  )}

                  {/* CTA button in summary — Step 1 */}
                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={() => canProceedToContact && setCurrentStep(2)}
                      disabled={!canProceedToContact}
                      className="btn btn-primary btn-lg w-full mt-4"
                    >
                      Naar bestellen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sub-page {
          min-height: 100vh;
          background: var(--bg);
        }

        .sub-step-bar {
          background: var(--white);
          border-bottom: 1px solid var(--grey);
          padding: var(--sp-6) 0;
        }

        .sub-container {
          max-width: var(--container-width, 1536px);
          margin: 0 auto;
          padding: 0 var(--sp-6);
        }
        .sub-section {
          padding-top: var(--sp-8);
          padding-bottom: var(--sp-16);
        }

        /* Header — matches t4-header */
        .sub-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--sp-8);
        }
        .sub-header__title {
          font-family: var(--font-display);
          font-size: var(--text-hero);
          color: var(--navy);
          line-height: 1.1;
        }
        .sub-header__sub {
          font-size: var(--text-body);
          color: var(--grey-mid);
          margin-top: var(--sp-2);
        }
        .sub-header__links {
          display: flex;
          gap: var(--sp-4);
        }
        .sub-header__links :global(.sub-header__link) {
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
        .sub-header__links :global(.sub-header__link--ghost) {
          border: 1.5px solid var(--grey);
          color: var(--grey-dark);
        }
        .sub-header__links :global(.sub-header__link--ghost:hover) {
          border-color: var(--navy);
          color: var(--navy);
        }

        /* Layout — matches t4-layout */
        .sub-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--sp-8);
          align-items: start;
        }
        .sub-main {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }

        /* Plan grid */
        .sub-plan-grid {
          display: grid;
          gap: var(--sp-4);
        }
        .sub-plan-grid--2 { grid-template-columns: repeat(2, 1fr); }
        .sub-plan-grid--3 { grid-template-columns: repeat(3, 1fr); }
        .sub-plan-wrap {
          cursor: pointer;
          border-radius: 14px;
          border: 2px solid transparent;
          transition: all 0.15s;
        }
        .sub-plan-wrap--selected {
          border-color: var(--color-primary);
          background: var(--color-primary-glow);
        }

        /* Sidebar — matches t4-sidebar */
        .sub-sidebar {
          position: sticky;
          top: 90px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        .sub-mobile-toggle { display: none; }

        .sub-sidebar__content {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        /* Order items card — matches t4-order-items */
        .sub-order-items {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-6);
          box-shadow: var(--sh-sm);
        }
        .sub-order-items__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: var(--navy);
          margin-bottom: var(--sp-4);
        }
        .sub-order-item {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }
        .sub-order-item__thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--r-sm);
          background: var(--bg);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--grey-mid);
        }
        .sub-order-item__info {
          flex: 1;
          min-width: 0;
        }
        .sub-order-item__name {
          font-size: var(--text-small);
          font-weight: 600;
          color: var(--navy);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sub-order-item__qty {
          font-size: 12px;
          color: var(--grey-mid);
        }
        .sub-order-item__total {
          font-size: var(--text-small);
          font-weight: 700;
          color: var(--navy);
          flex-shrink: 0;
        }
        .sub-order-items__footer {
          margin-top: var(--sp-4);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--grey);
        }
        .sub-order-items__footer :global(.sub-order-items__edit) {
          font-size: var(--text-small);
          color: var(--color-primary);
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .sub-order-items__footer :global(.sub-order-items__edit:hover) {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        /* Summary card — matches t4-summary-card */
        .sub-summary-card {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          box-shadow: var(--sh-md);
          overflow: hidden;
        }
        .sub-summary-card__head {
          background: var(--navy);
          padding: var(--sp-4) var(--sp-6);
        }
        .sub-summary-card__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: white;
        }
        .sub-summary-card__body {
          padding: var(--sp-6);
        }

        .sub-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 14px;
          color: var(--grey-dark);
        }
        .sub-summary-value { font-weight: 600; color: var(--navy); }
        .sub-summary-value--green { color: var(--green); }
        .sub-summary-note { font-size: 12px; color: var(--grey-mid); text-align: right; }

        .sub-summary-divider {
          border: none;
          border-top: 1px solid var(--grey);
          margin: 8px 0;
        }

        .sub-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 14px 0 4px;
        }
        .sub-summary-total__label {
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
        }
        .sub-summary-total__value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--navy);
        }

        /* Responsive — matches t4 breakpoints */
        @media (max-width: 900px) {
          .sub-layout {
            grid-template-columns: 1fr;
          }
          .sub-sidebar {
            position: static;
          }
          .sub-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--sp-4);
          }
          .sub-header__title {
            font-size: var(--text-section);
          }
          .sub-mobile-toggle {
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
          .sub-sidebar__content {
            display: none;
          }
          .sub-sidebar__content--open {
            display: flex;
          }
          .sub-plan-grid--2,
          .sub-plan-grid--3 {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .sub-plan-grid--2,
          .sub-plan-grid--3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

// ── Review row with edit link ──
function ReviewRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-grey-mid">{label}</div>
        <div className="text-sm text-navy">{value}</div>
      </div>
      <button type="button" onClick={onClick} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>
        Wijzig
      </button>
    </div>
  )
}
