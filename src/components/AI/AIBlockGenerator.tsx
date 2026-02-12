'use client'

/**
 * AI Block Generator Component
 * Generates complete block content based on block type and context
 */

import React, { useState } from 'react'
import { Sparkles, Loader2, RefreshCw, Copy, Check, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/cn'

interface BlockGenerationOptions {
  blockType: string
  context?: Record<string, any>
  businessInfo?: {
    name?: string
    industry?: string
    targetAudience?: string
    tone?: string
  }
  language?: string
}

interface AIBlockGeneratorProps {
  /** Block type (hero, services, faq, etc.) */
  blockType: string
  /** Block display name */
  blockLabel: string
  /** Callback when block content is generated */
  onGenerate: (blockData: any) => void
  /** Optional business context */
  businessInfo?: {
    name?: string
    industry?: string
    targetAudience?: string
  }
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Custom button text */
  buttonText?: string
}

const BLOCK_TEMPLATES = {
  hero: {
    name: 'Hero',
    description: 'Genereer een krachtige hero sectie met titel, subtekst en CTA\'s',
    fields: ['title', 'subtitle', 'primaryCTA', 'secondaryCTA'],
  },
  services: {
    name: 'Diensten',
    description: 'Genereer een diensten sectie met meerdere items',
    fields: ['heading', 'intro', 'services[]'],
  },
  faq: {
    name: 'FAQ',
    description: 'Genereer veelgestelde vragen met antwoorden',
    fields: ['heading', 'items[]'],
  },
  testimonials: {
    name: 'Testimonials',
    description: 'Genereer klantreviews en testimonials',
    fields: ['heading', 'items[]'],
  },
  cta: {
    name: 'Call to Action',
    description: 'Genereer een overtuigende CTA sectie',
    fields: ['heading', 'text', 'button'],
  },
  content: {
    name: 'Content',
    description: 'Genereer rijke content met tekst en media',
    fields: ['heading', 'content'],
  },
  pricing: {
    name: 'Pricing',
    description: 'Genereer prijstabel met pakketten',
    fields: ['heading', 'plans[]'],
  },
  team: {
    name: 'Team',
    description: 'Genereer team member informatie',
    fields: ['heading', 'members[]'],
  },
}

const GENERATION_MODES = [
  { value: 'full', label: 'Volledige Block', description: 'Genereer alle velden' },
  { value: 'structure', label: 'Alleen Structuur', description: 'Genereer placeholder tekst' },
  { value: 'smart', label: 'Smart Fill', description: 'Gebruik context voor realistische content' },
]

export const AIBlockGenerator: React.FC<AIBlockGeneratorProps> = ({
  blockType,
  blockLabel,
  onGenerate,
  businessInfo,
  variant = 'default',
  size = 'default',
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'full' | 'structure' | 'smart'>('smart')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedData, setGeneratedData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const template = BLOCK_TEMPLATES[blockType as keyof typeof BLOCK_TEMPLATES]

  const handleOpen = () => {
    setGeneratedData(null)
    setError('')
    setCustomPrompt('')
    setIsOpen(true)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setGeneratedData(null)

    try {
      const response = await fetch('/api/ai/generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType,
          mode,
          customPrompt,
          businessInfo,
          language: 'nl',
        }),
      })

      const result = await response.json()

      if (result.success && result.blockData) {
        setGeneratedData(result.blockData)
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (generatedData) {
      onGenerate(generatedData)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        variant={variant}
        size={size}
        className={cn('gap-2')}
      >
        <Wand2 className="size-4" />
        {buttonText || `Genereer ${blockLabel}`}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>AI Block Generator: {blockLabel}</DialogTitle>
            <DialogDescription>
              {template?.description || 'Genereer block content met AI'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Generation Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Generatie Modus</label>
              <Select value={mode} onValueChange={(v: any) => setMode(v)} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENERATION_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Context (if provided) */}
            {businessInfo && (
              <div className="p-3 bg-muted/50 rounded-md space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Business Context:</p>
                {businessInfo.name && (
                  <p className="text-sm">
                    <strong>Bedrijf:</strong> {businessInfo.name}
                  </p>
                )}
                {businessInfo.industry && (
                  <p className="text-sm">
                    <strong>Industrie:</strong> {businessInfo.industry}
                  </p>
                )}
                {businessInfo.targetAudience && (
                  <p className="text-sm">
                    <strong>Doelgroep:</strong> {businessInfo.targetAudience}
                  </p>
                )}
              </div>
            )}

            {/* Custom Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Extra Instructies (Optioneel)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Bijv: Focus op duurzaamheid, gebruik jongere tone, inclusief prijsinformatie..."
                className="w-full min-h-[80px] p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                disabled={loading}
              />
            </div>

            {/* Generate Button */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
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
                  Genereer Block Content
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

            {/* Generated Preview */}
            {generatedData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gegenereerde Block Data</label>
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
                </div>

                <div className="p-4 border rounded-md bg-muted/30 space-y-2">
                  <pre className="text-xs font-mono overflow-x-auto max-h-[300px] overflow-y-auto">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                </div>

                <p className="text-xs text-muted-foreground">
                  Preview van de gegenereerde block data. Klik op "Accepteer & Gebruik" om toe te
                  voegen.
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
              disabled={!generatedData || loading}
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

// Note: Prompt building and parsing logic has been moved to the server-side
// blockGenerator service for better maintainability and security
