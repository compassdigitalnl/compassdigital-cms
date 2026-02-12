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
      className="min-h-screen bg-gray-50"
      data-theme="light"
      style={{
        // Force light theme colors regardless of system preference
        '--background': 'oklch(100% 0 0deg)',
        '--foreground': 'oklch(14.5% 0 0deg)',
        '--card': 'oklch(96.5% 0.005 265deg)',
        '--card-foreground': 'oklch(14.5% 0 0deg)',
        '--popover': 'oklch(100% 0 0deg)',
        '--popover-foreground': 'oklch(14.5% 0 0deg)',
        '--primary': 'oklch(20.5% 0 0deg)',
        '--primary-foreground': 'oklch(98.5% 0 0deg)',
        '--secondary': 'oklch(97% 0 0deg)',
        '--secondary-foreground': 'oklch(20.5% 0 0deg)',
        '--muted': 'oklch(97% 0 0deg)',
        '--muted-foreground': 'oklch(55.6% 0 0deg)',
        '--accent': 'oklch(97% 0 0deg)',
        '--accent-foreground': 'oklch(20.5% 0 0deg)',
        '--border': 'oklch(92.2% 0 0deg)',
        '--input': 'oklch(92.2% 0 0deg)',
        '--ring': 'oklch(70.8% 0 0deg)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Site Generator Wizard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Genereer een complete, productie-klare website in 5 minuten
              </p>
            </div>
            <Badge variant="default" className="text-sm">
              Stap {currentStep?.number || 1} van {totalSteps}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isPast = index < currentStepIndex
              const isCurrent = step.id === currentStepId
              const previousStep = index > 0 ? steps[index - 1] : null
              const canNavigate = isPast || (previousStep && isStepValid(previousStep.id))

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => canNavigate && goToStep(step.id)}
                      disabled={!canNavigate && !isCurrent}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isPast
                          ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5" /> : step.number}
                    </button>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${isPast ? 'bg-green-500' : 'bg-gray-200'}`}
                      style={{ maxWidth: '60px', marginTop: '-30px' }}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
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

        {/* Navigation Buttons */}
        {currentStepId !== 'generate' && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              variant="outline"
              size="lg"
            >
              ← Vorige
            </Button>
            <Button onClick={nextStep} disabled={!isStepValid(currentStepId)} size="lg">
              Volgende →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
