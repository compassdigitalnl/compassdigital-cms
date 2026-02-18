'use client'

import React from 'react'
import type { ContentSettings, SiteGoal } from '@/lib/siteGenerator/types'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface Props {
  data: ContentSettings
  siteGoal?: SiteGoal
  onChange: (data: ContentSettings) => void
}

// ─── Beschikbare pagina's per site type ──────────────────────────────────────

interface PageOption {
  id: string
  name: string
  description: string
  required?: boolean
}

function getPagesForGoal(siteGoal?: SiteGoal): PageOption[] {
  const primaryType = siteGoal?.primaryType
  const subType = siteGoal?.websiteSubType ?? siteGoal?.hybridWebsiteType

  // Altijd: home (verplicht)
  const home: PageOption = {
    id: 'home',
    name: 'Home',
    description: 'Hoofdpagina met hero, highlights en call-to-action',
    required: true,
  }

  // Webshop-only: shop-pagina's zijn automatisch, geen losse wizard-pagina's
  if (primaryType === 'webshop') {
    return [
      home,
      { id: 'about', name: 'Over ons', description: 'Bedrijfsverhaal, missie en team' },
      { id: 'blog', name: 'Blog', description: 'Nieuws, tips en kennisdeling' },
      { id: 'contact', name: 'Contact', description: 'Contactformulier en bedrijfsinformatie' },
    ]
  }

  // Website corporate / hybrid corporate
  if (!primaryType || primaryType === 'website' && (!subType || subType === 'corporate' || subType === 'landing')) {
    if (subType === 'landing') {
      return [home] // Landing page = enkel homepage
    }
    return [
      home,
      { id: 'about', name: 'Over ons', description: 'Bedrijfsverhaal, missie en kernwaarden' },
      { id: 'services', name: 'Diensten', description: 'Overzicht van uw diensten of producten' },
      { id: 'testimonials', name: 'Referenties', description: 'Klantbeoordelingen en succesverhalen' },
      { id: 'pricing', name: 'Prijzen', description: 'Prijspakketten en abonnementen' },
      { id: 'blog', name: 'Blog', description: 'Nieuws en kennisdeling' },
      { id: 'contact', name: 'Contact', description: 'Contactformulier en bedrijfsinformatie' },
    ]
  }

  // Portfolio
  if (primaryType === 'website' && subType === 'portfolio') {
    return [
      home,
      { id: 'about', name: 'Over mij / ons', description: 'Achtergrond, vaardigheden en missie' },
      { id: 'portfolio', name: 'Portfolio', description: 'Showcase van projecten en cases' },
      { id: 'services', name: 'Diensten', description: 'Wat u aanbiedt' },
      { id: 'testimonials', name: 'Referenties', description: 'Wat klanten over u zeggen' },
      { id: 'contact', name: 'Contact', description: 'Contactformulier en beschikbaarheid' },
    ]
  }

  // Agency
  if (primaryType === 'website' && subType === 'agency') {
    return [
      home,
      { id: 'about', name: 'Over ons', description: 'Team, missie en werkwijze' },
      { id: 'services', name: 'Diensten', description: 'Wat het bureau aanbiedt' },
      { id: 'portfolio', name: 'Cases', description: 'Projecten en resultaten voor klanten' },
      { id: 'testimonials', name: 'Referenties', description: 'Klantbeoordelingen' },
      { id: 'blog', name: 'Blog', description: 'Inzichten, trends en nieuws' },
      { id: 'contact', name: 'Contact', description: 'Contactformulier en kantoorlocatie' },
    ]
  }

  // Blog / Magazine
  if (primaryType === 'website' && subType === 'blog') {
    return [
      home,
      { id: 'about', name: 'Over de auteur', description: 'Wie schrijft hier en waarom' },
      { id: 'blog', name: 'Blog', description: 'Alle artikelen en categorieën' },
      { id: 'contact', name: 'Contact', description: 'Bereikbaarheid en samenwerking' },
    ]
  }

  // Hybrid: combinatie van website + webshop pagina's
  if (primaryType === 'hybrid') {
    return [
      home,
      { id: 'about', name: 'Over ons', description: 'Bedrijfsverhaal en missie' },
      { id: 'services', name: 'Diensten', description: 'Aanvullende diensten naast de shop' },
      { id: 'testimonials', name: 'Referenties', description: 'Klantbeoordelingen' },
      { id: 'blog', name: 'Blog', description: 'Nieuws en kennisdeling' },
      { id: 'contact', name: 'Contact', description: 'Contactformulier en adresgegevens' },
    ]
  }

  // Fallback: brede set
  return [
    home,
    { id: 'about', name: 'Over ons', description: 'Bedrijfsinformatie en missie' },
    { id: 'services', name: 'Diensten', description: 'Overzicht van uw diensten' },
    { id: 'portfolio', name: 'Portfolio', description: 'Projecten en cases' },
    { id: 'testimonials', name: 'Referenties', description: 'Klantbeoordelingen' },
    { id: 'pricing', name: 'Prijzen', description: 'Prijspakketten' },
    { id: 'blog', name: 'Blog', description: 'Nieuws en updates' },
    { id: 'contact', name: 'Contact', description: 'Contactformulier' },
  ]
}

// ─── Tonen en toon-opties ─────────────────────────────────────────────────────

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
  { value: 'professional', label: 'Professioneel', description: 'Zakelijk en formeel' },
  { value: 'casual', label: 'Casual', description: 'Informeel en toegankelijk' },
  { value: 'friendly', label: 'Vriendelijk', description: 'Warm en persoonlijk' },
  { value: 'authoritative', label: 'Autoriteit', description: 'Expert en gezaghebbend' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WizardStep3Content({ data, siteGoal, onChange }: Props) {
  const availablePages = getPagesForGoal(siteGoal)

  const togglePage = (pageId: string) => {
    const page = availablePages.find((p) => p.id === pageId)
    if (!page || page.required) return

    const newPages = data.pages.includes(pageId)
      ? data.pages.filter((p) => p !== pageId)
      : [...data.pages, pageId]

    onChange({ ...data, pages: newPages })
  }

  // Zorg dat verplichte pagina's altijd aan staan
  const ensureRequiredPages = () => {
    const required = availablePages.filter((p) => p.required).map((p) => p.id)
    const missing = required.filter((r) => !data.pages.includes(r))
    if (missing.length > 0) {
      onChange({ ...data, pages: [...data.pages, ...missing] })
    }
  }

  // Sync verplichte pagina's bij mount / bij wijziging siteGoal
  React.useEffect(() => {
    ensureRequiredPages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteGoal?.primaryType, siteGoal?.websiteSubType])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg shadow-green-500/30">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pagina&apos;s & Taal</h2>
            <p className="text-sm text-gray-500 font-medium">Stap 3</p>
          </div>
        </div>
      </div>

      {/* Taal */}
      <div className="space-y-2">
        <Label htmlFor="language">Taal van de website</Label>
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
        <p className="text-xs text-gray-500">Alle content wordt in deze taal gegenereerd</p>
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

      {/* Pagina's */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Pagina&apos;s</Label>
          <Badge variant="secondary">{data.pages.length} geselecteerd</Badge>
        </div>
        <div className="space-y-2">
          {availablePages.map((page) => {
            const isChecked = data.pages.includes(page.id)
            return (
              <div
                key={page.id}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${page.required ? 'opacity-100' : 'cursor-pointer'}`}
                onClick={() => togglePage(page.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isChecked}
                    disabled={page.required}
                    onCheckedChange={() => togglePage(page.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{page.name}</h3>
                      {page.required && (
                        <Badge variant="default" className="text-xs">Verplicht</Badge>
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
          {siteGoal?.primaryType === 'webshop'
            ? 'Shop-pagina\'s (product listing, detail, cart, checkout) worden automatisch aangemaakt.'
            : 'Home is verplicht. Meer pagina\'s = langere generatietijd.'}
        </p>
      </div>
    </div>
  )
}
