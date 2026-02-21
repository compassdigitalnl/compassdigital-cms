'use client'

/**
 * AI Text Button Component
 * Lightweight inline button for quick AI content generation
 * Perfect for adding AI capabilities to existing text fields
 */

import React, { useState } from 'react'
import { Sparkles, Loader2, X, Check } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { cn } from '@/utilities/cn'

interface AITextButtonProps {
  /** Function to call when content is generated */
  onGenerate: (content: string) => void
  /** Prompt for the AI generation */
  prompt: string
  /** Optional context to include */
  context?: Record<string, any>
  /** Tone of the content */
  tone?: string
  /** Language of the content */
  language?: string
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  /** Button size */
  size?: 'sm' | 'default' | 'lg' | 'icon'
  /** Custom button text (only shown for non-icon variants) */
  children?: React.ReactNode
  /** Additional className */
  className?: string
  /** Tooltip text */
  title?: string
}

export const AITextButton: React.FC<AITextButtonProps> = ({
  onGenerate,
  prompt,
  context,
  tone = 'professional',
  language = 'nl',
  variant = 'ghost',
  size = 'sm',
  children,
  className,
  title = 'Genereer met AI',
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
      const options = {
        prompt,
        tone,
        language,
        maxTokens: 500, // Keep it short for inline generation
        temperature: 0.7,
        ...(context && { context: JSON.stringify(context) }),
      }

      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })

      const result = await response.json()

      if (result.success && result.content) {
        onGenerate(result.content)
      } else {
        setError(result.error || 'Generatie mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  // Show error toast if there's an error
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
        size={size}
        title={title}
        className={cn('gap-2', variant === 'icon' && 'size-8 p-0', className)}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {variant !== 'icon' && children && <span>{children}</span>}
      </Button>

      {/* Error Tooltip */}
      {error && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 max-w-xs">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * AI Improve Button
 * Specialized button for improving existing content
 */
interface AIImproveButtonProps {
  /** Current content to improve */
  currentContent: string
  /** Function to call when improved content is ready */
  onImprove: (content: string) => void
  /** What aspect to improve */
  improvementType?: 'clarity' | 'brevity' | 'engagement' | 'seo' | 'grammar'
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Additional className */
  className?: string
}

export const AIImproveButton: React.FC<AIImproveButtonProps> = ({
  currentContent,
  onImprove,
  improvementType = 'clarity',
  variant = 'ghost',
  size = 'sm',
  className,
}) => {
  const improvementPrompts = {
    clarity: 'Verbeter deze tekst voor meer duidelijkheid en leesbaarheid',
    brevity: 'Maak deze tekst korter en bondiger zonder belangrijke informatie te verliezen',
    engagement: 'Maak deze tekst aantrekkelijker en boeiender voor de lezer',
    seo: 'Optimaliseer deze tekst voor SEO zonder de leesbaarheid te verliezen',
    grammar: 'Corrigeer grammatica, spelling en interpunctie in deze tekst',
  }

  const improvementLabels = {
    clarity: 'Verduidelijk',
    brevity: 'Verkort',
    engagement: 'Boeiender',
    seo: 'SEO Optimaliseer',
    grammar: 'Corrigeer',
  }

  const prompt = `${improvementPrompts[improvementType]}:\n\n${currentContent}`

  return (
    <AITextButton
      prompt={prompt}
      onGenerate={onImprove}
      variant={variant}
      size={size}
      className={className}
      title={improvementPrompts[improvementType]}
    >
      {improvementLabels[improvementType]}
    </AITextButton>
  )
}

/**
 * AI Translate Button
 * Specialized button for translating content
 */
interface AITranslateButtonProps {
  /** Current content to translate */
  currentContent: string
  /** Target language */
  targetLanguage: 'nl' | 'en' | 'de' | 'fr' | 'es'
  /** Function to call when translation is ready */
  onTranslate: (content: string) => void
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Additional className */
  className?: string
}

export const AITranslateButton: React.FC<AITranslateButtonProps> = ({
  currentContent,
  targetLanguage,
  onTranslate,
  variant = 'ghost',
  size = 'sm',
  className,
}) => {
  const languageNames = {
    nl: 'Nederlands',
    en: 'Engels',
    de: 'Duits',
    fr: 'Frans',
    es: 'Spaans',
  }

  const prompt = `Vertaal de volgende tekst naar het ${languageNames[targetLanguage]}. Behoud de tone en stijl:\n\n${currentContent}`

  return (
    <AITextButton
      prompt={prompt}
      onGenerate={onTranslate}
      language={targetLanguage}
      variant={variant}
      size={size}
      className={className}
      title={`Vertaal naar ${languageNames[targetLanguage]}`}
    >
      Vertaal naar {languageNames[targetLanguage]}
    </AITextButton>
  )
}
