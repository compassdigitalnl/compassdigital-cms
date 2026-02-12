'use client'

import React from 'react'
import { Features } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Mail, Newspaper, Star, HelpCircle, Share2, MapPin, Target, ShoppingCart } from 'lucide-react'

interface Props {
  data: Features
  onChange: (data: Features) => void
}

export function WizardStep4Features({ data, onChange }: Props) {
  const features = [
    {
      key: 'contactForm' as keyof Features,
      icon: Mail,
      name: 'Contact Formulier',
      description: 'Laat bezoekers eenvoudig contact met u opnemen',
      recommended: true,
    },
    {
      key: 'newsletter' as keyof Features,
      icon: Newspaper,
      name: 'Nieuwsbrief Inschrijving',
      description: 'Verzamel e-mailadressen voor uw nieuwsbrief',
      recommended: true,
    },
    {
      key: 'testimonials' as keyof Features,
      icon: Star,
      name: 'Testimonials Sectie',
      description: 'Toon klantbeoordelingen en reviews',
      recommended: true,
    },
    {
      key: 'faq' as keyof Features,
      icon: HelpCircle,
      name: 'FAQ Sectie',
      description: 'Veelgestelde vragen en antwoorden',
      recommended: false,
    },
    {
      key: 'socialMedia' as keyof Features,
      icon: Share2,
      name: 'Social Media Links',
      description: 'Links naar uw social media profielen',
      recommended: true,
    },
    {
      key: 'maps' as keyof Features,
      icon: MapPin,
      name: 'Google Maps Integratie',
      description: 'Toon uw locatie op een kaart',
      recommended: false,
    },
    {
      key: 'cta' as keyof Features,
      icon: Target,
      name: 'Call-to-Action Knoppen',
      description: 'Strategische CTAs door de hele site',
      recommended: true,
    },
    {
      key: 'ecommerce' as keyof Features,
      icon: ShoppingCart,
      name: 'E-commerce / Webshop',
      description: 'Verkoop producten online met een volledige webshop',
      recommended: false,
    },
  ]

  const toggleFeature = (key: keyof Features) => {
    onChange({ ...data, [key]: !data[key] })
  }

  const enabledCount = Object.values(data).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">⚡ Features & Functionaliteiten</h2>
        <p className="mt-1 text-sm text-gray-600">
          Selecteer de features die u wilt toevoegen aan uw website
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div>
          <p className="font-semibold text-sm">Geselecteerde Features</p>
          <p className="text-xs text-gray-600 mt-1">
            {enabledCount} van {features.length} features geactiveerd
          </p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          {enabledCount}
        </Badge>
      </div>

      <div className="space-y-3">
        {features.map((feature) => {
          const Icon = feature.icon
          const isEnabled = data[feature.key]

          return (
            <div
              key={feature.key}
              onClick={() => toggleFeature(feature.key)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isEnabled
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={isEnabled}
                  onCheckedChange={() => toggleFeature(feature.key)}
                  className="mt-1"
                />
                <div
                  className={`p-2 rounded-lg ${
                    isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{feature.name}</h3>
                    {feature.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Aanbevolen
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Meer features betekent een rijkere website, maar ook een iets
          langere generatietijd. Start met de aanbevolen features en voeg later meer toe.
        </p>
      </div>
    </div>
  )
}
