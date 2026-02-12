'use client'

import React from 'react'
import { ContentSettings } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface Props {
  data: ContentSettings
  onChange: (data: ContentSettings) => void
}

export function WizardStep3Content({ data, onChange }: Props) {
  const languages = [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ]

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Zakelijk en formeel' },
    { value: 'casual', label: 'Casual', description: 'Informeel en toegankelijk' },
    { value: 'friendly', label: 'Friendly', description: 'Warm en persoonlijk' },
    { value: 'authoritative', label: 'Authoritative', description: 'Expert en gezaghebbend' },
  ]

  const pages = [
    {
      id: 'home',
      name: 'Home',
      description: 'Hoofdpagina met hero, features, en CTA',
      required: true,
    },
    {
      id: 'about',
      name: 'Over Ons',
      description: 'Bedrijfsverhaal, missie, en kernwaarden',
      required: false,
    },
    {
      id: 'services',
      name: 'Diensten',
      description: 'Overzicht van uw producten of diensten',
      required: false,
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase van uw werk en projecten',
      required: false,
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      description: 'Klantbeoordelingen en verhalen',
      required: false,
    },
    {
      id: 'pricing',
      name: 'Prijzen',
      description: 'Prijspakketten en abonnementen',
      required: false,
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Blogpagina met artikelen',
      required: false,
    },
    {
      id: 'contact',
      name: 'Contact',
      description: 'Contactformulier en bedrijfsinformatie',
      required: false,
    },
  ]

  const togglePage = (pageId: string) => {
    if (pageId === 'home') return // Home is required

    const newPages = data.pages.includes(pageId)
      ? data.pages.filter((p) => p !== pageId)
      : [...data.pages, pageId]

    onChange({ ...data, pages: newPages })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📝 Content Instellingen</h2>
        <p className="mt-1 text-sm text-gray-600">
          Kies de taal, toon en pagina's voor uw website
        </p>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Taal</Label>
        <Select
          value={data.language}
          onValueChange={(value) =>
            onChange({ ...data, language: value as ContentSettings['language'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Alle content wordt in deze taal gegenereerd
        </p>
      </div>

      {/* Tone of Voice */}
      <div className="space-y-3">
        <Label>Tone of Voice</Label>
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <div
              key={tone.value}
              onClick={() =>
                onChange({ ...data, tone: tone.value as ContentSettings['tone'] })
              }
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.tone === tone.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-sm">{tone.label}</h3>
              <p className="text-xs text-gray-600 mt-1">{tone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pages to Generate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Pagina's om te genereren</Label>
          <Badge variant="secondary">{data.pages.length} geselecteerd</Badge>
        </div>
        <div className="space-y-3">
          {pages.map((page) => {
            const isChecked = data.pages.includes(page.id)
            return (
              <div
                key={page.id}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${page.required ? 'opacity-100' : 'cursor-pointer'}`}
                onClick={() => !page.required && togglePage(page.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isChecked}
                    disabled={page.required}
                    onCheckedChange={() => !page.required && togglePage(page.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{page.name}</h3>
                      {page.required && (
                        <Badge variant="default" className="text-xs">
                          Verplicht
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{page.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-500">
          Selecteer minimaal de Home pagina (verplicht). Meer pagina's = langere generatietijd.
        </p>
      </div>
    </div>
  )
}
