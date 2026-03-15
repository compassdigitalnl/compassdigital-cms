'use client'

import React, { useState } from 'react'
import { Button } from '@/branches/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/branches/shared/components/ui/dialog'
import { Badge } from '@/branches/shared/components/ui/badge'
import { Checkbox } from '@/branches/shared/components/ui/checkbox'
import type { ContentLanguage, MultiLanguageContent } from '@/features/ai/lib/types'

interface AIMultiLanguageProps {
  content: string
  onAccept?: (multiLangContent: MultiLanguageContent) => void
  preselectedLanguages?: ContentLanguage[]
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  buttonText?: string
}

const LANGUAGES = [
  { code: 'nl' as ContentLanguage, name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en' as ContentLanguage, name: 'English', flag: '🇬🇧' },
  { code: 'de' as ContentLanguage, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr' as ContentLanguage, name: 'Français', flag: '🇫🇷' },
  { code: 'es' as ContentLanguage, name: 'Español', flag: '🇪🇸' },
  { code: 'it' as ContentLanguage, name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt' as ContentLanguage, name: 'Português', flag: '🇵🇹' },
]

export const AIMultiLanguage: React.FC<AIMultiLanguageProps> = ({
  content,
  onAccept,
  preselectedLanguages = ['en', 'de'],
  variant = 'secondary',
  size = 'sm',
  buttonText = 'Multi-taal Vertaling',
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<ContentLanguage[]>(preselectedLanguages)
  const [multiLangContent, setMultiLangContent] = useState<MultiLanguageContent | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleLanguage = (lang: ContentLanguage) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    )
  }

  const handleTranslate = async () => {
    if (selectedLanguages.length === 0) {
      setError('Selecteer minimaal één taal')
      return
    }

    setLoading(true)
    setError(null)
    setMultiLangContent(null)

    try {
      const response = await fetch('/api/ai/translate-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetLanguages: selectedLanguages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Vertaling mislukt')
      }

      setMultiLangContent(data.multiLangContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (multiLangContent && onAccept) {
      onAccept(multiLangContent)
    }
    setOpen(false)
    setMultiLangContent(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          🌍 {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Multi-taal Vertaling</DialogTitle>
          <DialogDescription>
            Vertaal content naar meerdere talen tegelijk
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <h3 className="font-medium mb-3">Selecteer talen:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedLanguages.includes(lang.code)
                      ? 'border-teal bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleLanguage(lang.code)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedLanguages.includes(lang.code)}
                      onCheckedChange={() => toggleLanguage(lang.code)}
                    />
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedLanguages.length} {selectedLanguages.length === 1 ? 'taal' : 'talen'} geselecteerd
            </p>
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={loading || selectedLanguages.length === 0 || !content.trim()}
            className="w-full"
          >
            {loading ? 'Vertalen...' : `Vertaal naar ${selectedLanguages.length} ${selectedLanguages.length === 1 ? 'taal' : 'talen'}`}
          </Button>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-coral-50 p-4 border border-coral/20">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {multiLangContent && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Vertalingen:</h3>
                <Badge variant="default">
                  {Object.keys(multiLangContent.translations).length} talen
                </Badge>
              </div>

              {/* Original */}
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Origineel</Badge>
                </div>
                <p className="text-sm whitespace-pre-wrap">{multiLangContent.original}</p>
              </div>

              {/* Translations */}
              {Object.entries(multiLangContent.translations).map(([langCode, translation]) => {
                const lang = LANGUAGES.find(l => l.code === langCode)
                return (
                  <div
                    key={langCode}
                    className="rounded-lg border border-green/20 p-4 bg-green-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{lang?.flag}</span>
                      <Badge variant="outline">{lang?.name}</Badge>
                      <Badge variant={translation.confidence >= 90 ? 'default' : 'secondary'}>
                        {translation.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{translation.text}</p>
                  </div>
                )
              })}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMultiLangContent(null)
                    setError(null)
                  }}
                >
                  Opnieuw
                </Button>
                {onAccept && (
                  <Button onClick={handleAccept}>
                    Accepteer Alle Vertalingen
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  Vertalen naar {selectedLanguages.length} {selectedLanguages.length === 1 ? 'taal' : 'talen'}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dit kan 5-15 seconden duren
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
