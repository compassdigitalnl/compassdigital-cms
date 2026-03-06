'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Loader2,
  User, MapPin, Banknote, FileText,
} from 'lucide-react'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { CheckoutSteps } from '@/branches/shared/components/ui/checkout/CheckoutSteps'
import { PricingPlanCard } from '@/branches/shared/components/ui/pricing/PricingPlanCard'
import { TrustList } from '@/branches/shared/components/ui/checkout/TrustList'
import { TrustBanner } from '@/branches/shared/components/ui/checkout/TrustBanner'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { TrustItem } from '@/branches/shared/components/ui/checkout/TrustList/types'
import type { CheckoutStep } from '@/branches/shared/components/ui/checkout/CheckoutSteps/types'

interface SubscriptionCheckoutClientProps {
  magazineName: string
  magazineSlug: string
  plans: PricingPlan[]
  selectedPlanId?: number | string
  trustItems?: TrustItem[]
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

export default function SubscriptionCheckoutClient({
  magazineName,
  magazineSlug,
  plans,
  selectedPlanId: initialPlanId,
  trustItems = [],
}: SubscriptionCheckoutClientProps) {
  const router = useRouter()

  // Step management: 1=Plan, 2=Gegevens, 3=Betaling, 4=Bevestiging
  const [currentStep, setCurrentStep] = useState(1)

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

  const selectedPlan = plans.find((p) => p.id === selectedId) || plans[0]
  const priceFormatted = selectedPlan?.price != null
    ? `€${selectedPlan.price.toFixed(2).replace('.', ',')}`
    : '—'

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

  // Step labels for stepper
  const steps: CheckoutStep[] = [
    { label: 'Plan kiezen', status: currentStep > 1 ? 'done' : currentStep === 1 ? 'active' : 'pending' },
    { label: 'Gegevens', status: currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'pending' },
    { label: 'Betaling', status: currentStep > 3 ? 'done' : currentStep === 3 ? 'active' : 'pending' },
    { label: 'Bevestiging', status: currentStep === 4 ? 'active' : 'pending' },
  ]

  const defaultTrustItems: TrustItem[] = trustItems.length > 0 ? trustItems : [
    { icon: 'Zap', text: 'Direct actief na betaling' },
    { icon: 'RotateCcw', text: '30 dagen geld-terug-garantie' },
    { icon: 'ShieldCheck', text: 'Veilig betalen' },
    { icon: 'Lock', text: 'Beveiligde verbinding (SSL)' },
  ]

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
      <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
        <div className="mx-auto px-6 py-16" style={{ maxWidth: 'var(--container-width, 800px)' }}>
          <div className="rounded-[20px] border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-10 text-center shadow-[var(--shadow-lg,0_16px_48px_rgba(10,22,40,0.12))]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'var(--color-success-light, #E8F5E9)' }}>
              <CheckCircle className="h-8 w-8 text-[var(--color-success,#00C853)]" />
            </div>
            <h1 className="mb-2 font-heading text-[28px] font-extrabold text-[var(--color-text-primary)]">Bestelling geplaatst!</h1>
            <p className="mb-1 text-base text-[var(--color-text-secondary)]">
              Je abonnement op <strong>{magazineName}</strong> — {selectedPlan?.name} is ontvangen.
            </p>
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">Bestelnummer: <strong>{orderNumber}</strong></p>

            <div className="mb-6 rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-background,#F5F7FA)] px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">{magazineName} — {selectedPlan?.name}</span>
                <span className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">{priceFormatted}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={`/magazines/${magazineSlug}`} className="inline-flex items-center gap-2 rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-6 py-3 font-heading text-sm font-extrabold text-white no-underline shadow-[0_4px_12px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90">
                Terug naar {magazineName} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/magazines" className="inline-flex items-center gap-2 rounded-[var(--border-radius,12px)] border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-6 py-3 font-heading text-sm font-extrabold text-[var(--color-text-primary)] no-underline transition-all duration-200 hover:border-[var(--color-primary)]">
                Alle magazines
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Multi-step Checkout ──
  return (
    <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1200px)' }}>
        <Breadcrumbs
          items={[
            { label: 'Magazines', href: '/magazines' },
            { label: magazineName, href: `/magazines/${magazineSlug}` },
          ]}
          currentPage="Afrekenen"
        />

        {/* Secure header */}
        <div className="flex items-center justify-end py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success,#00C853)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Beveiligde checkout
          </div>
        </div>

        {/* Stepper */}
        <CheckoutSteps steps={steps} />

        {/* 2-column layout */}
        <div className="grid grid-cols-1 items-start gap-7 pb-12 lg:grid-cols-[1fr_380px]">
          {/* ═══ LEFT COLUMN: Steps ═══ */}
          <div className="flex flex-col gap-4">

            {/* ── STEP 1: Plan kiezen ── */}
            {currentStep === 1 && (
              <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
                  <CreditCard className="h-5 w-5 text-[var(--color-primary)]" />
                  Kies je abonnement
                </h2>
                <div className={`grid gap-3.5 ${plans.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`cursor-pointer rounded-[14px] border-2 transition-all duration-150 ${selectedId === plan.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]' : 'border-transparent'}`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <PricingPlanCard
                        plan={{ ...plan, href: undefined, buttonLabel: selectedId === plan.id ? 'Geselecteerd' : plan.buttonLabel, buttonVariant: selectedId === plan.id ? 'fill' : 'outline' }}
                        onSelect={handleSelectPlan}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => canProceedFromStep1 && setCurrentStep(2)}
                    disabled={!canProceedFromStep1}
                    className="inline-flex items-center gap-2 rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-7 py-3.5 font-heading text-sm font-extrabold text-white shadow-[0_4px_12px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                  >
                    Ga door naar gegevens <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Gegevens ── */}
            {currentStep === 2 && (
              <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
                  <User className="h-5 w-5 text-[var(--color-primary)]" />
                  Je gegevens
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField label="Voornaam" value={info.firstName} onChange={(v) => updateInfo('firstName', v)} required />
                  <InputField label="Achternaam" value={info.lastName} onChange={(v) => updateInfo('lastName', v)} required />
                  <InputField label="E-mailadres" value={info.email} onChange={(v) => updateInfo('email', v)} type="email" required className="sm:col-span-2" />
                  <InputField label="Telefoon" value={info.phone} onChange={(v) => updateInfo('phone', v)} type="tel" />
                </div>

                <h3 className="mb-3 mt-6 flex items-center gap-2 font-heading text-base font-extrabold text-[var(--color-text-primary)]">
                  <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                  Bezorgadres
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField label="Straat" value={info.street} onChange={(v) => updateInfo('street', v)} required />
                  <InputField label="Huisnummer" value={info.houseNumber} onChange={(v) => updateInfo('houseNumber', v)} required />
                  <InputField label="Postcode" value={info.postalCode} onChange={(v) => updateInfo('postalCode', v)} required />
                  <InputField label="Plaats" value={info.city} onChange={(v) => updateInfo('city', v)} required />
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setCurrentStep(1)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-5 py-3 font-heading text-sm font-extrabold text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Vorige stap
                  </button>
                  <button type="button" onClick={() => canProceedFromStep2 && setCurrentStep(3)} disabled={!canProceedFromStep2} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-5 py-3 font-heading text-sm font-extrabold text-white shadow-[0_4px_12px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90 disabled:opacity-50">
                    Ga door naar betaling <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Betaling ── */}
            {currentStep === 3 && (
              <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
                  <Banknote className="h-5 w-5 text-[var(--color-primary)]" />
                  Betaalmethode
                </h2>

                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-150 ${
                        paymentMethod === method.id
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]'
                          : 'border-[var(--color-border,#E8ECF1)] hover:border-[var(--color-primary)]'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-heading text-sm font-extrabold text-[var(--color-text-primary)]">{method.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{method.description}</div>
                      </div>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === method.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border,#E8ECF1)]'}`}>
                        {paymentMethod === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setCurrentStep(2)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-5 py-3 font-heading text-sm font-extrabold text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Vorige stap
                  </button>
                  <button type="button" onClick={() => canProceedFromStep3 && setCurrentStep(4)} disabled={!canProceedFromStep3} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-5 py-3 font-heading text-sm font-extrabold text-white shadow-[0_4px_12px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90 disabled:opacity-50">
                    Ga door naar bevestiging <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Bevestiging ── */}
            {currentStep === 4 && (
              <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
                  <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                  Controleer je bestelling
                </h2>

                {/* Summary rows */}
                <div className="mb-4 divide-y divide-[var(--color-border,#E8ECF1)] rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-background,#F5F7FA)]">
                  <SummaryRow label="Abonnement" value={`${magazineName} — ${selectedPlan?.name}`} onClick={() => setCurrentStep(1)} />
                  <SummaryRow label="Naam" value={`${info.firstName} ${info.lastName}`} onClick={() => setCurrentStep(2)} />
                  <SummaryRow label="E-mail" value={info.email} onClick={() => setCurrentStep(2)} />
                  <SummaryRow label="Adres" value={`${info.street} ${info.houseNumber}, ${info.postalCode} ${info.city}`} onClick={() => setCurrentStep(2)} />
                  <SummaryRow label="Betaalmethode" value={PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name || paymentMethod} onClick={() => setCurrentStep(3)} />
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-[var(--color-error-light,#FFEBEE)] px-4 py-3 text-sm text-[var(--color-error,#D32F2F)]">{error}</div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setCurrentStep(3)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-5 py-3 font-heading text-sm font-extrabold text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Vorige stap
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder || isSubmitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--border-radius,12px)] px-5 py-3.5 font-heading text-sm font-extrabold text-white shadow-[0_4px_16px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #00695C))' }}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Bezig met verwerken...</>
                    ) : (
                      <><CheckCircle className="h-4 w-4" /> Bestelling plaatsen — {priceFormatted}</>
                    )}
                  </button>
                </div>

                <div className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
                  Door te bestellen ga je akkoord met de voorwaarden.
                </div>
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN: Sidebar ═══ */}
          <aside>
            <div className="overflow-hidden rounded-[18px] border-[1.5px] border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] shadow-[var(--shadow-md,0_8px_24px_rgba(10,22,40,0.08))] lg:sticky lg:top-[88px]">
              {/* Header */}
              <div className="px-[22px] py-5" style={{ background: 'linear-gradient(135deg, var(--color-text-primary, #0A1628), var(--color-text-primary, #121F33))' }}>
                <div className="flex items-center gap-1.5 font-heading text-base font-extrabold text-white">
                  <CreditCard className="h-4 w-4 text-[var(--color-primary-light)]" />
                  Besteloverzicht
                </div>
                <div className="text-xs text-white/40">{magazineName} abonnement</div>
              </div>

              <div className="px-[22px] py-5">
                <div className="mb-3.5 border-b border-[var(--color-border,#E8ECF1)] pb-3.5">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Abonnement</div>
                  <div className="flex justify-between py-1 text-sm text-[var(--color-text-primary)]">
                    <span>{magazineName} — {selectedPlan?.name}</span>
                    <span className="font-bold">{priceFormatted}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t-2 border-[var(--color-text-primary,#0A1628)] pt-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Totaal</div>
                    <div className="font-heading text-xl font-extrabold text-[var(--color-text-primary)]">{priceFormatted}</div>
                  </div>
                  {selectedPlan?.priceSuffix && <div className="text-right text-xs text-[var(--color-text-muted)]">{selectedPlan.priceSuffix}</div>}
                </div>

                {defaultTrustItems.length > 0 && <TrustList items={defaultTrustItems} className="mt-4" />}
                <TrustBanner title="30 dagen geld-terug-garantie" description="Niet tevreden? Je krijgt het volledige bedrag terug, geen vragen." className="mt-3.5" />
              </div>
            </div>
          </aside>
        </div>
      </div>
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
      <label className="mb-1 block text-xs font-bold text-[var(--color-text-secondary)]">
        {label} {required && <span className="text-[var(--color-error,#D32F2F)]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 w-full rounded-[var(--border-radius,10px)] border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-3.5 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-150 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-glow)]"
      />
    </div>
  )
}

// ── Summary row with edit link ──
function SummaryRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</div>
        <div className="text-sm text-[var(--color-text-primary)]">{value}</div>
      </div>
      <button type="button" onClick={onClick} className="text-xs font-bold text-[var(--color-primary)] hover:underline">Wijzig</button>
    </div>
  )
}
