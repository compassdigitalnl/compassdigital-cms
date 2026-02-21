'use client'

import React from 'react'
import type { Features, ExtraFeature, SiteGoal } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'
import { Badge } from '@/branches/shared/components/ui/badge'
import {
  Mail, Newspaper, Star, HelpCircle, Share2, MapPin, Target,
  Lock, Megaphone, Calendar, Briefcase, BookOpen, MessageSquare,
} from 'lucide-react'

interface Props {
  data: Features
  extraFeatures?: ExtraFeature[]
  siteGoal?: SiteGoal
  onChange: (data: Features) => void
  onExtraFeaturesChange: (extra: ExtraFeature[]) => void
}

// ─── Standaard features ───────────────────────────────────────────────────────

interface StandardFeature {
  key: keyof Features
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  recommended: boolean
  hideForTypes?: Array<'website' | 'webshop' | 'hybrid'>
}

const standardFeatures: StandardFeature[] = [
  {
    key: 'contactForm',
    icon: Mail,
    name: 'Contactformulier',
    description: 'Laat bezoekers eenvoudig contact opnemen',
    recommended: true,
  },
  {
    key: 'newsletter',
    icon: Newspaper,
    name: 'Nieuwsbrief inschrijving',
    description: 'Verzamel e-mailadressen voor uw nieuwsbrief',
    recommended: true,
  },
  {
    key: 'testimonials',
    icon: Star,
    name: 'Testimonials sectie',
    description: 'Toon klantbeoordelingen en reviews',
    recommended: true,
  },
  {
    key: 'faq',
    icon: HelpCircle,
    name: 'FAQ sectie',
    description: 'Veelgestelde vragen en antwoorden',
    recommended: false,
  },
  {
    key: 'socialMedia',
    icon: Share2,
    name: 'Social media links',
    description: 'Links naar uw social media profielen',
    recommended: true,
  },
  {
    key: 'maps',
    icon: MapPin,
    name: 'Google Maps integratie',
    description: 'Toon uw locatie op een kaart',
    recommended: false,
  },
  {
    key: 'cta',
    icon: Target,
    name: 'Call-to-action knoppen',
    description: 'Strategische CTAs door de hele site',
    recommended: true,
  },
]

// ─── Extra (niet-standaard) features ─────────────────────────────────────────

interface ExtraFeatureOption {
  key: ExtraFeature
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  badge?: string
}

const extraFeatureOptions: ExtraFeatureOption[] = [
  {
    key: 'paywall',
    icon: Lock,
    name: 'Paywall / Members-only',
    description: 'Afgesloten content alleen zichtbaar na betaling of registratie',
    badge: 'Premium',
  },
  {
    key: 'ad-space',
    icon: Megaphone,
    name: 'Advertentieruimte',
    description: 'Beheerbare banner- en advertentieposities op de site',
    badge: 'Monetisatie',
  },
  {
    key: 'events-calendar',
    icon: Calendar,
    name: 'Evenementenkalender',
    description: 'Agenda met evenementen, workshops of webinars',
  },
  {
    key: 'job-board',
    icon: Briefcase,
    name: 'Vacaturebank',
    description: 'Beheerbare vacaturepagina met sollicitatieformulier',
  },
  {
    key: 'booking-system',
    icon: BookOpen,
    name: 'Boekingssysteem',
    description: 'Online afspraken of reserveringen inplannen',
  },
  {
    key: 'live-chat',
    icon: MessageSquare,
    name: 'Live chat integratie',
    description: 'Koppeling met een live chat widget (bijv. Crisp, Intercom)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WizardStep4Features({
  data,
  extraFeatures = [],
  siteGoal,
  onChange,
  onExtraFeaturesChange,
}: Props) {
  const toggleFeature = (key: keyof Features) => {
    onChange({ ...data, [key]: !data[key] })
  }

  const toggleExtra = (key: ExtraFeature) => {
    const next = extraFeatures.includes(key)
      ? extraFeatures.filter((f) => f !== key)
      : [...extraFeatures, key]
    onExtraFeaturesChange(next)
  }

  // Verberg de ecommerce-toggle als al bepaald via siteGoal
  const visibleStandard = standardFeatures.filter((f) => {
    if (f.key === 'ecommerce') return false // wordt bepaald via siteGoal
    if (f.hideForTypes && siteGoal?.primaryType && f.hideForTypes.includes(siteGoal.primaryType)) {
      return false
    }
    return true
  })

  const enabledCount = visibleStandard.filter((f) => data[f.key]).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-500/30">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Functies & Features</h2>
            <p className="text-sm text-gray-500 font-medium">Stap 4</p>
          </div>
        </div>
        <p className="text-base text-gray-600 pl-15">
          Standaard functies voor de site. Niet-standaard functies vereisen extra inrichting.
        </p>
      </div>

      {/* Standaard features */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="font-semibold text-sm text-blue-800">Standaard functies</p>
            <p className="text-xs text-blue-600 mt-0.5">
              {enabledCount} van {visibleStandard.length} geactiveerd
            </p>
          </div>
          <Badge className="bg-blue-600 text-white px-3 py-1">{enabledCount}</Badge>
        </div>

        <div className="space-y-2">
          {visibleStandard.map((feature) => {
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
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{feature.name}</h3>
                      {feature.recommended && (
                        <Badge variant="secondary" className="text-xs">Aanbevolen</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Niet-standaard / extra features */}
      <div className="space-y-3 border-t border-gray-100 pt-6">
        <div>
          <Label className="text-base font-semibold text-gray-800">Niet-standaard functies</Label>
          <p className="text-xs text-gray-500 mt-1">
            Deze functies vereisen extra inrichting en zijn niet in elk pakket inbegrepen.
            Selecteer wat relevant is — we houden er rekening mee bij het opzetten van het CMS.
          </p>
        </div>

        <div className="space-y-2">
          {extraFeatureOptions.map((feature) => {
            const Icon = feature.icon
            const isEnabled = extraFeatures.includes(feature.key)

            return (
              <div
                key={feature.key}
                onClick={() => toggleExtra(feature.key)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isEnabled
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={() => toggleExtra(feature.key)}
                    className="mt-1"
                  />
                  <div
                    className={`p-2 rounded-lg ${
                      isEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{feature.name}</h3>
                      {feature.badge && (
                        <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                          {feature.badge}
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
      </div>
    </div>
  )
}
