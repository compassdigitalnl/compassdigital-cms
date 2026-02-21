'use client'

/**
 * AI Page Generator Component
 * Generates complete pages with multiple blocks from a single prompt
 */

import React, { useState } from 'react'
import { Sparkles, Loader2, FileText, Wand2, Check, X, Eye, Settings2 } from 'lucide-react'
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
import { Checkbox } from '@/branches/shared/components/ui/checkbox'
import { Label } from '@/branches/shared/components/ui/label'
import { cn } from '@/utilities/cn'

interface PageGenerationOptions {
  pagePurpose: string
  pageType?: 'landing' | 'about' | 'services' | 'contact' | 'blog' | 'custom'
  businessInfo?: {
    name?: string
    industry?: string
    targetAudience?: string
    tone?: string
    valueProposition?: string
  }
  preferences?: {
    includeHero?: boolean
    includePricing?: boolean
    includeFAQ?: boolean
    includeTestimonials?: boolean
    includeContactForm?: boolean
    maxBlocks?: number
  }
}

interface PageStructure {
  title: string
  slug: string
  metaDescription?: string
  blocks: Array<{
    type: string
    data: any
  }>
}

interface AIPageGeneratorProps {
  /** Callback when page is generated */
  onGenerate: (pageStructure: PageStructure) => void
  /** Optional business info */
  businessInfo?: {
    name?: string
    industry?: string
    targetAudience?: string
    tone?: string
    valueProposition?: string
  }
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Custom button text */
  buttonText?: string
}

const PAGE_TYPES = [
  { value: 'landing', label: 'Landing Page', description: 'Product/service landing page' },
  { value: 'about', label: 'About Page', description: 'Company information and team' },
  { value: 'services', label: 'Services Page', description: 'Services or products overview' },
  { value: 'contact', label: 'Contact Page', description: 'Contact information and form' },
  { value: 'blog', label: 'Blog Landing', description: 'Blog overview page' },
  { value: 'custom', label: 'Custom', description: 'Custom page based on description' },
]

export const AIPageGenerator: React.FC<AIPageGeneratorProps> = ({
  onGenerate,
  businessInfo,
  variant = 'default',
  size = 'default',
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pageType, setPageType] = useState<string>('landing')
  const [pagePurpose, setPagePurpose] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Preferences
  const [includeHero, setIncludeHero] = useState(true)
  const [includePricing, setIncludePricing] = useState(true)
  const [includeFAQ, setIncludeFAQ] = useState(true)
  const [includeTestimonials, setIncludeTestimonials] = useState(true)
  const [includeContactForm, setIncludeContactForm] = useState(false)
  const [maxBlocks, setMaxBlocks] = useState<number>(8)

  const [generatedPage, setGeneratedPage] = useState<PageStructure | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'input' | 'preview'>('input')

  const handleOpen = () => {
    setGeneratedPage(null)
    setError('')
    setStep('input')
    setPagePurpose('')
    setIsOpen(true)
  }

  const handleGenerate = async () => {
    if (!pagePurpose.trim()) {
      setError('Voer een doel voor de pagina in')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedPage(null)

    try {
      const options: PageGenerationOptions = {
        pagePurpose,
        pageType: pageType as any,
        businessInfo,
        preferences: {
          includeHero,
          includePricing,
          includeFAQ,
          includeTestimonials,
          includeContactForm,
          maxBlocks,
        },
      }

      const response = await fetch('/api/ai/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })

      const result = await response.json()

      if (result.success && result.pageStructure) {
        setGeneratedPage(result.pageStructure)
        setStep('preview')
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
    if (generatedPage) {
      onGenerate(generatedPage)
      setIsOpen(false)
    }
  }

  const handleBack = () => {
    setStep('input')
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
        {buttonText || 'Genereer Complete Pagina'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {step === 'input' ? 'AI Pagina Generator' : 'Pagina Preview'}
            </DialogTitle>
            <DialogDescription>
              {step === 'input'
                ? 'Genereer een complete pagina met AI in enkele seconden'
                : 'Bekijk de gegenereerde pagina structuur'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {step === 'input' && (
              <>
                {/* Page Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pagina Type</label>
                  <Select value={pageType} onValueChange={setPageType} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Page Purpose */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Wat is het doel van deze pagina?
                  </label>
                  <textarea
                    value={pagePurpose}
                    onChange={(e) => setPagePurpose(e.target.value)}
                    placeholder="Bijv: Landing page voor een SaaS product dat teams helpt met project management..."
                    className="w-full min-h-[100px] p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Beschrijf zo gedetailleerd mogelijk wat de pagina moet bereiken
                  </p>
                </div>

                {/* Business Context */}
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

                {/* Advanced Options */}
                <div className="border-t pt-4">
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

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 border rounded-md bg-muted/30">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Blocks om in te sluiten:</p>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hero"
                            checked={includeHero}
                            onCheckedChange={(checked) => setIncludeHero(checked as boolean)}
                          />
                          <Label htmlFor="hero" className="text-sm cursor-pointer">
                            Hero Section
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pricing"
                            checked={includePricing}
                            onCheckedChange={(checked) => setIncludePricing(checked as boolean)}
                          />
                          <Label htmlFor="pricing" className="text-sm cursor-pointer">
                            Pricing
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="faq"
                            checked={includeFAQ}
                            onCheckedChange={(checked) => setIncludeFAQ(checked as boolean)}
                          />
                          <Label htmlFor="faq" className="text-sm cursor-pointer">
                            FAQ
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="testimonials"
                            checked={includeTestimonials}
                            onCheckedChange={(checked) =>
                              setIncludeTestimonials(checked as boolean)
                            }
                          />
                          <Label htmlFor="testimonials" className="text-sm cursor-pointer">
                            Testimonials
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="contact"
                            checked={includeContactForm}
                            onCheckedChange={(checked) =>
                              setIncludeContactForm(checked as boolean)
                            }
                          />
                          <Label htmlFor="contact" className="text-sm cursor-pointer">
                            Contact Form
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Maximum aantal blocks: {maxBlocks}
                        </label>
                        <input
                          type="range"
                          min="3"
                          max="12"
                          value={maxBlocks}
                          onChange={(e) => setMaxBlocks(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                    <p className="text-sm text-destructive font-medium">Error:</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                )}
              </>
            )}

            {step === 'preview' && generatedPage && (
              <>
                {/* Page Metadata */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-md">
                  <h3 className="font-semibold">Pagina Metadata</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Titel:</p>
                      <p className="text-sm font-medium">{generatedPage.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Slug:</p>
                      <p className="text-sm font-mono">/{generatedPage.slug}</p>
                    </div>
                    {generatedPage.metaDescription && (
                      <div>
                        <p className="text-xs text-muted-foreground">Meta Description:</p>
                        <p className="text-sm">{generatedPage.metaDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blocks Preview */}
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Blocks ({generatedPage.blocks.length})
                  </h3>
                  <div className="space-y-2">
                    {generatedPage.blocks.map((block, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <p className="font-medium capitalize">{block.type}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Toggle preview
                              const el = document.getElementById(`block-${index}`)
                              if (el) {
                                el.classList.toggle('hidden')
                              }
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </div>
                        <div id={`block-${index}`} className="hidden">
                          <pre className="text-xs font-mono overflow-x-auto p-2 bg-muted rounded">
                            {JSON.stringify(block.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md text-sm">
                  <p className="text-blue-900 dark:text-blue-100">
                    <strong>Let op:</strong> Dit is een preview. Je kunt de pagina bewerken
                    nadat je deze hebt geaccepteerd.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {step === 'input' ? (
              <>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuleer
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !pagePurpose.trim()}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Genereren...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Genereer Pagina
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Terug
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  variant="ghost"
                  disabled={loading}
                  className="gap-2"
                >
                  <Sparkles className="size-4" />
                  Regenereer
                </Button>
                <Button
                  type="button"
                  onClick={handleAccept}
                  disabled={loading}
                  className="gap-2"
                >
                  <Check className="size-4" />
                  Accepteer & Gebruik
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
