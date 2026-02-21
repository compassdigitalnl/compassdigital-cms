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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/branches/shared/components/ui/tabs'
import { Badge } from '@/branches/shared/components/ui/badge'
import type { ContentAnalysisResult, ImprovementSuggestion } from '@/lib/ai/types'

interface AIContentAnalyzerProps {
  content: string
  language?: string
  onApplyImprovement?: (improvement: ImprovementSuggestion) => void
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  buttonText?: string
}

export const AIContentAnalyzer: React.FC<AIContentAnalyzerProps> = ({
  content,
  language = 'nl',
  onApplyImprovement,
  variant = 'secondary',
  size = 'sm',
  buttonText = 'Analyseer Content',
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          language,
          includeGrammarCheck: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number): string => {
    if (score >= 85) return 'Uitstekend'
    if (score >= 70) return 'Goed'
    if (score >= 50) return 'Redelijk'
    return 'Moet verbeteren'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} onClick={handleAnalyze}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Analyse</DialogTitle>
          <DialogDescription>
            AI-powered content kwaliteitsanalyse met verbeterings suggesties
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Content analyseren...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overall Kwaliteitsscore</h3>
                  <p className="text-sm text-gray-600">{analysis.summary}</p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </div>
                  <Badge variant={analysis.overallScore >= 70 ? 'default' : 'destructive'}>
                    {getScoreBadge(analysis.overallScore)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabs for different analyses */}
            <Tabs defaultValue="improvements" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="improvements">Verbeteringen</TabsTrigger>
                <TabsTrigger value="readability">Leesbaarheid</TabsTrigger>
                <TabsTrigger value="tone">Toon</TabsTrigger>
                <TabsTrigger value="grammar">Grammatica</TabsTrigger>
                <TabsTrigger value="structure">Structuur</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              </TabsList>

              {/* Improvements Tab */}
              <TabsContent value="improvements" className="space-y-4">
                <div className="space-y-3">
                  {analysis.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              improvement.priority === 'high'
                                ? 'destructive'
                                : improvement.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {improvement.priority}
                          </Badge>
                          <Badge variant="outline">{improvement.category}</Badge>
                        </div>
                        {onApplyImprovement && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApplyImprovement(improvement)}
                          >
                            Toepassen
                          </Button>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">{improvement.issue}</h4>
                      <p className="text-sm text-gray-600 mb-2">{improvement.suggestion}</p>
                      {improvement.example && (
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="rounded bg-red-50 p-2 border border-red-200">
                            <span className="font-medium text-red-700">Voor: </span>
                            <span className="text-gray-700">{improvement.example.before}</span>
                          </div>
                          <div className="rounded bg-green-50 p-2 border border-green-200">
                            <span className="font-medium text-green-700">Na: </span>
                            <span className="text-gray-700">{improvement.example.after}</span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Impact:</strong> {improvement.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Readability Tab */}
              <TabsContent value="readability" className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Leesbaarheidscore</h3>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.readability.score)}`}>
                        {analysis.readability.score}
                      </div>
                      <Badge>{analysis.readability.level}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Gem. zinslengte</div>
                      <div className="text-xl font-semibold">
                        {analysis.readability.metrics.averageSentenceLength} woorden
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Gem. woordlengte</div>
                      <div className="text-xl font-semibold">
                        {analysis.readability.metrics.averageWordLength.toFixed(1)} tekens
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Lange zinnen</div>
                      <div className="text-xl font-semibold">
                        {analysis.readability.metrics.longSentencesPercentage}%
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Moeilijke woorden</div>
                      <div className="text-xl font-semibold">
                        {analysis.readability.metrics.difficultWordsPercentage}%
                      </div>
                    </div>
                  </div>

                  {analysis.readability.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Gevonden problemen:</h4>
                      {analysis.readability.issues.map((issue, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border border-gray-200">
                          <span className="font-medium">{issue.type}:</span> {issue.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {analysis.readability.suggestions.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <h4 className="font-medium text-sm">Suggesties:</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.readability.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tone Tab */}
              <TabsContent value="tone" className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Primaire toon</div>
                      <div className="text-xl font-semibold">{analysis.tone.primaryTone}</div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Toonsterkte</div>
                      <div className={`text-xl font-semibold ${getScoreColor(analysis.tone.toneStrength)}`}>
                        {analysis.tone.toneStrength}/100
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Emotionele ondertoon</div>
                      <div className="text-xl font-semibold">{analysis.tone.emotionalUndertone}</div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Formaliteit</div>
                      <div className="text-xl font-semibold">{analysis.tone.formalityLevel}</div>
                    </div>
                  </div>

                  {analysis.tone.characteristics.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Kenmerken:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.tone.characteristics.map((char, index) => (
                          <Badge key={index} variant="outline">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Consistentie</h4>
                      <span className={`font-semibold ${getScoreColor(analysis.tone.consistency.score)}`}>
                        {analysis.tone.consistency.score}/100
                      </span>
                    </div>
                    {analysis.tone.consistency.issues.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {analysis.tone.consistency.issues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600">⚠</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {analysis.tone.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Suggesties:</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.tone.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Grammar Tab */}
              <TabsContent value="grammar" className="space-y-4">
                {analysis.grammar ? (
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Grammatica Score</h3>
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.grammar.overallScore)}`}>
                        {analysis.grammar.overallScore}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{analysis.grammar.summary}</p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded bg-white p-3 border border-red-200">
                        <div className="text-sm text-gray-600">Kritiek</div>
                        <div className="text-2xl font-semibold text-red-600">
                          {analysis.grammar.issuesBySeverity.critical}
                        </div>
                      </div>
                      <div className="rounded bg-white p-3 border border-yellow-200">
                        <div className="text-sm text-gray-600">Waarschuwing</div>
                        <div className="text-2xl font-semibold text-yellow-600">
                          {analysis.grammar.issuesBySeverity.warning}
                        </div>
                      </div>
                      <div className="rounded bg-white p-3 border border-blue-200">
                        <div className="text-sm text-gray-600">Suggestie</div>
                        <div className="text-2xl font-semibold text-blue-600">
                          {analysis.grammar.issuesBySeverity.suggestion}
                        </div>
                      </div>
                    </div>

                    {analysis.grammar.issues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Gevonden problemen:</h4>
                        {analysis.grammar.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`rounded-lg border p-3 ${
                              issue.severity === 'critical'
                                ? 'bg-red-50 border-red-200'
                                : issue.severity === 'warning'
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <Badge
                                variant={
                                  issue.severity === 'critical'
                                    ? 'destructive'
                                    : issue.severity === 'warning'
                                      ? 'default'
                                      : 'secondary'
                                }
                              >
                                {issue.type}
                              </Badge>
                              <Badge variant="outline">{issue.severity}</Badge>
                            </div>
                            <div className="text-sm mt-2">
                              <div className="mb-1">
                                <span className="font-medium">Tekst: </span>
                                <span className="line-through">{issue.text}</span>
                              </div>
                              <div className="mb-1">
                                <span className="font-medium">Suggestie: </span>
                                <span className="text-green-700">{issue.suggestion}</span>
                              </div>
                              <p className="text-gray-600 text-xs mt-2">{issue.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Grammatica check niet beschikbaar
                  </div>
                )}
              </TabsContent>

              {/* Structure Tab */}
              <TabsContent value="structure" className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Structuur Score</h3>
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.structure.overallScore)}`}>
                      {analysis.structure.overallScore}
                    </div>
                  </div>

                  {/* Heading Structure */}
                  <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Heading Structuur</h4>
                      <Badge variant={analysis.structure.headingStructure.optimal ? 'default' : 'destructive'}>
                        {analysis.structure.headingStructure.optimal ? 'Optimaal' : 'Niet optimaal'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">H1:</span> {analysis.structure.headingStructure.h1}
                      </div>
                      <div>
                        <span className="text-gray-600">H2:</span> {analysis.structure.headingStructure.h2}
                      </div>
                      <div>
                        <span className="text-gray-600">H3:</span> {analysis.structure.headingStructure.h3}
                      </div>
                      {analysis.structure.headingStructure.h4 !== undefined && (
                        <div>
                          <span className="text-gray-600">H4:</span> {analysis.structure.headingStructure.h4}
                        </div>
                      )}
                    </div>
                    {analysis.structure.headingStructure.issues.length > 0 && (
                      <ul className="text-sm mt-2 space-y-1">
                        {analysis.structure.headingStructure.issues.map((issue, index) => (
                          <li key={index} className="text-orange-600">
                            ⚠ {issue}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Paragraphs */}
                  <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                    <h4 className="font-medium text-sm mb-2">Paragrafen</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Aantal:</span> {analysis.structure.paragraphs.count}
                      </div>
                      <div>
                        <span className="text-gray-600">Gem. lengte:</span>{' '}
                        {analysis.structure.paragraphs.averageLength} woorden
                      </div>
                      <div>
                        <span className="text-gray-600">Te lang:</span> {analysis.structure.paragraphs.tooLong}
                      </div>
                      <div>
                        <span className="text-gray-600">Te kort:</span> {analysis.structure.paragraphs.tooShort}
                      </div>
                    </div>
                  </div>

                  {/* Flow */}
                  <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Flow & Transitie</h4>
                      <span className={`font-semibold ${getScoreColor(analysis.structure.flow.score)}`}>
                        {analysis.structure.flow.score}/100
                      </span>
                    </div>
                    {analysis.structure.flow.issues.length > 0 && (
                      <ul className="text-sm space-y-1 mb-2">
                        {analysis.structure.flow.issues.map((issue, index) => (
                          <li key={index} className="text-orange-600">
                            ⚠ {issue}
                          </li>
                        ))}
                      </ul>
                    )}
                    {analysis.structure.flow.suggestions.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {analysis.structure.flow.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Improvements */}
                  {analysis.structure.improvements.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Verbeteringen:</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.structure.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Sentiment Tab */}
              <TabsContent value="sentiment" className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Overall Sentiment</div>
                      <div className="text-xl font-semibold capitalize">{analysis.sentiment.overall}</div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Score</div>
                      <div className={`text-xl font-semibold ${getScoreColor((analysis.sentiment.score + 100) / 2)}`}>
                        {analysis.sentiment.score > 0 ? '+' : ''}
                        {analysis.sentiment.score}
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Emotionele Toon</div>
                      <div className="text-xl font-semibold">{analysis.sentiment.emotionalTone}</div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600">Betrouwbaarheid</div>
                      <div className="text-xl font-semibold">{analysis.sentiment.confidence}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Subjectiviteit</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${analysis.sentiment.subjectivity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analysis.sentiment.subjectivity}%</span>
                      </div>
                    </div>
                    <div className="rounded bg-white p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Intensiteit</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${analysis.sentiment.intensity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analysis.sentiment.intensity}%</span>
                      </div>
                    </div>
                  </div>

                  {analysis.sentiment.emotions.length > 0 && (
                    <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                      <h4 className="font-medium text-sm mb-2">Gedetecteerde Emoties:</h4>
                      <div className="space-y-2">
                        {analysis.sentiment.emotions.map((emotion, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm w-24 capitalize">{emotion.emotion}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600"
                                style={{ width: `${emotion.strength}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {emotion.strength}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.sentiment.keyPhrases.length > 0 && (
                    <div className="rounded bg-white p-3 border border-gray-200 mb-4">
                      <h4 className="font-medium text-sm mb-2">Key Phrases:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.sentiment.keyPhrases.map((phrase, index) => (
                          <Badge
                            key={index}
                            variant={
                              phrase.sentiment === 'positive'
                                ? 'default'
                                : phrase.sentiment === 'negative'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {phrase.phrase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.sentiment.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Suggesties:</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.sentiment.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
