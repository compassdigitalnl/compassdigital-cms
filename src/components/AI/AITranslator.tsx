'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ContentLanguage, TranslationResult } from '@/lib/ai/types'

interface AITranslatorProps {
  content: string
  sourceLanguage?: ContentLanguage | 'auto'
  onAccept?: (translation: TranslationResult, targetLanguage: ContentLanguage) => void
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

export const AITranslator: React.FC<AITranslatorProps> = ({
  content,
  sourceLanguage = 'auto',
  onAccept,
  variant = 'secondary',
  size = 'sm',
  buttonText = 'Vertalen',
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState<ContentLanguage>('en')
  const [tone, setTone] = useState<string>('preserve')
  const [formality, setFormality] = useState<string>('preserve')
  const [translation, setTranslation] = useState<TranslationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!content.trim()) {
      setError('Geen content om te vertalen')
      return
    }

    setLoading(true)
    setError(null)
    setTranslation(null)

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetLanguage,
          sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
          tone: tone === 'preserve' ? undefined : tone,
          formality: formality === 'preserve' ? undefined : formality,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Vertaling mislukt')
      }

      setTranslation(data.translation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (translation && onAccept) {
      onAccept(translation, targetLanguage)
    }
    setOpen(false)
    setTranslation(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          🌐 {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Vertaling</DialogTitle>
          <DialogDescription>
            Vertaal content naar andere talen met behoud van betekenis en tone
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Doeltaal</label>
              <Select value={targetLanguage} onValueChange={(val) => setTargetLanguage(val as ContentLanguage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Toon</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preserve">Behouden</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Formaliteit</label>
              <Select value={formality} onValueChange={setFormality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preserve">Behouden</SelectItem>
                  <SelectItem value="formal">Formeel</SelectItem>
                  <SelectItem value="neutral">Neutraal</SelectItem>
                  <SelectItem value="informal">Informeel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={loading || !content.trim()}
            className="w-full"
          >
            {loading ? 'Vertalen...' : 'Vertaal Naar ' + LANGUAGES.find(l => l.code === targetLanguage)?.name}
          </Button>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {translation && !loading && (
            <div className="space-y-4">
              {/* Info Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Gedetecteerd: {translation.detectedSourceLanguage.toUpperCase()}
                </Badge>
                <Badge variant={translation.confidence >= 90 ? 'default' : 'secondary'}>
                  Betrouwbaarheid: {translation.confidence}%
                </Badge>
              </div>

              {/* Tabs for Original vs Translation */}
              <Tabs defaultValue="translation" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Origineel</TabsTrigger>
                  <TabsTrigger value="translation">Vertaling</TabsTrigger>
                </TabsList>

                <TabsContent value="original" className="mt-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                  </div>
                </TabsContent>

                <TabsContent value="translation" className="mt-4">
                  <div className="rounded-lg border border-green-200 p-4 bg-green-50">
                    <p className="text-sm whitespace-pre-wrap">{translation.translatedText}</p>
                  </div>

                  {/* Notes */}
                  {translation.notes && translation.notes.length > 0 && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
                      <h4 className="font-medium text-sm mb-2">Notities:</h4>
                      <ul className="text-sm space-y-1">
                        {translation.notes.map((note, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTranslation(null)
                    setError(null)
                  }}
                >
                  Opnieuw
                </Button>
                {onAccept && (
                  <Button onClick={handleAccept}>
                    Accepteer Vertaling
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Vertalen naar {LANGUAGES.find(l => l.code === targetLanguage)?.name}...</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Quick translate button for inline usage
 */
export const AIQuickTranslate: React.FC<{
  content: string
  targetLanguage: ContentLanguage
  onTranslate: (translation: string) => void
}> = ({ content, targetLanguage, onTranslate }) => {
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetLanguage,
        }),
      })

      const data = await response.json()

      if (response.ok && data.translation) {
        onTranslate(data.translation.translatedText)
      }
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const lang = LANGUAGES.find(l => l.code === targetLanguage)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleTranslate}
      disabled={loading}
    >
      {loading ? '...' : `${lang?.flag} ${lang?.name}`}
    </Button>
  )
}
