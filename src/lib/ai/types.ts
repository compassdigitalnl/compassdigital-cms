/**
 * AI Service Types
 * Core type definitions for AI content generation
 */

export type AIModel = 'gpt-4-turbo-preview' | 'gpt-4' | 'gpt-3.5-turbo'
export type AIImageModel = 'dall-e-3' | 'dall-e-2'

export type ContentTone =
  | 'professional'
  | 'casual'
  | 'friendly'
  | 'formal'
  | 'enthusiastic'
  | 'persuasive'

export type ContentLanguage = 'nl' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt'

export interface ContentGenerationOptions {
  prompt: string
  context?: string
  tone?: ContentTone
  language?: ContentLanguage
  maxTokens?: number
  temperature?: number
}

export interface ImageGenerationOptions {
  prompt: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

export interface AIGenerationResult<T = string> {
  success: boolean
  data?: T
  error?: string
  tokensUsed?: number
  model?: string
}

export interface AIImageResult {
  url: string
  revisedPrompt?: string
}

export interface BlockSuggestion {
  blockType: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  suggestedFields?: Record<string, unknown>
}

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: string[]
}

export interface SEOIssue {
  type: 'warning' | 'error' | 'info'
  message: string
  field?: string
}

// Content Analysis Types

export interface ReadabilityAnalysis {
  score: number // 0-100
  level: 'zeer-makkelijk' | 'makkelijk' | 'gemiddeld' | 'moeilijk' | 'zeer-moeilijk'
  metrics: {
    averageSentenceLength: number
    averageWordLength: number
    longSentencesPercentage: number
    difficultWordsPercentage: number
  }
  issues: Array<{
    type: string
    count: number
    description: string
  }>
  suggestions: string[]
}

export interface ToneAnalysis {
  primaryTone: string
  toneStrength: number // 0-100
  emotionalUndertone: string
  formalityLevel: 'zeer-formeel' | 'formeel' | 'neutraal' | 'informeel' | 'zeer-informeel'
  characteristics: string[]
  consistency: {
    score: number
    issues: string[]
  }
  suggestions: string[]
}

export interface GrammarIssue {
  type: 'spelling' | 'grammar' | 'style' | 'punctuation' | 'word-choice'
  severity: 'critical' | 'warning' | 'suggestion'
  text: string
  suggestion: string
  explanation: string
  position?: {
    start: number
    end: number
  }
}

export interface GrammarCheckResult {
  totalIssues: number
  issuesBySeverity: {
    critical: number
    warning: number
    suggestion: number
  }
  issues: GrammarIssue[]
  overallScore: number // 0-100
  summary: string
}

export interface ContentStructureAnalysis {
  headingStructure: {
    h1: number
    h2: number
    h3: number
    h4?: number
    optimal: boolean
    issues: string[]
  }
  paragraphs: {
    count: number
    averageLength: number
    tooLong: number
    tooShort: number
    optimal: boolean
  }
  lists: {
    count: number
    types: string[]
    suggestions: string[]
  }
  flow: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  density: {
    score: number
    level: 'sparse' | 'balanced' | 'dense'
    suggestions: string[]
  }
  overallScore: number
  improvements: string[]
}

export interface ImprovementSuggestion {
  category: 'clarity' | 'engagement' | 'conciseness' | 'structure' | 'tone' | 'seo'
  priority: 'high' | 'medium' | 'low'
  issue: string
  suggestion: string
  example?: {
    before: string
    after: string
  }
  impact: string
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed'
  score: number // -100 to +100
  confidence: number // 0-100
  emotionalTone: string
  subjectivity: number // 0-100
  intensity: number // 0-100
  emotions: Array<{
    emotion: string
    strength: number
  }>
  keyPhrases: Array<{
    phrase: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  suggestions: string[]
}

export interface ContentAnalysisResult {
  overallScore: number // 0-100
  readability: ReadabilityAnalysis
  tone: ToneAnalysis
  grammar?: GrammarCheckResult
  structure: ContentStructureAnalysis
  sentiment: SentimentAnalysis
  improvements: ImprovementSuggestion[]
  summary: string
}

// Translation & Multi-language Types

export interface TranslationOptions {
  sourceLanguage?: ContentLanguage | 'auto'
  tone?: 'preserve' | 'professional' | 'casual' | 'friendly' | 'formal'
  formality?: 'preserve' | 'formal' | 'informal' | 'neutral'
  preserveFormatting?: boolean
}

export interface TranslationResult {
  translatedText: string
  detectedSourceLanguage: string
  confidence: number // 0-100
  notes?: string[]
}

export interface LanguageDetectionResult {
  primaryLanguage: ContentLanguage
  confidence: number // 0-100
  secondaryLanguages?: ContentLanguage[]
  dialect?: string
  notes?: string[]
}

export interface MultiLanguageContent {
  original: string
  translations: Record<ContentLanguage, {
    text: string
    confidence: number
  }>
}
