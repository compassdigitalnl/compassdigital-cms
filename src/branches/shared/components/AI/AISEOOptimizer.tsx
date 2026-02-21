'use client'

/**
 * AI SEO Optimizer Component
 * Analyzes and optimizes content for SEO
 */

import React, { useState } from 'react'
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  FileText,
  Tag,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/branches/shared/components/ui/dialog'
import { cn } from '@/utilities/cn'

interface SEOIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  issue: string
  suggestion: string
  impact: number
}

interface SEOAnalysisResult {
  score: number
  issues: SEOIssue[]
  suggestions: string[]
  keywords: {
    primary: string[]
    secondary: string[]
    density: Record<string, number>
    suggestions: string[]
  }
  readability: {
    score: number
    level: string
    averageSentenceLength: number
    averageWordLength: number
  }
  metadata: {
    title: { length: number; optimal: boolean; suggestion?: string }
    description: { length: number; optimal: boolean; suggestion?: string }
  }
  performance: {
    wordCount: number
    headingStructure: {
      h1: number
      h2: number
      h3: number
      optimal: boolean
    }
  }
}

interface AISEOOptimizerProps {
  content: string
  title?: string
  metaDescription?: string
  targetKeywords?: string[]
  onOptimize?: (suggestions: any) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  buttonText?: string
}

export const AISEOOptimizer: React.FC<AISEOOptimizerProps> = ({
  content,
  title,
  metaDescription,
  targetKeywords = [],
  onOptimize,
  variant = 'default',
  size = 'default',
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/ai/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title,
          metaDescription,
          targetKeywords,
        }),
      })

      const result = await response.json()

      if (result.success && result.analysis) {
        setAnalysis(result.analysis)
      } else {
        setError(result.error || 'Analyse mislukt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!analysis) {
      handleAnalyze()
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="size-5 text-destructive" />
      case 'warning':
        return <AlertTriangle className="size-5 text-yellow-600" />
      case 'info':
        return <Info className="size-5 text-blue-600" />
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-destructive'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Uitstekend'
    if (score >= 60) return 'Goed'
    if (score >= 40) return 'Matig'
    return 'Slecht'
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
        <Search className="size-4" />
        {buttonText || 'SEO Analyseren'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>SEO Analyse</DialogTitle>
            <DialogDescription>
              AI-powered SEO analyse van je content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="size-12 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Content analyseren...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                <p className="text-sm text-destructive font-medium">Error:</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            )}

            {analysis && !loading && (
              <>
                {/* Overall Score */}
                <div className="p-6 border rounded-lg bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Overall SEO Score</h3>
                      <p className="text-sm text-muted-foreground">
                        {getScoreLabel(analysis.score)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className={cn('text-5xl font-bold', getScoreColor(analysis.score))}>
                        {analysis.score}
                      </div>
                      <div className="text-sm text-muted-foreground">/100</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="size-5 text-primary" />
                      <span className="text-sm font-medium">Woorden</span>
                    </div>
                    <div className="text-2xl font-bold">{analysis.performance.wordCount}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="size-5 text-primary" />
                      <span className="text-sm font-medium">Leesbaarheid</span>
                    </div>
                    <div className="text-2xl font-bold">{analysis.readability.score}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="size-5 text-primary" />
                      <span className="text-sm font-medium">Keywords</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {analysis.keywords.primary.length + analysis.keywords.secondary.length}
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="size-5" />
                      Gevonden Issues ({analysis.issues.length})
                    </h3>
                    <div className="space-y-2">
                      {analysis.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{issue.issue}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                  {issue.category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Impact: {issue.impact}/10
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Tag className="size-5" />
                    Keywords
                  </h3>
                  <div className="space-y-3">
                    {analysis.keywords.primary.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Primaire Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords.primary.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {keyword}
                              {analysis.keywords.density[keyword] && (
                                <span className="ml-2 text-xs opacity-70">
                                  {analysis.keywords.density[keyword].toFixed(1)}%
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.keywords.secondary.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Secundaire Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords.secondary.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.keywords.suggestions.length > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                        <p className="text-sm font-medium mb-2">Keyword Suggesties:</p>
                        <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
                          {analysis.keywords.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Readability */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">Leesbaarheid</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-xl font-bold">{analysis.readability.score}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Niveau</p>
                      <p className="text-xl font-bold capitalize">{analysis.readability.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gemiddelde zinlengte</p>
                      <p className="text-xl font-bold">
                        {analysis.readability.averageSentenceLength}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gemiddelde woordlengte</p>
                      <p className="text-xl font-bold">
                        {analysis.readability.averageWordLength.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Metadata</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Titel</p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.metadata.title.length} tekens
                        </p>
                      </div>
                      {analysis.metadata.title.optimal ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="size-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Meta Description</p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.metadata.description.length} tekens
                        </p>
                      </div>
                      {analysis.metadata.description.optimal ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="size-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="size-5" />
                      Verbeter Suggesties
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Sluiten
            </Button>
            {analysis && (
              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                variant="ghost"
                className="gap-2"
              >
                <Search className="size-4" />
                Opnieuw Analyseren
              </Button>
            )}
            {analysis && onOptimize && (
              <Button
                type="button"
                onClick={() => {
                  onOptimize(analysis)
                  setIsOpen(false)
                }}
                className="gap-2"
              >
                <TrendingUp className="size-4" />
                Pas Suggesties Toe
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
