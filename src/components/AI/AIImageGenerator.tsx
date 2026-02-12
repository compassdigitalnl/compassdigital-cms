'use client'

/**
 * AI Image Generator Component
 * Component for generating images using DALL-E 3
 */

import React, { useState } from 'react'
import { Image as ImageIcon, Loader2, Download, RefreshCw, Sparkles, Copy, Check } from 'lucide-react'
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

interface AIImageGeneratorProps {
  /** Field name/ID */
  fieldName: string
  /** Field label shown in modal */
  fieldLabel: string
  /** Callback when image URL is accepted */
  onAccept: (imageUrl: string, revisedPrompt?: string) => void
  /** Optional prompt placeholder */
  promptPlaceholder?: string
  /** Default image size */
  defaultSize?: '1024x1024' | '1792x1024' | '1024x1792'
  /** Default quality */
  defaultQuality?: 'standard' | 'hd'
  /** Default style */
  defaultStyle?: 'vivid' | 'natural'
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Custom button text */
  buttonText?: string
}

const IMAGE_SIZES = [
  { value: '1024x1024', label: 'Vierkant (1024x1024)', icon: '□' },
  { value: '1792x1024', label: 'Landschap (1792x1024)', icon: '▭' },
  { value: '1024x1792', label: 'Portret (1024x1792)', icon: '▯' },
]

const IMAGE_QUALITY = [
  { value: 'standard', label: 'Standaard', description: 'Goede kwaliteit, sneller' },
  { value: 'hd', label: 'HD', description: 'Hoogste kwaliteit, langzamer' },
]

const IMAGE_STYLES = [
  { value: 'vivid', label: 'Levendig', description: 'Hyperreal en dramatisch' },
  { value: 'natural', label: 'Natuurlijk', description: 'Natuurlijker en realistischer' },
]

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  fieldName,
  fieldLabel,
  onAccept,
  promptPlaceholder = 'Beschrijf de afbeelding die je wilt genereren...',
  defaultSize = '1024x1024',
  defaultQuality = 'standard',
  defaultStyle = 'vivid',
  variant = 'secondary',
  size = 'sm',
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [imageSize, setImageSize] = useState(defaultSize)
  const [quality, setQuality] = useState(defaultQuality)
  const [style, setStyle] = useState(defaultStyle)
  const [generatedImage, setGeneratedImage] = useState<{
    url: string
    revisedPrompt?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<Array<{ url: string; prompt: string }>>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleOpen = () => {
    setPrompt('')
    setGeneratedImage(null)
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
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size: imageSize,
          quality,
          style,
        }),
      })

      const result = await response.json()

      if (result.success && result.image) {
        setGeneratedImage(result.image)
        setHistory((prev) => [
          { url: result.image.url, prompt: result.image.revisedPrompt || prompt },
          ...prev.slice(0, 9), // Keep last 10
        ])
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-generated-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleAccept = () => {
    if (generatedImage) {
      onAccept(generatedImage.url, generatedImage.revisedPrompt)
      setIsOpen(false)
    }
  }

  const handleUseFromHistory = (item: { url: string; prompt: string }) => {
    setGeneratedImage({ url: item.url, revisedPrompt: item.prompt })
    setPrompt(item.prompt)
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
        <ImageIcon className="size-4" />
        {buttonText || 'AI Afbeelding'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>AI Afbeelding Generator: {fieldLabel}</DialogTitle>
            <DialogDescription>
              Genereer unieke afbeeldingen met DALL-E 3
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
              <p className="text-xs text-muted-foreground">
                Beschrijf de afbeelding zo gedetailleerd mogelijk voor het beste resultaat
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Formaat</label>
                <Select value={imageSize} onValueChange={setImageSize as any} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_SIZES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kwaliteit</label>
                <Select value={quality} onValueChange={setQuality as any} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_QUALITY.map((q) => (
                      <SelectItem key={q.value} value={q.value}>
                        {q.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stijl</label>
                <Select value={style} onValueChange={setStyle as any} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_STYLES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                  Genereren... (kan 10-30 seconden duren)
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Genereer Afbeelding
                </>
              )}
            </Button>

            {/* Cost Warning */}
            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
              <p>
                <strong>Let op:</strong> {quality === 'hd' ? 'HD' : 'Standaard'} afbeeldingen kosten ongeveer €
                {quality === 'hd' ? '0.08' : '0.04'} per afbeelding
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                <p className="text-sm text-destructive font-medium">Error:</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            )}

            {/* Generated Image */}
            {generatedImage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gegenereerde Afbeelding</label>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="gap-1"
                      >
                        <ImageIcon className="size-4" />
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
                      onClick={handleDownload}
                      className="gap-1"
                    >
                      <Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* History Grid */}
                {showHistory && history.length > 0 && (
                  <div className="p-3 border rounded-md bg-muted/30 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Klik op een afbeelding om te gebruiken:
                    </p>
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                      {history.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleUseFromHistory(item)}
                          className="aspect-square overflow-hidden rounded-md border hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img
                            src={item.url}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src={generatedImage.url}
                    alt="AI gegenereerde afbeelding"
                    className="w-full h-auto"
                  />
                </div>

                {generatedImage.revisedPrompt && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      DALL-E 3 verbeterde prompt:
                    </p>
                    <p className="text-sm">{generatedImage.revisedPrompt}</p>
                  </div>
                )}
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
              disabled={!generatedImage || loading}
              className="gap-2"
            >
              <Check className="size-4" />
              Gebruik deze afbeelding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * AI Image Button - Lightweight inline version
 */
interface AIImageButtonProps {
  /** Function to call when image is generated */
  onGenerate: (imageUrl: string) => void
  /** Prompt for image generation */
  prompt: string
  /** Image size */
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  /** Image quality */
  quality?: 'standard' | 'hd'
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  /** Button size */
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon'
  /** Custom button text */
  children?: React.ReactNode
  /** Additional className */
  className?: string
}

export const AIImageButton: React.FC<AIImageButtonProps> = ({
  onGenerate,
  prompt,
  size = '1024x1024',
  quality = 'standard',
  variant = 'ghost',
  buttonSize = 'sm',
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Geen prompt opgegeven')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size,
          quality,
        }),
      })

      const result = await response.json()

      if (result.success && result.image) {
        onGenerate(result.image.url)
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="relative inline-flex items-center gap-2">
      <Button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        variant={variant === 'icon' ? 'ghost' : variant}
        size={buttonSize}
        className={cn('gap-2', variant === 'icon' && 'size-8 p-0', className)}
        title="Genereer afbeelding met AI"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImageIcon className="size-4" />
        )}
        {variant !== 'icon' && children && <span>{children}</span>}
      </Button>

      {error && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-md shadow-lg text-sm max-w-xs">
            {error}
          </div>
        </div>
      )}
    </div>
  )
}
