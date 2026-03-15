'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Headphones } from 'lucide-react'
import { Tag, CreditCard, ClipboardList, Users } from 'lucide-react'
import type {
  Step,
  Benefit,
  TrustItem,
} from '@/branches/ecommerce/b2b/components/registration'

const ProgressStepper = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.ProgressStepper })),
  { ssr: false }
)
const BenefitsList = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.BenefitsList })),
  { ssr: false }
)
const TrustList = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.TrustList })),
  { ssr: false }
)
const HelpCTA = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.HelpCTA })),
  { ssr: false }
)
import { resolveIcon } from '@/branches/shared/components/catalog/branches/iconMap'
import { useAuth } from '@/providers/Auth'
import { StepAccountType } from './StepAccountType'
import { StepCompanyDetails } from './StepCompanyDetails'
import { StepContactPassword } from './StepContactPassword'
import { StepVerification } from './StepVerification'
import type { RegisterTemplate1Props, RegistrationData } from './types'

const B2B_STEPS: Step[] = [
  { label: 'Account type', description: 'B2B of B2C' },
  { label: 'Bedrijfsgegevens', description: 'KVK & BTW' },
  { label: 'Contact & wachtwoord', description: 'Inloggegevens' },
  { label: 'Verificatie', description: 'E-mail bevestigen' },
]

const B2C_STEPS: Step[] = [
  { label: 'Account type', description: 'B2B of B2C' },
  { label: 'Contact & wachtwoord', description: 'Inloggegevens' },
  { label: 'Verificatie', description: 'E-mail bevestigen' },
]

const DEFAULT_BENEFITS: Benefit[] = [
  {
    icon: Tag,
    iconColor: 'var(--color-teal)',
    iconBg: 'var(--color-primary-glow)',
    title: 'Exclusieve B2B prijzen',
    description: 'Scherpe prijzen voor zakelijke klanten',
  },
  {
    icon: CreditCard,
    iconColor: 'var(--color-blue)',
    iconBg: 'var(--color-blue-light)',
    title: 'Betaal achteraf',
    description: '14 of 30 dagen betaaltermijn op factuur',
  },
  {
    icon: ClipboardList,
    iconColor: 'var(--color-green)',
    iconBg: 'var(--color-green-light)',
    title: 'Bestellijsten & snel bestellen',
    description: 'Sla vaste bestellingen op en bestel met een klik',
  },
  {
    icon: Users,
    iconColor: 'var(--color-amber)',
    iconBg: 'var(--color-amber-light)',
    title: 'Meerdere gebruikers',
    description: 'Voeg collega\'s toe met eigen inlog en rechten',
  },
  {
    icon: Headphones,
    iconColor: 'var(--color-coral)',
    iconBg: 'var(--color-coral-light)',
    title: 'Persoonlijke accountmanager',
    description: 'Direct contact voor advies en offertes',
  },
]

const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  { text: 'Gratis verzending vanaf €150' },
  { text: 'Veilig bestellen' },
  { text: 'AVG / GDPR compliant' },
]

const initialData: RegistrationData = {
  accountType: null,
  kvkNumber: '',
  companyName: '',
  vatNumber: '',
  street: '',
  postalCity: '',
  country: 'NL',
  companyPhone: '',
  branch: null,
  referralSource: '',
  separateBillingAddress: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  acceptTerms: false,
  verificationSent: false,
}

export default function RegisterTemplate1({
  defaultStep = 0,
  siteConfig,
  benefits: cmsBenefits,
  trustItems: cmsTrustItems,
  branches,
  freeShippingThreshold,
}: RegisterTemplate1Props) {
  const { user, status } = useAuth()
  const router = useRouter()

  // Redirect to /account/ if already logged in
  useEffect(() => {
    if (status === 'loggedIn' && user) {
      router.replace('/account/')
    }
  }, [status, user, router])

  const [currentStep, setCurrentStep] = useState(defaultStep)
  const [data, setData] = useState<RegistrationData>(initialData)

  // Resolve CMS benefits (string icon names) to Benefit objects with LucideIcon
  const benefits: Benefit[] = useMemo(() => {
    if (!cmsBenefits) return DEFAULT_BENEFITS
    return cmsBenefits.map((b) => ({
      icon: resolveIcon(b.icon) || Tag,
      iconColor: b.iconColor,
      iconBg: b.iconBg,
      title: b.title,
      description: b.description,
    }))
  }, [cmsBenefits])

  const trustItems: TrustItem[] = useMemo(() => {
    if (!cmsTrustItems) return DEFAULT_TRUST_ITEMS
    return cmsTrustItems
  }, [cmsTrustItems])

  // Determine steps based on account type (B2C skips company details)
  const isB2C = data.accountType === 'b2c'
  const steps = isB2C ? B2C_STEPS : B2B_STEPS

  // Map logical step index to actual step for B2C flow
  const getActualStep = useCallback((step: number) => {
    if (!isB2C) return step
    // B2C: step 0 = account type, step 1 = contact (skip company), step 2 = verification
    if (step >= 1) return step + 1
    return step
  }, [isB2C])

  const updateData = useCallback((updates: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleSubmit = async () => {
    // TODO: Submit registration data to API
    console.log('Submit registration:', data)
    updateData({ verificationSent: true })
    goNext()
  }

  // Map current step index to the actual rendered component
  const actualStep = getActualStep(currentStep)
  const isLastVisibleStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Progress stepper */}
      <ProgressStepper steps={steps} currentStep={currentStep} />

      {/* Main layout */}
      <div className="mx-auto grid max-w-[1240px] items-start gap-8 px-6 py-10 lg:grid-cols-[1fr_380px]">
        {/* Form column */}
        <div>
          {actualStep === 0 && (
            <StepAccountType
              selected={data.accountType}
              onSelect={(type) => updateData({ accountType: type })}
              onNext={goNext}
            />
          )}

          {actualStep === 1 && (
            <StepCompanyDetails
              data={data}
              onChange={updateData}
              onBack={goBack}
              onNext={goNext}
              branches={branches}
            />
          )}

          {actualStep === 2 && (
            <StepContactPassword
              data={data}
              onChange={updateData}
              onBack={goBack}
              onNext={handleSubmit}
            />
          )}

          {actualStep === 3 && (
            <StepVerification email={data.email} />
          )}
        </div>

        {/* Sidebar */}
        {!isLastVisibleStep && (
          <aside className="flex flex-col gap-4 lg:order-none -order-1">
            <BenefitsList benefits={benefits} />
            <TrustList items={trustItems} />
            <HelpCTA
              phone={siteConfig?.phone || ''}
              phoneLabel={siteConfig?.phoneFormatted || siteConfig?.phone || ''}
            />
          </aside>
        )}
      </div>
    </div>
  )
}
