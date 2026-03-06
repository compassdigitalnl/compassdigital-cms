'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CreditCard, CheckCircle, Loader2,
  User, MapPin, Banknote, FileText, ChevronDown, ChevronUp,
  BookOpen, ArrowRight,
} from 'lucide-react'
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { PricingPlanCard } from '@/branches/shared/components/ui/pricing/PricingPlanCard'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'

interface SubscriptionCheckoutClientProps {
  magazineName: string
  magazineSlug: string
  plans: PricingPlan[]
  selectedPlanId?: number | string
}

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

const EMPTY_INFO: PersonalInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', houseNumber: '', postalCode: '', city: '',
}

const PAYMENT_METHODS = [
  { id: 'ideal', name: 'iDEAL', description: 'Betaal direct via je bank', icon: '🏦' },
  { id: 'creditcard', name: 'Creditcard', description: 'Visa, Mastercard, Amex', icon: '💳' },
  { id: 'banktransfer', name: 'Bankoverschrijving', description: 'Betaal binnen 14 dagen', icon: '📄' },
]

const SUB_STEPS = [
  { id: 1, label: 'Abonnement' },
  { id: 2, label: 'Gegevens' },
  { id: 3, label: 'Betaling' },
  { id: 4, label: 'Bevestiging' },
]

export default function SubscriptionCheckoutClient({
  magazineName,
  magazineSlug,
  plans,
  selectedPlanId: initialPlanId,
}: SubscriptionCheckoutClientProps) {
  const router = useRouter()

  // Step management: 1=Plan, 2=Gegevens, 3=Betaling, 4=Bevestiging
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Plan
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    initialPlanId || plans.find((p) => p.highlighted)?.id || plans[0]?.id,
  )

  // Step 2: Personal info
  const [info, setInfo] = useState<PersonalInfo>(EMPTY_INFO)

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('')

  // Step 4: Confirm
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
  const isInfoComplete = !!(
    info.firstName.trim() && info.lastName.trim() &&
    info.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email) &&
    info.street.trim() && info.houseNumber.trim() &&
    info.postalCode.trim() && info.city.trim()
  )

  const canProceedFromStep1 = !!selectedId
  const canProceedFromStep2 = isInfoComplete
  const canProceedFromStep3 = !!paymentMethod
  const canPlaceOrder = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedId(plan.id)
    setError(null)
  }

  const updateInfo = (field: keyof PersonalInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }))
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
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            phone: info.phone,
          },
          address: {
            street: info.street,
            houseNumber: info.houseNumber,
            postalCode: info.postalCode,
            city: info.city,
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

  // ── Order Confirmed ──
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
            if (stepId < currentStep) setCurrentStep(stepId as 1 | 2 | 3 | 4)
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
              <div className="sub-card">
                <h2 className="sub-card__title">
                  <BookOpen size={20} />
                  Kies je abonnement
                </h2>
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

                <div className="sub-nav sub-nav--end">
                  <button
                    type="button"
                    onClick={() => canProceedFromStep1 && setCurrentStep(2)}
                    disabled={!canProceedFromStep1}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    Ga door naar gegevens
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Gegevens ── */}
            {currentStep === 2 && (
              <div className="sub-card">
                <h2 className="sub-card__title">
                  <User size={20} />
                  Je gegevens
                </h2>

                <div className="sub-form-grid">
                  <InputField label="Voornaam" value={info.firstName} onChange={(v) => updateInfo('firstName', v)} required />
                  <InputField label="Achternaam" value={info.lastName} onChange={(v) => updateInfo('lastName', v)} required />
                  <InputField label="E-mailadres" value={info.email} onChange={(v) => updateInfo('email', v)} type="email" required className="sub-col-span-2" />
                  <InputField label="Telefoon" value={info.phone} onChange={(v) => updateInfo('phone', v)} type="tel" />
                </div>

                <h3 className="sub-card__subtitle">
                  <MapPin size={16} />
                  Bezorgadres
                </h3>

                <div className="sub-form-grid">
                  <InputField label="Straat" value={info.street} onChange={(v) => updateInfo('street', v)} required />
                  <InputField label="Huisnummer" value={info.houseNumber} onChange={(v) => updateInfo('houseNumber', v)} required />
                  <InputField label="Postcode" value={info.postalCode} onChange={(v) => updateInfo('postalCode', v)} required />
                  <InputField label="Plaats" value={info.city} onChange={(v) => updateInfo('city', v)} required />
                </div>

                <div className="sub-nav">
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button type="button" onClick={() => canProceedFromStep2 && setCurrentStep(3)} disabled={!canProceedFromStep2} className="btn btn-primary btn-lg flex-1">
                    Ga door naar betaling
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Betaling ── */}
            {currentStep === 3 && (
              <div className="sub-card">
                <h2 className="sub-card__title">
                  <Banknote size={20} />
                  Betaalmethode
                </h2>

                <div className="sub-payment-list">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`sub-payment-card ${paymentMethod === method.id ? 'sub-payment-card--selected' : ''}`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                      <span className="sub-payment-icon">{method.icon}</span>
                      <div className="sub-payment-info">
                        <div className="sub-payment-name">{method.name}</div>
                        <div className="sub-payment-desc">{method.description}</div>
                      </div>
                      <div className={`sub-radio ${paymentMethod === method.id ? 'sub-radio--checked' : ''}`}>
                        {paymentMethod === method.id && <div className="sub-radio__dot" />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="sub-nav">
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button type="button" onClick={() => canProceedFromStep3 && setCurrentStep(4)} disabled={!canProceedFromStep3} className="btn btn-primary btn-lg flex-1">
                    Ga door naar bevestiging
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Bevestiging ── */}
            {currentStep === 4 && (
              <div className="sub-card">
                <h2 className="sub-card__title">
                  <FileText size={20} />
                  Controleer je bestelling
                </h2>

                <div className="sub-review">
                  <ReviewRow label="Abonnement" value={`${magazineName} — ${selectedPlan?.name}`} onClick={() => setCurrentStep(1)} />
                  <ReviewRow label="Naam" value={`${info.firstName} ${info.lastName}`} onClick={() => setCurrentStep(2)} />
                  <ReviewRow label="E-mail" value={info.email} onClick={() => setCurrentStep(2)} />
                  <ReviewRow label="Adres" value={`${info.street} ${info.houseNumber}, ${info.postalCode} ${info.city}`} onClick={() => setCurrentStep(2)} />
                  <ReviewRow label="Betaalmethode" value={PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name || paymentMethod} onClick={() => setCurrentStep(3)} />
                </div>

                {error && (
                  <div className="sub-error">{error}</div>
                )}

                <div className="sub-nav">
                  <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-outline-primary flex-1">
                    Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder || isSubmitting}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Bezig met verwerken...</>
                    ) : (
                      <>Bestelling plaatsen — {formatPrice(price)}</>
                    )}
                  </button>
                </div>

                <p className="sub-disclaimer">
                  Door te bestellen ga je akkoord met de voorwaarden.
                </p>
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
              {/* Summary card with navy header — identical to CheckoutTemplate4 */}
              <div className="sub-summary-card">
                <div className="sub-summary-card__head">
                  <h3 className="sub-summary-card__title">Besteloverzicht</h3>
                </div>
                <div className="sub-summary-card__body">
                  {/* Order line */}
                  <div className="sub-summary-row">
                    <span className="sub-summary-label">{magazineName} — {selectedPlan?.name}</span>
                    <span className="sub-summary-value">{formatPrice(price)}</span>
                  </div>

                  {selectedPlan?.priceSuffix && (
                    <div className="sub-summary-note">{selectedPlan.priceSuffix}</div>
                  )}

                  {/* Divider */}
                  <hr className="sub-summary-divider" />

                  {/* Total */}
                  <div className="sub-summary-total">
                    <span className="sub-summary-total__label">Totaal</span>
                    <span className="sub-summary-total__value">{formatPrice(price)}</span>
                  </div>

                  {/* Trust signals */}
                  <div className="sub-trust-list">
                    <div className="sub-trust-item"><CheckCircle size={14} /> Direct actief na betaling</div>
                    <div className="sub-trust-item"><CheckCircle size={14} /> 30 dagen geld-terug-garantie</div>
                    <div className="sub-trust-item"><CheckCircle size={14} /> Veilig betalen</div>
                    <div className="sub-trust-item"><CheckCircle size={14} /> Beveiligde verbinding (SSL)</div>
                  </div>
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

        /* Step bar — identical to t4-step-bar */
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

        /* Cards */
        .sub-card {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-6);
          box-shadow: var(--sh-sm);
        }
        .sub-card__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title, 18px);
          font-weight: 800;
          color: var(--navy);
          margin-bottom: var(--sp-4);
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .sub-card__title :global(svg) {
          color: var(--color-primary);
        }
        .sub-card__subtitle {
          font-family: var(--font-display);
          font-size: var(--text-body-lg, 16px);
          font-weight: 800;
          color: var(--navy);
          margin: var(--sp-6) 0 var(--sp-3);
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .sub-card__subtitle :global(svg) {
          color: var(--color-primary);
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

        /* Form grid */
        .sub-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-4);
        }
        .sub-form-grid :global(.sub-col-span-2) {
          grid-column: span 2;
        }

        /* Payment cards */
        .sub-payment-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
        .sub-payment-card {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-4);
          border-radius: var(--r-lg);
          border: 2px solid var(--grey);
          cursor: pointer;
          transition: all 0.15s;
        }
        .sub-payment-card:hover {
          border-color: var(--color-primary);
        }
        .sub-payment-card--selected {
          border-color: var(--color-primary);
          background: var(--color-primary-glow);
        }
        .sub-payment-icon { font-size: 24px; }
        .sub-payment-info { flex: 1; }
        .sub-payment-name { font-size: var(--text-small); font-weight: 700; color: var(--navy); }
        .sub-payment-desc { font-size: 12px; color: var(--grey-mid); }
        .sub-radio {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid var(--grey);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sub-radio--checked {
          border-color: var(--color-primary);
          background: var(--color-primary);
        }
        .sub-radio__dot { width: 8px; height: 8px; border-radius: 50%; background: white; }

        /* Review */
        .sub-review {
          border: 1px solid var(--grey);
          border-radius: var(--r-lg);
          background: var(--bg);
          margin-bottom: var(--sp-4);
          overflow: hidden;
        }

        /* Error */
        .sub-error {
          background: var(--color-error-light, #FFEBEE);
          color: var(--color-error, #D32F2F);
          padding: var(--sp-3) var(--sp-4);
          border-radius: var(--r-md, 8px);
          font-size: var(--text-small);
          margin-bottom: var(--sp-4);
        }

        /* Navigation */
        .sub-nav {
          display: flex;
          gap: var(--sp-4);
          margin-top: var(--sp-6);
        }
        .sub-nav--end { justify-content: flex-end; }

        .sub-disclaimer {
          text-align: center;
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: var(--sp-2);
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
          padding: var(--sp-2) 0;
          font-size: 14px;
        }
        .sub-summary-label { color: var(--grey-dark); }
        .sub-summary-value { font-weight: 600; color: var(--navy); }
        .sub-summary-note { font-size: 12px; color: var(--grey-mid); text-align: right; }

        .sub-summary-divider {
          border: none;
          border-top: 1px solid var(--grey);
          margin: var(--sp-3) 0;
        }

        .sub-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: var(--sp-3) 0;
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

        .sub-trust-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
          margin-top: var(--sp-4);
          padding-top: var(--sp-4);
          border-top: 1px solid var(--grey);
        }
        .sub-trust-item {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          font-size: 12px;
          font-weight: 600;
          color: var(--green);
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
          .sub-form-grid {
            grid-template-columns: 1fr;
          }
          .sub-form-grid :global(.sub-col-span-2) {
            grid-column: span 1;
          }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .sub-plan-grid--2,
          .sub-plan-grid--3 {
            grid-template-columns: repeat(2, 1fr);
          }
          .sub-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// ── Reusable form input ──
function InputField({
  label, value, onChange, type = 'text', required = false, className = '',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; className?: string
}) {
  return (
    <div className={className}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 700, color: 'var(--grey-dark)' }}>
        {label} {required && <span style={{ color: 'var(--color-error, #D32F2F)' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 'var(--r-sm, 8px)',
          border: '1px solid var(--grey)',
          background: 'var(--white)',
          padding: '0 14px',
          fontSize: 14,
          color: 'var(--navy)',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--grey)' }}
      />
    </div>
  )
}

// ── Review row with edit link ──
function ReviewRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--sp-3, 12px) var(--sp-4, 16px)',
      borderBottom: '1px solid var(--grey)',
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--grey-mid)' }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--navy)' }}>{value}</div>
      </div>
      <button type="button" onClick={onClick} style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
        Wijzig
      </button>
    </div>
  )
}
