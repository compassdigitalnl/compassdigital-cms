'use client'

/**
 * AI Content Generator Component
 * Advanced component for AI-powered content generation with multiple options
 */

import React, { useState } from 'react'
import { Sparkles, Loader2, RefreshCw, Copy, Check, History, Settings2 } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/branches/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/branches/shared/components/ui/select'
import { cn } from '@/utilities/cn'

interface ContentGenerationOptions {
  prompt: string
  context?: string
  tone?: string
  language?: string
  maxTokens?: number
  temperature?: number
}

interface AIContentGeneratorProps {
  /** Field name/ID */
  fieldName: string
  /** Field label shown in modal */
  fieldLabel: string
  /** Current field value */
  value?: string
  /** Callback when content is accepted */
  onAccept: (content: string) => void
  /** Optional prompt placeholder */
  promptPlaceholder?: string
  /** Optional context to include in generation */
  context?: Record<string, any>
  /** Default tone selection */
  defaultTone?: string
  /** Default language */
  defaultLanguage?: string
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Custom button text */
  buttonText?: string
}

const TONES = [
  { value: 'professional', label: 'Professioneel' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Vriendelijk' },
  { value: 'persuasive', label: 'Overtuigend' },
  { value: 'formal', label: 'Formeel' },
  { value: 'enthusiastic', label: 'Enthousiast' },
]

const LANGUAGES = [
  { value: 'nl', label: 'Nederlands' },
  { value: 'en', label: 'Engels' },
  { value: 'de', label: 'Duits' },
  { value: 'fr', label: 'Frans' },
  { value: 'es', label: 'Spaans' },
]

const MAX_TOKENS_OPTIONS = [
  { value: 500, label: 'Kort (500)' },
  { value: 1000, label: 'Normaal (1000)' },
  { value: 2000, label: 'Lang (2000)' },
  { value: 4000, label: 'Zeer lang (4000)' },
]

const TEMPERATURE_OPTIONS = [
  { value: 0.3, label: 'Conservatief' },
  { value: 0.7, label: 'Gebalanceerd' },
  { value: 1.0, label: 'Creatief' },
  { value: 1.5, label: 'Zeer creatief' },
]

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  fieldName,
  fieldLabel,
  value = '',
  onAccept,
  promptPlaceholder = 'Beschrijf wat je wilt genereren...',
  context,
  defaultTone = 'professional',
  defaultLanguage = 'nl',
  variant = 'secondary',
  size = 'sm',
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState(defaultTone)
  const [language, setLanguage] = useState(defaultLanguage)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [temperature, setTemperature] = useState(0.7)
  const [generatedContent, setGeneratedContent] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleOpen = () => {
    setPrompt(value || '')
    setGeneratedContent('')
    setEditedContent('')
    setError('')
    setIsOpen(true)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Voer een prompt in')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedContent('')

    try {
      const options: ContentGenerationOptions = {
        prompt,
        tone,
        language,
        maxTokens,
        temperature,
      }

      if (context) {
        options.context = JSON.stringify(context)
      }

      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })

      const result = await response.json()

      if (result.success && result.content) {
        setGeneratedContent(result.content)
        setEditedContent(result.content)
        setHistory((prev) => [result.content, ...prev.slice(0, 9)]) // Keep last 10
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAccept = () => {
    onAccept(editedContent)
    setIsOpen(false)
  }

  const handleUseFromHistory = (content: string) => {
    setEditedContent(content)
    setGeneratedContent(content)
    setShowHistory(false)
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        variant={variant === 'primary' ? 'default' : variant === 'secondary' ? 'outline' : 'ghost'}
        size={size}
        className={cn('gap-2')}
      >
        <Sparkles className="size-4" />
        {buttonText || 'AI Genereren'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>AI Content Generator: {fieldLabel}</DialogTitle>
            <DialogDescription>
              Gebruik AI om hoogwaardige content te genereren voor dit veld
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={promptPlaceholder}
                className="w-full min-h-[100px] p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                disabled={loading}
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Taal</label>
                <Select value={language} onValueChange={setLanguage} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Settings2 className="size-4" />
              {showAdvanced ? 'Verberg' : 'Toon'} geavanceerde opties
            </Button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lengte</label>
                  <Select
                    value={maxTokens.toString()}
                    onValueChange={(v) => setMaxTokens(Number(v))}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MAX_TOKENS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Creativiteit</label>
                  <Select
                    value={temperature.toString()}
                    onValueChange={(v) => setTemperature(Number(v))}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPERATURE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Genereer Content
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                <p className="text-sm text-destructive font-medium">Error:</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gegenereerde Content</label>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="gap-1"
                      >
                        <History className="size-4" />
                        Geschiedenis ({history.length})
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={loading}
                      className="gap-1"
                    >
                      <RefreshCw className="size-4" />
                      Regenereer
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="size-4" />
                          Gekopieerd!
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Kopieer
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* History Dropdown */}
                {showHistory && history.length > 0 && (
                  <div className="p-3 border rounded-md bg-muted/30 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Klik op een item om het te gebruiken:
                    </p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {history.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleUseFromHistory(item)}
                          className="w-full text-left p-2 text-sm border rounded hover:bg-muted/50 transition-colors line-clamp-2"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[200px] p-4 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-y font-mono text-sm"
                  placeholder="Gegenereerde content verschijnt hier..."
                />
                <p className="text-xs text-muted-foreground">
                  Je kunt de content bewerken voordat je deze accepteert
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuleer
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={!editedContent || loading}
              className="gap-2"
            >
              <Check className="size-4" />
              Accepteer & Gebruik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
