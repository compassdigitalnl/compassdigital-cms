'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/branches/shared/components/ui/card'
import { Button } from '@/branches/shared/components/ui/button'
import { Badge } from '@/branches/shared/components/ui/badge'
import { Check } from 'lucide-react'
import type { WizardState, SiteGoal } from '@/lib/siteGenerator/types'

// Wizard stap components
import { WizardStep1Company } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep1Company'
import { WizardStep2Goal } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep2Goal'
import { WizardStep3Content } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep3Content'
import { WizardStep2Design } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep2Design'
import { WizardStepServices } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepServices'
import { WizardStepTestimonials } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepTestimonials'
import { WizardStepPortfolio } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepPortfolio'
import { WizardStepPricing } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepPricing'
import { WizardStepContact } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepContact'
import { WizardStep4Features } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep4Features'
import { WizardStepEcommerce } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepEcommerce'
import { WizardStepProductImport } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStepProductImport'
import { WizardStep5Generate } from '@/branches/shared/components/features/site-generator/SiteGenerator/WizardStep5Generate'

// ─── Initiele wizard state ────────────────────────────────────────────────────

const initialState: WizardState = {
  currentStep: 1,
  siteGoal: undefined,
  companyInfo: {
    name: '',
    businessType: '',
    industry: '',
    targetAudience: '',
    coreValues: [],
    usps: [],
    services: [],
    testimonials: [],
    portfolioCases: [],
    pricingPackages: [],
  },
  design: {
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
    style: 'modern',
    fontPreference: 'sans-serif',
  },
  content: {
    language: 'nl',
    tone: 'professional',
    pages: ['home'],
  },
  features: {
    contactForm: true,
    newsletter: false,
    testimonials: true,
    faq: false,
    socialMedia: true,
    maps: false,
    cta: true,
    ecommerce: false,
  },
  extraFeatures: [],
}

// ─── Stap definitie ───────────────────────────────────────────────────────────

interface StepDef {
  id: string
  title: string
  description: string
  alwaysShow: boolean
  condition?: (state: WizardState) => boolean
}

function buildSteps(wizardData: WizardState): (StepDef & { number: number })[] {
  const goal = wizardData.siteGoal
  const isWebshopType = goal?.primaryType === 'webshop' || goal?.primaryType === 'hybrid'

  const all: StepDef[] = [
    {
      id: 'company',
      title: 'Bedrijf',
      description: 'Bedrijfsinfo',
      alwaysShow: true,
    },
    {
      id: 'goal',
      title: 'Type',
      description: 'Wat wordt het?',
      alwaysShow: true,
    },
    {
      id: 'content',
      title: "Pagina's",
      description: 'Taal & paginas',
      alwaysShow: true,
    },
    {
      id: 'services',
      title: 'Diensten',
      description: 'Wat u aanbiedt',
      alwaysShow: false,
      condition: (s) => s.content.pages.includes('services'),
    },
    {
      id: 'testimonials',
      title: 'Referenties',
      description: 'Reviews',
      alwaysShow: false,
      condition: (s) => s.content.pages.includes('testimonials'),
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Cases & werk',
      alwaysShow: false,
      condition: (s) =>
        s.content.pages.includes('portfolio') &&
        s.siteGoal?.primaryType !== 'webshop',
    },
    {
      id: 'pricing',
      title: 'Prijzen',
      description: 'Pakketten',
      alwaysShow: false,
      condition: (s) => s.content.pages.includes('pricing'),
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Contactgegevens',
      alwaysShow: false,
      condition: (s) => s.content.pages.includes('contact'),
    },
    {
      id: 'features',
      title: 'Functies',
      description: 'Extra features',
      alwaysShow: true,
    },
    {
      id: 'ecommerce',
      title: 'Webshop',
      description: 'Shop instellingen',
      alwaysShow: false,
      condition: (s) => isWebshopType,
    },
    {
      id: 'product-import',
      title: 'Producten',
      description: 'Import template',
      alwaysShow: false,
      condition: (s) => isWebshopType && !!s.ecommerce?.shopType,
    },
    {
      id: 'design',
      title: 'Design',
      description: 'Visuele stijl',
      alwaysShow: true,
    },
    {
      id: 'generate',
      title: 'Bouwen',
      description: 'CMS genereren',
      alwaysShow: true,
    },
  ]

  return all
    .filter((step) => step.alwaysShow || (step.condition && step.condition(wizardData)))
    .map((step, index) => ({ ...step, number: index + 1 }))
}

// ─── Stap validatie ───────────────────────────────────────────────────────────

function isStepValid(stepId: string, wizardData: WizardState): boolean {
  switch (stepId) {
    case 'company':
      return (
        wizardData.companyInfo.name.length > 0 &&
        wizardData.companyInfo.industry.length > 0
      )

    case 'goal': {
      const goal = wizardData.siteGoal
      if (!goal?.primaryType) return false
      if (goal.primaryType === 'website') return !!goal.websiteSubType
      if (goal.primaryType === 'webshop') return !!goal.shopModel
      if (goal.primaryType === 'hybrid') return !!goal.shopModel && !!goal.hybridWebsiteType
      return false
    }

    case 'content':
      return wizardData.content.pages.length > 0

    case 'services':
      return (wizardData.companyInfo.services?.length ?? 0) >= 1

    case 'testimonials':
      return true

    case 'portfolio':
      return true

    case 'pricing':
      return true

    case 'contact':
      return (
        (wizardData.companyInfo.contactInfo?.email?.length ?? 0) > 0 &&
        (wizardData.companyInfo.contactInfo?.formConfig?.notificationEmail?.length ?? 0) > 0
      )

    case 'features':
      return true

    case 'ecommerce':
      return (
        (wizardData.ecommerce?.shopType?.length ?? 0) > 0 &&
        (wizardData.ecommerce?.currency?.length ?? 0) > 0
      )

    case 'product-import':
      return true

    case 'design':
      return true

    default:
      return true
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function SiteGeneratorPage() {
  const [currentStepId, setCurrentStepId] = useState<string>('company')
  const [wizardData, setWizardData] = useState<WizardState>(initialState)

  const steps = buildSteps(wizardData)
  const currentStepIndex = steps.findIndex((s) => s.id === currentStepId)
  const currentStep = steps[currentStepIndex]
  const totalSteps = steps.length

  const updateWizardData = (data: Partial<WizardState>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepId(steps[currentStepIndex + 1].id)
      // Scroll naar boven bij stap wissel
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(steps[currentStepIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (stepId: string) => {
    setCurrentStepId(stepId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      data-theme="light"
      style={{
        '--background': 'oklch(100% 0 0deg)',
        '--foreground': 'oklch(14.5% 0 0deg)',
        '--card': 'oklch(100% 0 0deg)',
        '--card-foreground': 'oklch(14.5% 0 0deg)',
        '--primary': 'oklch(50% 0.2 250deg)',
        '--primary-foreground': 'oklch(98.5% 0 0deg)',
        '--secondary': 'oklch(97% 0 0deg)',
        '--secondary-foreground': 'oklch(20.5% 0 0deg)',
        '--muted': 'oklch(97% 0 0deg)',
        '--muted-foreground': 'oklch(55.6% 0 0deg)',
        '--border': 'oklch(92.2% 0 0deg)',
        '--input': 'oklch(98% 0 0deg)',
        '--ring': 'oklch(50% 0.2 250deg)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b border-blue-700/20 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  🚀
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  CMS Builder Wizard
                </h1>
              </div>
              <p className="text-blue-100 text-base ml-15">
                Genereer een op maat gemaakt CMS — exact wat nodig is, geen ruis
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-4 py-2 shadow-lg"
            >
              Stap {currentStep?.number || 1} / {totalSteps}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between min-w-max">
            {steps.map((step, index) => {
              const isPast = index < currentStepIndex
              const isCurrent = step.id === currentStepId
              const previousStep = index > 0 ? steps[index - 1] : null
              const canNavigate = isPast || (previousStep && isStepValid(previousStep.id, wizardData))

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center group px-1">
                    <button
                      onClick={() => canNavigate && goToStep(step.id)}
                      disabled={!canNavigate && !isCurrent}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md relative ${
                        isPast
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer hover:shadow-xl hover:scale-110 transform'
                          : isCurrent
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl scale-110 ring-4 ring-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5" strokeWidth={3} /> : step.number}
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full bg-blue-400 animate-ping opacity-30" />
                      )}
                    </button>
                    <div className="mt-2 text-center w-16">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-blue-700' : isPast ? 'text-green-700' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-1" style={{ marginTop: '-28px', minWidth: '20px' }}>
                      <div className={`h-1 rounded-full transition-all duration-500 ${
                        isPast ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-8 pb-8 px-8 bg-gradient-to-br from-white to-gray-50/30">

            {currentStepId === 'company' && (
              <WizardStep1Company
                data={wizardData.companyInfo}
                onChange={(companyInfo) => updateWizardData({ companyInfo })}
              />
            )}

            {currentStepId === 'goal' && (
              <WizardStep2Goal
                data={wizardData.siteGoal}
                onChange={(siteGoal) => updateWizardData({ siteGoal })}
              />
            )}

            {currentStepId === 'content' && (
              <WizardStep3Content
                data={wizardData.content}
                siteGoal={wizardData.siteGoal}
                onChange={(content) => updateWizardData({ content })}
              />
            )}

            {currentStepId === 'services' && (
              <WizardStepServices
                services={wizardData.companyInfo.services || []}
                onChange={(services) =>
                  updateWizardData({ companyInfo: { ...wizardData.companyInfo, services } })
                }
              />
            )}

            {currentStepId === 'testimonials' && (
              <WizardStepTestimonials
                testimonials={wizardData.companyInfo.testimonials || []}
                onChange={(testimonials) =>
                  updateWizardData({ companyInfo: { ...wizardData.companyInfo, testimonials } })
                }
              />
            )}

            {currentStepId === 'portfolio' && (
              <WizardStepPortfolio
                portfolioCases={wizardData.companyInfo.portfolioCases || []}
                onChange={(portfolioCases) =>
                  updateWizardData({ companyInfo: { ...wizardData.companyInfo, portfolioCases } })
                }
              />
            )}

            {currentStepId === 'pricing' && (
              <WizardStepPricing
                pricingPackages={wizardData.companyInfo.pricingPackages || []}
                onChange={(pricingPackages) =>
                  updateWizardData({ companyInfo: { ...wizardData.companyInfo, pricingPackages } })
                }
              />
            )}

            {currentStepId === 'contact' && (
              <WizardStepContact
                contactInfo={wizardData.companyInfo.contactInfo}
                onChange={(contactInfo) =>
                  updateWizardData({ companyInfo: { ...wizardData.companyInfo, contactInfo } })
                }
              />
            )}

            {currentStepId === 'features' && (
              <WizardStep4Features
                data={wizardData.features}
                extraFeatures={wizardData.extraFeatures}
                siteGoal={wizardData.siteGoal}
                onChange={(features) => updateWizardData({ features })}
                onExtraFeaturesChange={(extraFeatures) => updateWizardData({ extraFeatures })}
              />
            )}

            {currentStepId === 'ecommerce' && (
              <WizardStepEcommerce
                ecommerceSettings={wizardData.ecommerce}
                onChange={(ecommerce) => updateWizardData({ ecommerce })}
              />
            )}

            {currentStepId === 'product-import' && wizardData.ecommerce && (
              <WizardStepProductImport ecommerceSettings={wizardData.ecommerce} />
            )}

            {currentStepId === 'design' && (
              <WizardStep2Design
                data={wizardData.design}
                onChange={(design) => updateWizardData({ design })}
              />
            )}

            {currentStepId === 'generate' && (
              <WizardStep5Generate wizardData={wizardData} />
            )}
          </CardContent>
        </Card>

        {/* Navigatieknoppen */}
        {currentStepId !== 'generate' && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <Button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              variant="outline"
              size="lg"
              className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 px-8 py-6 text-base font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                Vorige
              </span>
            </Button>
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStepId, wizardData)}
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2">
                Volgende
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
