'use client'

import React, { useState } from 'react'
import { CompanyInfo } from '@/lib/siteGenerator/types'
import { Label } from '@/branches/shared/components/ui/label'
import { Input } from '@/branches/shared/components/ui/input'
import { Textarea } from '@/branches/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/branches/shared/components/ui/select'
import { Button } from '@/branches/shared/components/ui/button'
import { Badge } from '@/branches/shared/components/ui/badge'
import { X, Plus } from 'lucide-react'

interface Props {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
}

export function WizardStep1Company({ data, onChange }: Props) {
  const [newCoreValue, setNewCoreValue] = useState('')
  const [newUSP, setNewUSP] = useState('')

  const addCoreValue = () => {
    if (newCoreValue.trim() && data.coreValues.length < 5) {
      onChange({ ...data, coreValues: [...data.coreValues, newCoreValue.trim()] })
      setNewCoreValue('')
    }
  }

  const removeCoreValue = (index: number) => {
    onChange({
      ...data,
      coreValues: data.coreValues.filter((_, i) => i !== index),
    })
  }

  const addUSP = () => {
    if (newUSP.trim() && data.usps.length < 5) {
      onChange({ ...data, usps: [...data.usps, newUSP.trim()] })
      setNewUSP('')
    }
  }

  const removeUSP = (index: number) => {
    onChange({
      ...data,
      usps: data.usps.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-8">
      {/* Modern section header with gradient accent */}
      <div className="space-y-3 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bedrijfsinformatie</h2>
            <p className="text-sm text-gray-500 font-medium">Stap 1 van 5</p>
          </div>
        </div>
        <p className="text-base text-gray-600 pl-15">
          Vertel ons over uw bedrijf om gepersonaliseerde content te genereren
        </p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="company-name">
          Bedrijfsnaam <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          placeholder="Bijvoorbeeld: WebDev Pro"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          required
        />
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <Label htmlFor="business-type">
          Type bedrijf <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.businessType}
          onValueChange={(value) =>
            onChange({ ...data, businessType: value as CompanyInfo['businessType'] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer type bedrijf" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="B2B">B2B (Business-to-Business)</SelectItem>
            <SelectItem value="B2C">B2C (Business-to-Consumer)</SelectItem>
            <SelectItem value="Non-profit">Non-profit</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry">
          Industrie <span className="text-red-500">*</span>
        </Label>
        <Input
          id="industry"
          placeholder="Bijvoorbeeld: Technology, Healthcare, Education, etc."
          value={data.industry}
          onChange={(e) => onChange({ ...data, industry: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500 font-medium mt-1.5">
          Dit helpt ons bij het genereren van relevante content en voorbeelden
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="target-audience">Doelgroep</Label>
        <Textarea
          id="target-audience"
          placeholder="Bijvoorbeeld: Kleine tot middelgrote bedrijven die hun online aanwezigheid willen verbeteren..."
          value={data.targetAudience}
          onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
          rows={3}
        />
      </div>

      {/* Core Values */}
      <div className="space-y-3">
        <Label>
          Kernwaarden ({data.coreValues.length}/5)
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Bijvoorbeeld: Innovatie, Kwaliteit, Betrouwbaarheid"
            value={newCoreValue}
            onChange={(e) => setNewCoreValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCoreValue()
              }
            }}
          />
          <Button
            type="button"
            onClick={addCoreValue}
            disabled={!newCoreValue.trim() || data.coreValues.length >= 5}
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.coreValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.coreValues.map((value, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                {value}
                <button
                  onClick={() => removeCoreValue(index)}
                  className="ml-2 hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 font-medium mt-1.5">
          Voeg 3-5 kernwaarden toe die uw bedrijf definiëren
        </p>
      </div>

      {/* USPs */}
      <div className="space-y-3">
        <Label>
          Unique Selling Points ({data.usps.length}/5)
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Bijvoorbeeld: 24/7 support, No-code oplossing, etc."
            value={newUSP}
            onChange={(e) => setNewUSP(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUSP()
              }
            }}
          />
          <Button
            type="button"
            onClick={addUSP}
            disabled={!newUSP.trim() || data.usps.length >= 5}
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.usps.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.usps.map((usp, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 font-medium bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                {usp}
                <button onClick={() => removeUSP(index)} className="ml-2 hover:text-red-600 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 font-medium mt-1.5">
          Wat maakt uw bedrijf uniek? Voeg 3-5 USPs toe
        </p>
      </div>
    </div>
  )
}
