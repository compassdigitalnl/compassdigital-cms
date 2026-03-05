'use client'

import { useState, useCallback } from 'react'
import { Headphones } from 'lucide-react'
import { Tag, CreditCard, ClipboardList, Users } from 'lucide-react'
import {
  ProgressStepper,
  BenefitsList,
  TrustList,
  HelpCTA,
  type Step,
  type Benefit,
  type TrustItem,
} from '@/branches/ecommerce/components/registration'
import { StepAccountType } from './StepAccountType'
import { StepCompanyDetails } from './StepCompanyDetails'
import { StepContactPassword } from './StepContactPassword'
import { StepVerification } from './StepVerification'
import type { RegisterTemplate1Props, RegistrationData } from './types'

const steps: Step[] = [
  { label: 'Account type', description: 'B2B of B2C' },
  { label: 'Bedrijfsgegevens', description: 'KVK & BTW' },
  { label: 'Contact & wachtwoord', description: 'Inloggegevens' },
  { label: 'Verificatie', description: 'E-mail bevestigen' },
]

const benefits: Benefit[] = [
  {
    icon: Tag,
    iconColor: 'var(--color-teal, #00897B)',
    iconBg: 'rgba(0,137,123,0.12)',
    title: 'Exclusieve B2B prijzen',
    description: 'Gemiddeld 15-25% voordeliger dan onze adviesprijzen',
  },
  {
    icon: CreditCard,
    iconColor: 'var(--color-blue, #2196F3)',
    iconBg: 'var(--color-blue-light, #E3F2FD)',
    title: 'Betaal achteraf',
    description: '14 of 30 dagen betaaltermijn op factuur',
  },
  {
    icon: ClipboardList,
    iconColor: 'var(--color-green, #00C853)',
    iconBg: 'var(--color-green-light, #E8F5E9)',
    title: 'Bestellijsten & snel bestellen',
    description: 'Sla vaste bestellingen op en bestel met een klik',
  },
  {
    icon: Users,
    iconColor: 'var(--color-amber, #F59E0B)',
    iconBg: 'var(--color-amber-light, #FFF8E1)',
    title: 'Meerdere gebruikers',
    description: 'Voeg collega\'s toe met eigen inlog en rechten',
  },
  {
    icon: Headphones,
    iconColor: 'var(--color-coral, #FF6B6B)',
    iconBg: 'var(--color-coral-light, #FFF0F0)',
    title: 'Persoonlijke accountmanager',
    description: 'Direct contact voor advies en offertes',
  },
]

const trustItems: TrustItem[] = [
  { text: '30+ jaar ervaring in medische supplies' },
  { text: '4.000+ professionele producten' },
  { text: 'Gratis verzending vanaf \u20AC150' },
  { text: 'ISO-gecertificeerd en CE-gemarkeerd' },
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

export default function RegisterTemplate1({ defaultStep = 0 }: RegisterTemplate1Props) {
  const [currentStep, setCurrentStep] = useState(defaultStep)
  const [data, setData] = useState<RegistrationData>(initialData)

  const updateData = useCallback((updates: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleSubmit = async () => {
    // TODO: Submit registration data to API
    console.log('Submit registration:', data)
    updateData({ verificationSent: true })
    goNext()
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg, #F5F7FA)' }}>
      {/* Minimal header */}
      <header
        className="border-b bg-white py-5"
        style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6">
          <a href="/" className="flex items-center">
            <span className="font-heading text-xl font-extrabold text-theme-navy">
              plasti<em className="not-italic text-theme-teal-light">med</em>
            </span>
          </a>
          <a
            href="tel:0251247233"
            className="flex items-center gap-1.5 text-sm text-theme-grey-dark no-underline hover:text-theme-teal"
          >
            <Headphones className="h-4 w-4 text-theme-teal" />
            Hulp nodig? 0251&#8209;247233
          </a>
        </div>
      </header>

      {/* Progress stepper */}
      <ProgressStepper steps={steps} currentStep={currentStep} />

      {/* Main layout */}
      <div className="mx-auto grid max-w-[1240px] items-start gap-8 px-6 py-10 lg:grid-cols-[1fr_380px]">
        {/* Form column */}
        <div>
          {currentStep === 0 && (
            <StepAccountType
              selected={data.accountType}
              onSelect={(type) => updateData({ accountType: type })}
              onNext={goNext}
            />
          )}

          {currentStep === 1 && (
            <StepCompanyDetails
              data={data}
              onChange={updateData}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStep === 2 && (
            <StepContactPassword
              data={data}
              onChange={updateData}
              onBack={goBack}
              onNext={handleSubmit}
            />
          )}

          {currentStep === 3 && (
            <StepVerification email={data.email} />
          )}
        </div>

        {/* Sidebar */}
        {currentStep < 3 && (
          <aside className="flex flex-col gap-4 lg:order-none -order-1">
            <BenefitsList benefits={benefits} />
            <TrustList items={trustItems} />
            <HelpCTA />
          </aside>
        )}
      </div>
    </div>
  )
}
