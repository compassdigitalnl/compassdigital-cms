/**
 * SEO Optimizer Service
 * AI service for SEO analysis, optimization, and meta tag generation
 */

import { openai } from '../client'
import { aiLogger } from '../logger'
import { AIGenerationError, AIConfigurationError } from '../errors'
import type { AIGenerationResult } from '../types'

export interface SEOAnalysisOptions {
  content: string
  title?: string
  metaDescription?: string
  targetKeywords?: string[]
  url?: string
  language?: string
}

export interface SEOAnalysisResult {
  score: number // 0-100
  issues: SEOIssue[]
  suggestions: string[]
  keywords: KeywordAnalysis
  readability: ReadabilityScore
  metadata: MetadataAnalysis
  performance: PerformanceMetrics
}

export interface SEOIssue {
  severity: 'critical' | 'warning' | 'info'
  category: 'content' | 'metadata' | 'keywords' | 'structure' | 'performance'
  issue: string
  suggestion: string
  impact: number // 1-10
}

export interface KeywordAnalysis {
  primary: string[]
  secondary: string[]
  density: Record<string, number>
  suggestions: string[]
  opportunities: string[]
}

export interface ReadabilityScore {
  score: number // 0-100
  level: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard'
  averageSentenceLength: number
  averageWordLength: number
  suggestions: string[]
}

export interface MetadataAnalysis {
  title: {
    length: number
    optimal: boolean
    suggestion?: string
  }
  description: {
    length: number
    optimal: boolean
    suggestion?: string
  }
  keywords: {
    present: boolean
    count: number
    suggestion?: string
  }
}

export interface PerformanceMetrics {
  contentLength: number
  wordCount: number
  headingStructure: {
    h1: number
    h2: number
    h3: number
    h4: number
    optimal: boolean
  }
  internalLinks: number
  externalLinks: number
}

export interface MetaTagsOptions {
  content: string
  title?: string
  targetKeywords?: string[]
  language?: string
  pageType?: 'article' | 'product' | 'landing' | 'about' | 'contact'
}

export interface GeneratedMetaTags {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogType: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
}

export interface KeywordResearchOptions {
  topic: string
  industry?: string
  targetAudience?: string
  language?: string
  includeQuestions?: boolean
}

export interface KeywordResearchResult {
  primary: Array<{
    keyword: string
    relevance: number
    difficulty: 'low' | 'medium' | 'high'
    searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial'
  }>
  longTail: Array<{
    keyword: string
    relevance: number
  }>
  questions: string[]
  relatedTopics: string[]
}

export interface SchemaMarkupOptions {
  type: 'Article' | 'Product' | 'Organization' | 'LocalBusiness' | 'FAQ' | 'WebPage'
  data: Record<string, any>
}

export class SEOOptimizerService {
  /**
   * Analyze content for SEO
   */
  async analyzeContent(options: SEOAnalysisOptions): Promise<AIGenerationResult<SEOAnalysisResult>> {
    const startTime = Date.now()

    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      aiLogger.log('info', 'Analyzing content for SEO', 'SEOOptimizer', {
        contentLength: options.content.length
      })

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert SEO analist.
Je analyseert content op SEO kwaliteit en geeft concrete, praktische suggesties.
Focus op: keywords, readability, metadata, content structuur en technische SEO.`,
          },
          {
            role: 'user',
            content: `Analyseer deze content voor SEO:

TITEL: ${options.title || 'Niet opgegeven'}
META DESCRIPTION: ${options.metaDescription || 'Niet opgegeven'}
TARGET KEYWORDS: ${options.targetKeywords?.join(', ') || 'Niet opgegeven'}

CONTENT:
${options.content}

Geef een gedetailleerde SEO analyse met:
1. Overall SEO score (0-100)
2. Gevonden issues (critical, warning, info) met categorie, impact en suggesties
3. Keyword analyse (primaire keywords, secundaire keywords, density, suggestions)
4. Readability score (0-100, niveau, gemiddelde zin/woord lengte)
5. Metadata analyse (titel lengte, description lengte, optimaal?)
6. Performance metrics (word count, heading structuur, links)
7. Concrete suggesties voor verbetering

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "score": 75,
  "issues": [
    {
      "severity": "critical",
      "category": "metadata",
      "issue": "Meta description ontbreekt",
      "suggestion": "Voeg een meta description toe van 120-160 tekens",
      "impact": 9
    }
  ],
  "suggestions": [
    "Voeg meer interne links toe",
    "Verbeter keyword density voor 'target keyword'"
  ],
  "keywords": {
    "primary": ["hoofdkeyword1", "hoofdkeyword2"],
    "secondary": ["secundair1", "secundair2"],
    "density": {
      "hoofdkeyword1": 2.5,
      "hoofdkeyword2": 1.8
    },
    "suggestions": ["Gebruik meer long-tail keywords"],
    "opportunities": ["keyword opportunity 1"]
  },
  "readability": {
    "score": 65,
    "level": "medium",
    "averageSentenceLength": 18,
    "averageWordLength": 5.2,
    "suggestions": ["Kortere zinnen gebruiken"]
  },
  "metadata": {
    "title": {
      "length": 45,
      "optimal": true
    },
    "description": {
      "length": 0,
      "optimal": false,
      "suggestion": "Voeg een meta description toe"
    },
    "keywords": {
      "present": true,
      "count": 3
    }
  },
  "performance": {
    "contentLength": 1500,
    "wordCount": 250,
    "headingStructure": {
      "h1": 1,
      "h2": 3,
      "h3": 5,
      "h4": 2,
      "optimal": true
    },
    "internalLinks": 2,
    "externalLinks": 1
  }
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No SEO analysis generated')
      }

      const analysis = JSON.parse(content) as SEOAnalysisResult

      const duration = Date.now() - startTime

      aiLogger.log('info', `SEO analysis completed in ${duration}ms`, 'SEOOptimizer', {
        score: analysis.score,
        issueCount: analysis.issues.length,
      })

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: completion.model,
      }
    } catch (error) {
      const duration = Date.now() - startTime

      aiLogger.log('error', 'SEO analysis failed', 'SEOOptimizer', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate optimized meta tags
   */
  async generateMetaTags(options: MetaTagsOptions): Promise<AIGenerationResult<GeneratedMetaTags>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      aiLogger.log('info', 'Generating meta tags', 'SEOOptimizer')

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in SEO en meta tag optimalisatie.
Je genereert pakkende, SEO-geoptimaliseerde meta tags die clicks genereren.`,
          },
          {
            role: 'user',
            content: `Genereer geoptimaliseerde meta tags voor deze content:

HUIDIGE TITEL: ${options.title || 'Niet opgegeven'}
TARGET KEYWORDS: ${options.targetKeywords?.join(', ') || 'Niet opgegeven'}
PAGE TYPE: ${options.pageType || 'landing'}

CONTENT:
${options.content.substring(0, 2000)}

Genereer:
1. SEO-geoptimaliseerde titel (50-60 tekens, met main keyword)
2. Meta description (120-160 tekens, call-to-action, met keywords)
3. Keywords lijst (5-10 relevante keywords)
4. Open Graph tags (title, description, type)
5. Twitter Card tags (title, description, card type)

Antwoord ALLEEN met valide JSON:
{
  "title": "Pakkende SEO Titel | Brand",
  "description": "Overtuigende meta description met keywords en CTA...",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "ogTitle": "Open Graph Titel",
  "ogDescription": "OG description...",
  "ogType": "website",
  "twitterCard": "summary_large_image",
  "twitterTitle": "Twitter titel",
  "twitterDescription": "Twitter description..."
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No meta tags generated')
      }

      const metaTags = JSON.parse(content) as GeneratedMetaTags

      return {
        success: true,
        data: metaTags,
        tokensUsed: completion.usage?.total_tokens,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Research keywords for a topic
   */
  async researchKeywords(
    options: KeywordResearchOptions,
  ): Promise<AIGenerationResult<KeywordResearchResult>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      aiLogger.log('info', 'Researching keywords', 'SEOOptimizer', { topic: options.topic })

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in keyword research en SEO strategie.
Je suggereert relevante, haalbare keywords met realistisch search volume en difficulty.`,
          },
          {
            role: 'user',
            content: `Doe keyword research voor dit onderwerp:

TOPIC: ${options.topic}
${options.industry ? `INDUSTRY: ${options.industry}` : ''}
${options.targetAudience ? `TARGET AUDIENCE: ${options.targetAudience}` : ''}

Genereer:
1. 5-10 primaire keywords (hoog search volume, medium-high difficulty)
   - Met relevantie score (0-100)
   - Difficulty level (low/medium/high)
   - Search intent (informational/navigational/transactional/commercial)
2. 10-15 long-tail keywords (lager volume, lagere difficulty, meer specifiek)
3. ${options.includeQuestions ? '10-15 relevante vragen die mensen stellen' : ''}
4. 5-10 gerelateerde topics voor content expansie

Antwoord ALLEEN met valide JSON:
{
  "primary": [
    {
      "keyword": "main keyword",
      "relevance": 95,
      "difficulty": "medium",
      "searchIntent": "commercial"
    }
  ],
  "longTail": [
    {
      "keyword": "long tail keyword phrase",
      "relevance": 85
    }
  ],
  "questions": [
    "What is...?",
    "How to...?"
  ],
  "relatedTopics": [
    "Related topic 1",
    "Related topic 2"
  ]
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No keyword research generated')
      }

      const research = JSON.parse(content) as KeywordResearchResult

      return {
        success: true,
        data: research,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate schema markup
   */
  async generateSchemaMarkup(
    options: SchemaMarkupOptions,
  ): Promise<AIGenerationResult<Record<string, any>>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      aiLogger.log('info', 'Generating schema markup', 'SEOOptimizer', { type: options.type })

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in structured data en schema.org markup.
Je genereert valide schema markup volgens schema.org specificaties.`,
          },
          {
            role: 'user',
            content: `Genereer schema.org ${options.type} markup voor deze data:

${JSON.stringify(options.data, null, 2)}

Genereer valide schema.org JSON-LD markup die:
1. Voldoet aan ${options.type} specificaties
2. Alle relevante properties bevat
3. Valid is volgens schema.org validator

Antwoord met valide schema.org JSON-LD markup.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No schema markup generated')
      }

      const schema = JSON.parse(content)

      return {
        success: true,
        data: schema,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Optimize content for SEO
   */
  async optimizeContent(
    content: string,
    targetKeywords: string[],
  ): Promise<AIGenerationResult<string>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert SEO copywriter.
Je optimaliseert content voor SEO zonder de leesbaarheid te verliezen.`,
          },
          {
            role: 'user',
            content: `Optimaliseer deze content voor SEO met focus op deze keywords: ${targetKeywords.join(', ')}

ORIGINELE CONTENT:
${content}

Verbeter de content door:
1. Keywords natuurlijk te integreren (niet overstuffing)
2. Heading structuur te verbeteren
3. Readability te verbeteren
4. Meta description toe te voegen
5. Internal linking opportunities te identificeren

Behoud de tone en core message.

Antwoord met de geoptimaliseerde content.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const optimizedContent = completion.choices[0]?.message?.content
      if (!optimizedContent) {
        throw new AIGenerationError('No optimized content generated')
      }

      return {
        success: true,
        data: optimizedContent,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate SEO-friendly URL slug
   */
  async generateSlug(title: string, keywords?: string[]): Promise<AIGenerationResult<string>> {
    try {
      // Simple slug generation without AI for speed
      let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // If keywords provided, ensure main keyword is in slug
      if (keywords && keywords.length > 0) {
        const mainKeyword = keywords[0].toLowerCase().replace(/\s+/g, '-')
        if (!slug.includes(mainKeyword)) {
          slug = `${mainKeyword}-${slug}`
        }
      }

      // Limit to 60 characters
      if (slug.length > 60) {
        slug = slug.substring(0, 60).replace(/-[^-]*$/, '')
      }

      return {
        success: true,
        data: slug,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

// Export singleton instance
export const seoOptimizer = new SEOOptimizerService()
