'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type {
  SiteGoal,
  PrimaryType,
  WebsiteSubType,
  WebshopModel,
  PricingModel,
} from '@/lib/siteGenerator/types'

interface Props {
  data: SiteGoal | undefined
  onChange: (data: SiteGoal) => void
}

// ─── Primaire type kaarten ────────────────────────────────────────────────────

const primaryTypes: {
  value: PrimaryType
  icon: string
  label: string
  description: string
}[] = [
  {
    value: 'website',
    icon: '🌐',
    label: 'Website',
    description: 'Informatieve website voor uw bedrijf, portfolio of blog',
  },
  {
    value: 'webshop',
    icon: '🛒',
    label: 'Webshop',
    description: 'Online winkel met producten, winkelwagen en checkout',
  },
  {
    value: 'hybrid',
    icon: '🔀',
    label: 'Hybrid',
    description: 'Combinatie van informatieve website én webshop',
  },
]

// ─── Website sub-types ────────────────────────────────────────────────────────

const websiteSubTypes: {
  value: WebsiteSubType
  icon: string
  label: string
  description: string
}[] = [
  {
    value: 'corporate',
    icon: '🏢',
    label: 'Corporate / Dienstverlener',
    description: 'Professionele bedrijfssite met diensten en over ons',
  },
  {
    value: 'portfolio',
    icon: '🎨',
    label: 'Portfolio',
    description: 'Showcase van uw werk, projecten en cases',
  },
  {
    value: 'agency',
    icon: '💡',
    label: 'Agency',
    description: 'Bureau-website met cases, team en diensten',
  },
  {
    value: 'blog',
    icon: '✍️',
    label: 'Blog / Magazine',
    description: 'Content-first publicatieplatform',
  },
  {
    value: 'landing',
    icon: '🚀',
    label: 'Landing Page',
    description: 'Enkele conversiepagina voor een product of dienst',
  },
]

// ─── Webshop modellen ─────────────────────────────────────────────────────────

const shopModels: {
  value: WebshopModel
  icon: string
  label: string
  description: string
}[] = [
  {
    value: 'b2c-simple',
    icon: '🏪',
    label: 'B2C Simpel',
    description: 'Vaste prijzen, iedereen ziet hetzelfde — ideaal voor kleine shops',
  },
  {
    value: 'b2c-advanced',
    icon: '🏬',
    label: 'B2C Geavanceerd',
    description: 'Productvarianten, bundels, kortingscodes',
  },
  {
    value: 'b2b',
    icon: '🏭',
    label: 'B2B',
    description: 'Klantrollen, staffelprijzen, offertes — voor zakelijke klanten',
  },
  {
    value: 'hybrid',
    icon: '🔁',
    label: 'Hybrid B2B + B2C',
    description: 'Zowel particuliere als zakelijke klanten met eigen prijzen',
  },
]

// ─── Prijsmodellen ────────────────────────────────────────────────────────────

const pricingModels: {
  value: PricingModel
  label: string
  description: string
}[] = [
  {
    value: 'flat',
    label: 'Vaste prijzen',
    description: 'Iedereen ziet en betaalt hetzelfde',
  },
  {
    value: 'tiered',
    label: 'Staffelprijzen',
    description: 'Prijs daalt bij grotere hoeveelheden',
  },
  {
    value: 'customer-groups',
    label: 'Klantrollen prijzen',
    description: 'Verschillende prijzen per klantgroep (bijv. groothandel vs retail)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WizardStep2Goal({ data, onChange }: Props) {
  const primaryType = data?.primaryType

  const update = (patch: Partial<SiteGoal>) => {
    onChange({ ...(data ?? { primaryType: 'website' }), ...patch })
  }

  const selectPrimary = (value: PrimaryType) => {
    // Reset sub-vragen bij wijziging van primair type
    onChange({ primaryType: value })
  }

  const isWebshop = primaryType === 'webshop' || primaryType === 'hybrid'
  const isB2B = isWebshop && (data?.shopModel === 'b2b' || data?.shopModel === 'hybrid')
  const needsPricingModel = isWebshop && data?.shopModel && data.shopModel !== 'b2c-simple'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Wat wordt het?</h2>
            <p className="text-sm text-gray-500 font-medium">Stap 2 — bepaalt de volledige CMS-inrichting</p>
          </div>
        </div>
        <p className="text-base text-gray-600 pl-15">
          Op basis van uw keuze bepalen we exact welke functies, pagina&apos;s en mogelijkheden beschikbaar worden — zonder overbodige ruis.
        </p>
      </div>

      {/* Primaire keuze */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-800">Kies het type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {primaryTypes.map((type) => {
            const isSelected = primaryType === type.value
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => selectPrimary(type.value)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                    ✓
                  </span>
                )}
                <span className="text-3xl mb-3 block">{type.icon}</span>
                <h3 className={`font-bold text-base ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                  {type.label}
                </h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Website sub-type */}
      {(primaryType === 'website' || primaryType === 'hybrid') && (
        <div className="space-y-3 border-t border-gray-100 pt-6">
          <Label className="text-base font-semibold text-gray-800">
            {primaryType === 'hybrid' ? 'Type website-gedeelte' : 'Type website'}
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {websiteSubTypes.map((sub) => {
              const field = primaryType === 'hybrid' ? 'hybridWebsiteType' : 'websiteSubType'
              const current = primaryType === 'hybrid' ? data?.hybridWebsiteType : data?.websiteSubType
              const isSelected = current === sub.value
              return (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => update({ [field]: sub.value })}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sub.icon}</span>
                    <div>
                      <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                        {sub.label}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Webshop model */}
      {isWebshop && (
        <div className="space-y-3 border-t border-gray-100 pt-6">
          <Label className="text-base font-semibold text-gray-800">Webshop model</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shopModels.map((model) => {
              const isSelected = data?.shopModel === model.value
              return (
                <button
                  key={model.value}
                  type="button"
                  onClick={() => update({ shopModel: model.value, pricingModel: undefined })}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{model.icon}</span>
                    <div>
                      <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                        {model.label}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {model.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Prijsmodel (als niet b2c-simple) */}
      {needsPricingModel && (
        <div className="space-y-3 border-t border-gray-100 pt-6">
          <Label className="text-base font-semibold text-gray-800">Prijsmodel</Label>
          <div className="space-y-2">
            {pricingModels.map((pm) => {
              const isSelected = data?.pricingModel === pm.value
              return (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => update({ pricingModel: pm.value, hasCustomerGroups: pm.value === 'customer-groups' })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                        {pm.label}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {pm.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge className="bg-indigo-600 text-white text-xs">Geselecteerd</Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* B2B extra opties */}
      {isB2B && (
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <Label className="text-base font-semibold text-gray-800">B2B opties</Label>
          <p className="text-xs text-gray-500">
            Selecteer de functies die relevant zijn voor uw zakelijke klanten
          </p>
          <div className="space-y-3">
            {[
              {
                key: 'requiresApproval' as const,
                label: 'Order goedkeuring',
                description: 'Bestellingen worden eerst intern goedgekeurd vóór verwerking',
              },
              {
                key: 'hidePricesForGuests' as const,
                label: 'Prijzen verbergen voor gasten',
                description: 'Niet-ingelogde bezoekers zien geen prijzen — alleen na login',
              },
              {
                key: 'enableQuoteRequests' as const,
                label: 'Offerteaanvragen',
                description: 'Klanten kunnen een offerte aanvragen in plaats van direct bestellen',
              },
              {
                key: 'enableBulkOrder' as const,
                label: 'Bulk bestellen (quick-order)',
                description: 'Snel grote hoeveelheden bestellen via artikelnummer of lijst',
              },
            ].map((option) => (
              <div
                key={option.key}
                onClick={() => update({ [option.key]: !data?.[option.key] })}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  data?.[option.key]
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Checkbox
                  checked={!!data?.[option.key]}
                  onCheckedChange={() => update({ [option.key]: !data?.[option.key] })}
                  className="mt-0.5"
                />
                <div>
                  <h4 className={`font-semibold text-sm ${data?.[option.key] ? 'text-indigo-800' : 'text-gray-800'}`}>
                    {option.label}
                  </h4>
                  <p className={`text-xs mt-0.5 ${data?.[option.key] ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Samenvatting */}
      {primaryType && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-1">CMS wordt ingericht voor:</p>
          <p className="text-sm text-gray-600">
            {primaryType === 'website' && data?.websiteSubType &&
              `Website — ${websiteSubTypes.find(s => s.value === data.websiteSubType)?.label}`}
            {primaryType === 'webshop' && data?.shopModel &&
              `Webshop — ${shopModels.find(s => s.value === data.shopModel)?.label}${data.pricingModel ? ` — ${pricingModels.find(p => p.value === data.pricingModel)?.label}` : ''}`}
            {primaryType === 'hybrid' && data?.shopModel &&
              `Hybrid — ${websiteSubTypes.find(s => s.value === data.hybridWebsiteType)?.label ?? 'website'} + ${shopModels.find(s => s.value === data.shopModel)?.label}`}
            {!data?.websiteSubType && primaryType === 'website' && 'Selecteer nog een website type hierboven'}
            {!data?.shopModel && isWebshop && 'Selecteer nog een webshop model hierboven'}
          </p>
        </div>
      )}
    </div>
  )
}
