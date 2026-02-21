'use client'

import React, { useState } from 'react'
import { UserService } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Button } from '@/branches/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { X, Plus, Briefcase } from 'lucide-react'

interface Props {
  services: UserService[]
  onChange: (services: UserService[]) => void
}

export function WizardStepServices({ services, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [newService, setNewService] = useState<UserService>({
    name: '',
    description: '',
  })

  const addService = () => {
    if (newService.name.trim()) {
      onChange([...services, newService])
      setNewService({ name: '', description: '' })
      setIsAdding(false)
    }
  }

  const updateService = (index: number, field: keyof UserService, value: string) => {
    const updated = services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    )
    onChange(updated)
  }

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Diensten & Producten
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Voeg de diensten of producten toe die je aanbiedt. AI zal volledige beschrijvingen
          genereren met SEO-optimalisatie.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Label htmlFor={`service-name-${index}`}>Naam van dienst *</Label>
                  <Input
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    placeholder="bijv. Webdesign, SEO Optimalisatie, etc."
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Label htmlFor={`service-desc-${index}`}>
                Korte beschrijving (optioneel)
              </Label>
              <Textarea
                id={`service-desc-${index}`}
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                placeholder="Optioneel: Geef een korte beschrijving (1-2 zinnen). AI vult dit aan met volledige content..."
                rows={2}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: Als je dit leeg laat, genereert AI een complete beschrijving op basis
                van de naam
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Service */}
      {!isAdding && services.length < 12 && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Voeg dienst toe {services.length > 0 && `(${services.length}/12)`}
        </Button>
      )}

      {isAdding && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Nieuwe dienst toevoegen</CardTitle>
            <CardDescription>Minimaal 1 dienst is verplicht</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-service-name">Naam van dienst *</Label>
              <Input
                id="new-service-name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="bijv. Webdesign"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-service-desc">Korte beschrijving (optioneel)</Label>
              <Textarea
                id="new-service-desc"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Moderne, responsieve websites..."
                rows={2}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addService} disabled={!newService.name.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewService({ name: '', description: '' })
                }}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Message */}
      {services.length === 0 && !isAdding && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Hoe werkt dit?</strong>
              <br />
              Voeg minimaal 1 dienst toe. AI genereert dan automatisch:
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
              <li>Volledige beschrijvingen (200-300 woorden)</li>
              <li>SEO-geoptimaliseerde teksten</li>
              <li>Call-to-action per dienst</li>
              <li>Professionele tone of voice</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
