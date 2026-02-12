'use client'

import React from 'react'
import { DesignPreferences } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'

interface Props {
  data: DesignPreferences
  onChange: (data: DesignPreferences) => void
}

export function WizardStep2Design({ data, onChange }: Props) {
  const designStyles = [
    {
      value: 'modern',
      label: 'Modern',
      description: 'Strak, minimalistisch met veel wit en heldere kleuren',
      preview: 'bg-gradient-to-br from-blue-50 to-white',
    },
    {
      value: 'classic',
      label: 'Classic',
      description: 'Tijdloos design met serif fonts en subtiele kleuren',
      preview: 'bg-gradient-to-br from-gray-100 to-gray-50',
    },
    {
      value: 'minimalist',
      label: 'Minimalist',
      description: 'Focus op content, zeer weinig visuele elementen',
      preview: 'bg-white border-2 border-gray-200',
    },
    {
      value: 'bold',
      label: 'Bold',
      description: 'Opvallende kleuren en grote typography',
      preview: 'bg-gradient-to-br from-purple-100 to-pink-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🎨 Design Voorkeuren</h2>
        <p className="mt-1 text-sm text-gray-600">
          Kies de visuele stijl voor uw website
        </p>
      </div>

      {/* Color Scheme */}
      <div className="space-y-4">
        <Label>Kleurenschema</Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color" className="text-xs">
              Primaire kleur
            </Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={data.colorScheme.primary}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, primary: e.target.value },
                  })
                }
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={data.colorScheme.primary}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, primary: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color" className="text-xs">
              Secundaire kleur
            </Label>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={data.colorScheme.secondary}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, secondary: e.target.value },
                  })
                }
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={data.colorScheme.secondary}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, secondary: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent-color" className="text-xs">
              Accent kleur
            </Label>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="color"
                value={data.colorScheme.accent}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, accent: e.target.value },
                  })
                }
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={data.colorScheme.accent}
                onChange={(e) =>
                  onChange({
                    ...data,
                    colorScheme: { ...data.colorScheme, accent: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-3">Preview:</p>
          <div className="flex gap-2">
            <div
              className="w-20 h-20 rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: data.colorScheme.primary }}
            />
            <div
              className="w-20 h-20 rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: data.colorScheme.secondary }}
            />
            <div
              className="w-20 h-20 rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: data.colorScheme.accent }}
            />
          </div>
        </div>
      </div>

      {/* Design Style */}
      <div className="space-y-3">
        <Label>Design Stijl</Label>
        <div className="grid grid-cols-2 gap-4">
          {designStyles.map((style) => (
            <Card
              key={style.value}
              className={`p-4 cursor-pointer transition-all border-2 ${
                data.style === style.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() =>
                onChange({ ...data, style: style.value as DesignPreferences['style'] })
              }
            >
              <div className={`w-full h-24 rounded mb-3 ${style.preview}`} />
              <h3 className="font-semibold text-sm">{style.label}</h3>
              <p className="text-xs text-gray-600 mt-1">{style.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Logo (optioneel)</Label>
        <Input
          id="logo"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onChange({ ...data, logo: file })
            }
          }}
          className="cursor-pointer"
        />
        <p className="text-xs text-gray-500">
          Upload uw logo als PNG, JPG of SVG (optioneel - kan later ook nog)
        </p>
      </div>

      {/* Font Preference */}
      <div className="space-y-2">
        <Label htmlFor="font-preference">Font Voorkeur</Label>
        <Select
          value={data.fontPreference}
          onValueChange={(value) =>
            onChange({ ...data, fontPreference: value as DesignPreferences['fontPreference'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans-serif">
              <span className="font-sans">Sans-serif (Modern, schoon)</span>
            </SelectItem>
            <SelectItem value="serif">
              <span className="font-serif">Serif (Klassiek, formeel)</span>
            </SelectItem>
            <SelectItem value="monospace">
              <span className="font-mono">Monospace (Tech, coding)</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
