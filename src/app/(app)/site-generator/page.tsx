'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { WizardState } from '@/lib/siteGenerator/types'
import { WizardStep1Company } from '@/components/SiteGenerator/WizardStep1Company'
import { WizardStep2Design } from '@/components/SiteGenerator/WizardStep2Design'
import { WizardStepServices } from '@/components/SiteGenerator/WizardStepServices'
import { WizardStepTestimonials } from '@/components/SiteGenerator/WizardStepTestimonials'
import { WizardStepPortfolio } from '@/components/SiteGenerator/WizardStepPortfolio'
import { WizardStepPricing } from '@/components/SiteGenerator/WizardStepPricing'
import { WizardStepContact } from '@/components/SiteGenerator/WizardStepContact'
import { WizardStepEcommerce } from '@/components/SiteGenerator/WizardStepEcommerce'
import { WizardStepProductImport } from '@/components/SiteGenerator/WizardStepProductImport'
import { WizardStep3Content } from '@/components/SiteGenerator/WizardStep3Content'
import { WizardStep4Features } from '@/components/SiteGenerator/WizardStep4Features'
import { WizardStep5Generate } from '@/components/SiteGenerator/WizardStep5Generate'

export default function SiteGeneratorPage() {
  const [currentStepId, setCurrentStepId] = useState<string>('company')
  const [wizardData, setWizardData] = useState<WizardState>({
    currentStep: 1,
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
      contactForm: false,
      newsletter: false,
      testimonials: false,
      faq: false,
      socialMedia: false,
      maps: false,
      cta: true,
      ecommerce: false,
    },
  })

  // Dynamic steps based on selected pages
  const allSteps = [
    { id: 'company', title: 'Bedrijfsinfo', description: 'Over uw bedrijf', alwaysShow: true },
    { id: 'design', title: 'Design', description: 'Visuele stijl', alwaysShow: true },
    { id: 'content', title: 'Content', description: 'Taal en paginas', alwaysShow: true },
    {
      id: 'services',
      title: 'Diensten',
      description: 'Wat je aanbiedt',
      alwaysShow: false,
      condition: () => wizardData.content.pages.includes('services'),
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Reviews',
      alwaysShow: false,
      condition: () => wizardData.content.pages.includes('testimonials'),
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Cases',
      alwaysShow: false,
      condition: () => wizardData.content.pages.includes('portfolio'),
    },
    {
      id: 'pricing',
      title: 'Prijzen',
      description: 'Pakketten',
      alwaysShow: false,
      condition: () => wizardData.content.pages.includes('pricing'),
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Contactgegevens',
      alwaysShow: false,
      condition: () => wizardData.content.pages.includes('contact'),
    },
    { id: 'features', title: 'Features', description: 'Functionaliteiten', alwaysShow: true },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Webshop setup',
      alwaysShow: false,
      condition: () => wizardData.features.ecommerce,
    },
    {
      id: 'product-import',
      title: 'Producten',
      description: 'Import template',
      alwaysShow: false,
      condition: () => wizardData.features.ecommerce && !!wizardData.ecommerce?.shopType,
    },
    { id: 'generate', title: 'Genereer!', description: 'Site maken', alwaysShow: true },
  ]

  const steps = allSteps
    .filter((step) => step.alwaysShow || (step.condition && step.condition()))
    .map((step, index) => ({
      ...step,
      number: index + 1,
    }))

  const currentStepIndex = steps.findIndex((s) => s.id === currentStepId)
  const currentStep = steps[currentStepIndex]
  const totalSteps = steps.length

  const updateWizardData = (data: Partial<WizardState>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepId(steps[currentStepIndex + 1].id)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(steps[currentStepIndex - 1].id)
    }
  }

  const goToStep = (stepId: string) => {
    setCurrentStepId(stepId)
  }

  const isStepValid = (stepId: string): boolean => {
    switch (stepId) {
      case 'company':
        return (
          wizardData.companyInfo.name.length > 0 &&
          wizardData.companyInfo.businessType.length > 0 &&
          wizardData.companyInfo.industry.length > 0
        )
      case 'design':
        return true // Design always valid (has defaults)
      case 'content':
        return wizardData.content.pages.length > 0
      case 'services':
        return (wizardData.companyInfo.services?.length ?? 0) >= 1 // Min 1 service required
      case 'testimonials':
        return true // Testimonials always valid (optional)
      case 'portfolio':
        return true // Portfolio always valid (optional)
      case 'pricing':
        return true // Pricing always valid (optional)
      case 'contact':
        // Contact requires email and notification email
        return (
          (wizardData.companyInfo.contactInfo?.email?.length ?? 0) > 0 &&
          (wizardData.companyInfo.contactInfo?.formConfig?.notificationEmail?.length ?? 0) > 0
        )
      case 'ecommerce':
        // E-commerce requires shop type and currency
        return (
          (wizardData.ecommerce?.shopType?.length ?? 0) > 0 &&
          (wizardData.ecommerce?.currency?.length ?? 0) > 0
        )
      case 'product-import':
        return true // Product import always valid (optional to upload)
      case 'features':
        return true // Features always valid (optional)
      default:
        return true
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      data-theme="light"
      style={{
        // Force light theme colors regardless of system preference
        '--background': 'oklch(100% 0 0deg)',
        '--foreground': 'oklch(14.5% 0 0deg)',
        '--card': 'oklch(100% 0 0deg)',
        '--card-foreground': 'oklch(14.5% 0 0deg)',
        '--popover': 'oklch(100% 0 0deg)',
        '--popover-foreground': 'oklch(14.5% 0 0deg)',
        '--primary': 'oklch(50% 0.2 250deg)',
        '--primary-foreground': 'oklch(98.5% 0 0deg)',
        '--secondary': 'oklch(97% 0 0deg)',
        '--secondary-foreground': 'oklch(20.5% 0 0deg)',
        '--muted': 'oklch(97% 0 0deg)',
        '--muted-foreground': 'oklch(55.6% 0 0deg)',
        '--accent': 'oklch(97% 0 0deg)',
        '--accent-foreground': 'oklch(20.5% 0 0deg)',
        '--border': 'oklch(92.2% 0 0deg)',
        '--input': 'oklch(98% 0 0deg)',
        '--ring': 'oklch(50% 0.2 250deg)',
      } as React.CSSProperties}
    >
      {/* Header with Gradient */}
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
                  Site Generator Wizard
                </h1>
              </div>
              <p className="text-blue-100 text-base ml-15">
                Genereer een complete, productie-klare website met AI in 5 minuten
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

      {/* Progress Steps - Modern Design */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isPast = index < currentStepIndex
              const isCurrent = step.id === currentStepId
              const previousStep = index > 0 ? steps[index - 1] : null
              const canNavigate = isPast || (previousStep && isStepValid(previousStep.id))

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1 group">
                    <button
                      onClick={() => canNavigate && goToStep(step.id)}
                      disabled={!canNavigate && !isCurrent}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-md relative ${
                        isPast
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer hover:shadow-xl hover:scale-110 transform'
                          : isCurrent
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl scale-110 ring-4 ring-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-6 h-6" strokeWidth={3} />
                      ) : (
                        step.number
                      )}
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full bg-blue-400 animate-ping opacity-30" />
                      )}
                    </button>
                    <div className="mt-3 text-center max-w-[100px]">
                      <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-700' : isPast ? 'text-green-700' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-3" style={{ marginTop: '-45px' }}>
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${
                        isPast
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gray-200'
                      }`} style={{ maxWidth: '80px' }} />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Beautiful Card */}
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
            {currentStepId === 'design' && (
              <WizardStep2Design
                data={wizardData.design}
                onChange={(design) => updateWizardData({ design })}
              />
            )}
            {currentStepId === 'content' && (
              <WizardStep3Content
                data={wizardData.content}
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
            {currentStepId === 'ecommerce' && (
              <WizardStepEcommerce
                ecommerceSettings={wizardData.ecommerce}
                onChange={(ecommerce) => updateWizardData({ ecommerce })}
              />
            )}
            {currentStepId === 'product-import' && wizardData.ecommerce && (
              <WizardStepProductImport ecommerceSettings={wizardData.ecommerce} />
            )}
            {currentStepId === 'features' && (
              <WizardStep4Features
                data={wizardData.features}
                onChange={(features) => updateWizardData({ features })}
              />
            )}
            {currentStepId === 'generate' && <WizardStep5Generate wizardData={wizardData} />}
          </CardContent>
        </Card>

        {/* Navigation Buttons - Beautiful Design */}
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
              disabled={!isStepValid(currentStepId)}
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
