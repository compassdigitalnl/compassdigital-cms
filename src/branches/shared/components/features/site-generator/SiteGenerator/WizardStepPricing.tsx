'use client'

import React, { useState } from 'react'
import { UserPricingPackage } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Button } from '@/branches/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { X, Plus, DollarSign, Check, Star, Sparkles } from 'lucide-react'
import { Badge } from '@/branches/shared/components/ui/badge'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'

interface Props {
  pricingPackages: UserPricingPackage[]
  onChange: (packages: UserPricingPackage[]) => void
}

export function WizardStepPricing({ pricingPackages, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [newPackage, setNewPackage] = useState<UserPricingPackage>({
    name: '',
    price: '',
    currency: '€',
    period: '/maand',
    description: '',
    features: [],
    ctaText: 'Start nu',
    highlighted: false,
    badge: '',
  })
  const [newFeature, setNewFeature] = useState('')

  const addPackage = () => {
    if (newPackage.name.trim() && newPackage.price.trim() && newPackage.features.length > 0) {
      onChange([...pricingPackages, newPackage])
      setNewPackage({
        name: '',
        price: '',
        currency: '€',
        period: '/maand',
        description: '',
        features: [],
        ctaText: 'Start nu',
        highlighted: false,
        badge: '',
      })
      setIsAdding(false)
    }
  }

  const updatePackage = (index: number, field: keyof UserPricingPackage, value: any) => {
    const updated = pricingPackages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg))
    onChange(updated)
  }

  const removePackage = (index: number) => {
    onChange(pricingPackages.filter((_, i) => i !== index))
  }

  const addFeature = (index: number, feature: string) => {
    if (feature.trim()) {
      const currentPackage = pricingPackages[index]
      const updatedFeatures = [...currentPackage.features, feature.trim()]
      updatePackage(index, 'features', updatedFeatures)
    }
  }

  const removeFeature = (pkgIndex: number, featureIndex: number) => {
    const currentPackage = pricingPackages[pkgIndex]
    const updatedFeatures = currentPackage.features.filter((_, i) => i !== featureIndex)
    updatePackage(pkgIndex, 'features', updatedFeatures)
  }

  const addFeatureToNewPackage = () => {
    if (newFeature.trim()) {
      setNewPackage({
        ...newPackage,
        features: [...newPackage.features, newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const removeFeatureFromNewPackage = (index: number) => {
    setNewPackage({
      ...newPackage,
      features: newPackage.features.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Prijzen & Pakketten
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Voeg je prijspakketten toe. AI genereert professionele beschrijvingen en sales copy voor
          elk pakket.
        </p>
      </div>

      {/* Packages List */}
      <div className="space-y-4">
        {pricingPackages.map((pkg, index) => (
          <Card
            key={index}
            className={`border-l-4 ${
              pkg.highlighted ? 'border-l-green-500 bg-green-50/50' : 'border-l-gray-300'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`pkg-name-${index}`}>Pakket Naam *</Label>
                      <Input
                        id={`pkg-name-${index}`}
                        value={pkg.name}
                        onChange={(e) => updatePackage(index, 'name', e.target.value)}
                        placeholder="bijv. Starter, Pro, Enterprise"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pkg-badge-${index}`}>Badge (optioneel)</Label>
                      <Input
                        id={`pkg-badge-${index}`}
                        value={pkg.badge || ''}
                        onChange={(e) => updatePackage(index, 'badge', e.target.value)}
                        placeholder="bijv. Populair, Beste waarde"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label htmlFor={`pkg-price-${index}`}>Prijs *</Label>
                      <Input
                        id={`pkg-price-${index}`}
                        value={pkg.price}
                        onChange={(e) => updatePackage(index, 'price', e.target.value)}
                        placeholder="49.99"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pkg-currency-${index}`}>Valuta</Label>
                      <Input
                        id={`pkg-currency-${index}`}
                        value={pkg.currency || '€'}
                        onChange={(e) => updatePackage(index, 'currency', e.target.value)}
                        placeholder="€"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pkg-period-${index}`}>Periode</Label>
                      <Input
                        id={`pkg-period-${index}`}
                        value={pkg.period || ''}
                        onChange={(e) => updatePackage(index, 'period', e.target.value)}
                        placeholder="/maand"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pkg-cta-${index}`}>CTA Tekst</Label>
                      <Input
                        id={`pkg-cta-${index}`}
                        value={pkg.ctaText || ''}
                        onChange={(e) => updatePackage(index, 'ctaText', e.target.value)}
                        placeholder="Start nu"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`pkg-highlighted-${index}`}
                      checked={pkg.highlighted}
                      onCheckedChange={(checked) => updatePackage(index, 'highlighted', checked)}
                    />
                    <Label htmlFor={`pkg-highlighted-${index}`} className="cursor-pointer">
                      <Star className="w-4 h-4 inline mr-1" />
                      Markeer als aanbevolen/populair pakket
                    </Label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePackage(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor={`pkg-desc-${index}`}>Beschrijving (optioneel)</Label>
                <Textarea
                  id={`pkg-desc-${index}`}
                  value={pkg.description || ''}
                  onChange={(e) => updatePackage(index, 'description', e.target.value)}
                  placeholder="Korte beschrijving van het pakket"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Features * (minimaal 1)</Label>
                <div className="space-y-2 mt-1">
                  {pkg.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                    >
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index, featureIndex)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Input
                    placeholder="Voeg feature toe en druk Enter..."
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature(index, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  💡 AI zal professionele pakket beschrijvingen en sales copy genereren
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Package */}
      {!isAdding && pricingPackages.length < 6 && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Voeg prijspakket toe {pricingPackages.length > 0 && `(${pricingPackages.length}/6)`}
        </Button>
      )}

      {isAdding && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-lg">Nieuw prijspakket toevoegen</CardTitle>
            <CardDescription>Prijzen zijn optioneel maar helpen bij conversie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-pkg-name">Pakket Naam *</Label>
                <Input
                  id="new-pkg-name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  placeholder="bijv. Starter"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-badge">Badge (optioneel)</Label>
                <Input
                  id="new-pkg-badge"
                  value={newPackage.badge}
                  onChange={(e) => setNewPackage({ ...newPackage, badge: e.target.value })}
                  placeholder="bijv. Populair"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label htmlFor="new-pkg-price">Prijs *</Label>
                <Input
                  id="new-pkg-price"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  placeholder="49.99"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-currency">Valuta</Label>
                <Input
                  id="new-pkg-currency"
                  value={newPackage.currency}
                  onChange={(e) => setNewPackage({ ...newPackage, currency: e.target.value })}
                  placeholder="€"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-period">Periode</Label>
                <Input
                  id="new-pkg-period"
                  value={newPackage.period}
                  onChange={(e) => setNewPackage({ ...newPackage, period: e.target.value })}
                  placeholder="/maand"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-cta">CTA Tekst</Label>
                <Input
                  id="new-pkg-cta"
                  value={newPackage.ctaText}
                  onChange={(e) => setNewPackage({ ...newPackage, ctaText: e.target.value })}
                  placeholder="Start nu"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="new-pkg-highlighted"
                checked={newPackage.highlighted}
                onCheckedChange={(checked) =>
                  setNewPackage({ ...newPackage, highlighted: checked as boolean })
                }
              />
              <Label htmlFor="new-pkg-highlighted" className="cursor-pointer">
                <Star className="w-4 h-4 inline mr-1" />
                Markeer als aanbevolen/populair pakket
              </Label>
            </div>

            <div>
              <Label htmlFor="new-pkg-desc">Beschrijving (optioneel)</Label>
              <Textarea
                id="new-pkg-desc"
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Korte beschrijving"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Features * (minimaal 1)</Label>
              <div className="space-y-2 mt-1">
                {newPackage.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeatureFromNewPackage(featureIndex)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Voeg feature toe..."
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeatureToNewPackage()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addFeatureToNewPackage}
                    disabled={!newFeature.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addPackage}
                disabled={
                  !newPackage.name.trim() || !newPackage.price.trim() || newPackage.features.length === 0
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewPackage({
                    name: '',
                    price: '',
                    currency: '€',
                    period: '/maand',
                    description: '',
                    features: [],
                    ctaText: 'Start nu',
                    highlighted: false,
                    badge: '',
                  })
                  setNewFeature('')
                }}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Message */}
      {pricingPackages.length === 0 && !isAdding && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800">
              <strong>💰 Prijzen & Pakketten zijn optioneel</strong>
              <br />
              Wil je prijzen tonen op je website? Voeg pakketten toe! AI genereert dan:
            </p>
            <ul className="mt-2 text-sm text-green-700 space-y-1 ml-4 list-disc">
              <li>Professionele pakket beschrijvingen</li>
              <li>Verkoop-georiënteerde copy</li>
              <li>Feature vergelijkingen</li>
              <li>Strategische CTA plaatsingen</li>
              <li>Social proof elementen</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
