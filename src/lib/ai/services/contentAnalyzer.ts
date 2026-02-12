/**
 * Content Analyzer Service
 * AI-powered content analysis and improvement suggestions
 */

import { openai } from '../client'
import type {
  AIGenerationResult,
  ReadabilityAnalysis,
  ToneAnalysis,
  GrammarCheckResult,
  ContentStructureAnalysis,
  ImprovementSuggestion,
  SentimentAnalysis,
  ContentAnalysisResult,
} from '../types'

class ContentAnalyzerService {
  private model = process.env.AI_MODEL || 'gpt-4-turbo-preview'

  /**
   * Analyze content readability
   */
  async analyzeReadability(content: string): Promise<AIGenerationResult<ReadabilityAnalysis>> {
    try {
      const systemPrompt = `Je bent een expert in leesbaarheidsanalyse. Analyseer de gegeven tekst en geef een gedetailleerde leesbaarheidsanalyse.

Bereken en analyseer:
1. Leesbaarheidscore (0-100, waarbij 100 = zeer makkelijk te lezen)
2. Leesniveau (zeer makkelijk, makkelijk, gemiddeld, moeilijk, zeer moeilijk)
3. Gemiddelde zinslengte
4. Gemiddelde woordlengte
5. Percentage lange zinnen (>25 woorden)
6. Percentage moeilijke woorden (>3 lettergrepen)
7. Aanbevelingen voor verbetering

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "score": 75,
  "level": "makkelijk",
  "metrics": {
    "averageSentenceLength": 18,
    "averageWordLength": 5.2,
    "longSentencesPercentage": 15,
    "difficultWordsPercentage": 12
  },
  "issues": [
    {
      "type": "long_sentences",
      "count": 3,
      "description": "3 zinnen zijn langer dan 25 woorden"
    }
  ],
  "suggestions": [
    "Splits lange zinnen op in kortere delen",
    "Gebruik eenvoudigere synoniemen waar mogelijk"
  ]
}`

      const userPrompt = `Analyseer de leesbaarheid van deze tekst:

${content}

Geef een gedetailleerde leesbaarheidsanalyse.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const analysis = JSON.parse(result) as ReadabilityAnalysis

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Readability analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Readability analysis failed',
      }
    }
  }

  /**
   * Analyze content tone
   */
  async analyzeTone(content: string): Promise<AIGenerationResult<ToneAnalysis>> {
    try {
      const systemPrompt = `Je bent een expert in toon- en stijlanalyse. Analyseer de toon van de gegeven tekst.

Identificeer:
1. Primaire toon (professional, casual, friendly, formal, persuasive, informative, etc.)
2. Toonsterkte (0-100, hoe consistent is de toon)
3. Emotionele ondertoon (enthousiast, neutraal, voorzichtig, etc.)
4. Formaliteitsniveau (zeer formeel, formeel, neutraal, informeel, zeer informeel)
5. Specifieke toonkenmerken
6. Aanbevelingen voor consistentie

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "primaryTone": "professional",
  "toneStrength": 85,
  "emotionalUndertone": "confident",
  "formalityLevel": "formal",
  "characteristics": [
    "Gebruikt vakjargon",
    "Duidelijke structuur",
    "Objectieve presentatie"
  ],
  "consistency": {
    "score": 90,
    "issues": ["Enkele informele uitdrukkingen in paragraaf 3"]
  },
  "suggestions": [
    "Vervang informele uitdrukkingen door professionele alternatieven",
    "Handhaaf consistente formaliteit door hele tekst"
  ]
}`

      const userPrompt = `Analyseer de toon van deze tekst:

${content}

Geef een gedetailleerde toonanalyse.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const analysis = JSON.parse(result) as ToneAnalysis

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Tone analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tone analysis failed',
      }
    }
  }

  /**
   * Check grammar and style
   */
  async checkGrammar(content: string, language = 'nl'): Promise<AIGenerationResult<GrammarCheckResult>> {
    try {
      const systemPrompt = `Je bent een expert taalkundige en editor voor het ${language === 'nl' ? 'Nederlands' : 'Engels'}. Controleer de tekst op grammatica-, spelling- en stijlfouten.

Identificeer:
1. Spelfouten met correcties
2. Grammaticafouten met uitleg
3. Stijlverbeteringen
4. Interpunctiefouten
5. Woordkeuzeverbeteringen

Categoriseer fouten als:
- critical: Duidelijke grammatica-/spelfouten
- warning: Stijl- en leesbaarheidsverbeteringen
- suggestion: Optionele verbeteringen

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "totalIssues": 5,
  "issuesBySeverity": {
    "critical": 1,
    "warning": 2,
    "suggestion": 2
  },
  "issues": [
    {
      "type": "spelling",
      "severity": "critical",
      "text": "organisatie",
      "suggestion": "organisatie",
      "explanation": "Spelfout: moet 'organisatie' zijn",
      "position": { "start": 45, "end": 56 }
    }
  ],
  "overallScore": 85,
  "summary": "Tekst is over het algemeen goed geschreven met enkele kleine verbeteringen"
}`

      const userPrompt = `Controleer deze ${language === 'nl' ? 'Nederlandse' : 'Engelse'} tekst op grammatica, spelling en stijl:

${content}

Geef een gedetailleerde analyse met alle gevonden problemen.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const analysis = JSON.parse(result) as GrammarCheckResult

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Grammar check error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Grammar check failed',
      }
    }
  }

  /**
   * Analyze content structure
   */
  async analyzeStructure(content: string): Promise<AIGenerationResult<ContentStructureAnalysis>> {
    try {
      const systemPrompt = `Je bent een expert in content structuur en organisatie. Analyseer de structuur van de gegeven tekst.

Analyseer:
1. Heading hiërarchie (H1, H2, H3, etc.)
2. Paragraaflengte en -verdeling
3. Lijstgebruik
4. Logische flow en transitie
5. Informatiedichtheid
6. Structurele verbeteringen

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "headingStructure": {
    "h1": 1,
    "h2": 3,
    "h3": 5,
    "optimal": true,
    "issues": []
  },
  "paragraphs": {
    "count": 8,
    "averageLength": 120,
    "tooLong": 1,
    "tooShort": 0,
    "optimal": false
  },
  "lists": {
    "count": 2,
    "types": ["bulleted", "numbered"],
    "suggestions": ["Overweeg een lijst in paragraaf 4"]
  },
  "flow": {
    "score": 80,
    "issues": ["Abrupte overgang tussen paragraaf 2 en 3"],
    "suggestions": ["Voeg transitiezin toe tussen paragraaf 2 en 3"]
  },
  "density": {
    "score": 75,
    "level": "balanced",
    "suggestions": []
  },
  "overallScore": 78,
  "improvements": [
    "Splits lange paragraaf 5 op in twee delen",
    "Voeg subheadings toe aan sectie 2 voor betere scanability"
  ]
}`

      const userPrompt = `Analyseer de structuur van deze tekst:

${content}

Geef een gedetailleerde structuuranalyse.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const analysis = JSON.parse(result) as ContentStructureAnalysis

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Structure analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Structure analysis failed',
      }
    }
  }

  /**
   * Get improvement suggestions
   */
  async getImprovementSuggestions(
    content: string,
    focusAreas?: string[]
  ): Promise<AIGenerationResult<ImprovementSuggestion[]>> {
    try {
      const focusText = focusAreas?.length
        ? `\n\nFocus vooral op: ${focusAreas.join(', ')}`
        : ''

      const systemPrompt = `Je bent een expert content editor en schrijfcoach. Geef concrete, actionable verbeteringssuggesties voor de gegeven tekst.

Categorieën:
- clarity: Duidelijkheid verbeteren
- engagement: Engagement verhogen
- conciseness: Beknopter maken
- structure: Structuur verbeteren
- tone: Toon aanpassen
- seo: SEO optimaliseren

Prioriteit:
- high: Belangrijke verbeteringen
- medium: Nuttige verbeteringen
- low: Optionele verfijningen

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "suggestions": [
    {
      "category": "clarity",
      "priority": "high",
      "issue": "Jargon in eerste paragraaf kan lezers afschrikken",
      "suggestion": "Vervang technische termen door begrijpelijkere alternatieven",
      "example": {
        "before": "De UX-optimalisatie faciliteert...",
        "after": "De gebruikerservaring verbeteringen zorgen voor..."
      },
      "impact": "Maakt content toegankelijker voor bredere doelgroep"
    }
  ]
}`

      const userPrompt = `Geef concrete verbeteringssuggesties voor deze tekst:

${content}${focusText}

Geef prioriteit aan de belangrijkste verbeteringen.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const data = JSON.parse(result)
      const suggestions = data.suggestions as ImprovementSuggestion[]

      return {
        success: true,
        data: suggestions,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Improvement suggestions error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Getting improvement suggestions failed',
      }
    }
  }

  /**
   * Analyze sentiment
   */
  async analyzeSentiment(content: string): Promise<AIGenerationResult<SentimentAnalysis>> {
    try {
      const systemPrompt = `Je bent een expert in sentiment en emotieanalyse. Analyseer het sentiment van de gegeven tekst.

Analyseer:
1. Overall sentiment (positive, negative, neutral, mixed)
2. Sentiment score (-100 tot +100)
3. Emotionele toon (excited, calm, concerned, etc.)
4. Subjectiviteit (0-100, objectief tot subjectief)
5. Emotionele intensiteit (0-100)
6. Specifieke emoties gevonden

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "overall": "positive",
  "score": 65,
  "confidence": 85,
  "emotionalTone": "enthusiastic",
  "subjectivity": 45,
  "intensity": 70,
  "emotions": [
    { "emotion": "excitement", "strength": 75 },
    { "emotion": "confidence", "strength": 80 }
  ],
  "keyPhrases": [
    { "phrase": "geweldige resultaten", "sentiment": "positive" }
  ],
  "suggestions": [
    "Voeg meer data toe om enthousiasme te ondersteunen",
    "Balanceer emotionele taal met objectieve feiten"
  ]
}`

      const userPrompt = `Analyseer het sentiment van deze tekst:

${content}

Geef een gedetailleerde sentimentanalyse.`

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = completion.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from AI')
      }

      const analysis = JSON.parse(result) as SentimentAnalysis

      return {
        success: true,
        data: analysis,
        tokensUsed: completion.usage?.total_tokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sentiment analysis failed',
      }
    }
  }

  /**
   * Complete content analysis
   * Combines all analysis types into one comprehensive report
   */
  async analyzeContent(
    content: string,
    options?: {
      language?: string
      focusAreas?: string[]
      includeGrammarCheck?: boolean
    }
  ): Promise<AIGenerationResult<ContentAnalysisResult>> {
    try {
      const language = options?.language || 'nl'
      const includeGrammar = options?.includeGrammarCheck ?? true

      // Run all analyses in parallel for speed
      const [
        readabilityResult,
        toneResult,
        grammarResult,
        structureResult,
        sentimentResult,
        improvementsResult,
      ] = await Promise.all([
        this.analyzeReadability(content),
        this.analyzeTone(content),
        includeGrammar ? this.checkGrammar(content, language) : Promise.resolve(null),
        this.analyzeStructure(content),
        this.analyzeSentiment(content),
        this.getImprovementSuggestions(content, options?.focusAreas),
      ])

      // Check if any critical analysis failed
      if (!readabilityResult.success || !toneResult.success || !structureResult.success || !sentimentResult.success || !improvementsResult.success) {
        const errors = [
          !readabilityResult.success ? readabilityResult.error : null,
          !toneResult.success ? toneResult.error : null,
          !structureResult.success ? structureResult.error : null,
          !sentimentResult.success ? sentimentResult.error : null,
          !improvementsResult.success ? improvementsResult.error : null,
        ].filter(Boolean)

        throw new Error(`Analysis failed: ${errors.join(', ')}`)
      }

      // Calculate overall content quality score
      const scores = [
        readabilityResult.data!.score,
        toneResult.data!.toneStrength,
        structureResult.data!.overallScore,
        grammarResult?.success ? grammarResult.data!.overallScore : 85, // Default if not checked
      ]

      const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

      const totalTokens = [
        readabilityResult.tokensUsed || 0,
        toneResult.tokensUsed || 0,
        grammarResult?.tokensUsed || 0,
        structureResult.tokensUsed || 0,
        sentimentResult.tokensUsed || 0,
        improvementsResult.tokensUsed || 0,
      ].reduce((a, b) => a + b, 0)

      const result: ContentAnalysisResult = {
        overallScore,
        readability: readabilityResult.data!,
        tone: toneResult.data!,
        grammar: grammarResult?.success ? grammarResult.data! : undefined,
        structure: structureResult.data!,
        sentiment: sentimentResult.data!,
        improvements: improvementsResult.data!,
        summary: this.generateSummary(overallScore, {
          readability: readabilityResult.data!,
          tone: toneResult.data!,
          grammar: grammarResult?.data,
          structure: structureResult.data!,
        }),
      }

      return {
        success: true,
        data: result,
        tokensUsed: totalTokens,
        model: this.model,
      }
    } catch (error) {
      console.error('Complete content analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Complete content analysis failed',
      }
    }
  }

  /**
   * Generate summary of analysis
   */
  private generateSummary(
    score: number,
    analyses: {
      readability: ReadabilityAnalysis
      tone: ToneAnalysis
      grammar?: GrammarCheckResult
      structure: ContentStructureAnalysis
    }
  ): string {
    const parts: string[] = []

    // Overall assessment
    if (score >= 85) {
      parts.push('Uitstekende content kwaliteit.')
    } else if (score >= 70) {
      parts.push('Goede content kwaliteit met ruimte voor verbetering.')
    } else if (score >= 50) {
      parts.push('Redelijke content kwaliteit, meerdere verbeteringen aanbevolen.')
    } else {
      parts.push('Content heeft aanzienlijke verbeteringen nodig.')
    }

    // Readability
    if (analyses.readability.score >= 75) {
      parts.push(`Goed leesbaar (${analyses.readability.level}).`)
    } else {
      parts.push(`Leesbaarheid kan verbeterd worden (${analyses.readability.level}).`)
    }

    // Tone
    parts.push(`Toon is ${analyses.tone.primaryTone} met ${analyses.tone.formalityLevel} formaliteit.`)

    // Grammar (if checked)
    if (analyses.grammar) {
      if (analyses.grammar.totalIssues === 0) {
        parts.push('Geen grammatica- of spelfouten gevonden.')
      } else if (analyses.grammar.issuesBySeverity.critical > 0) {
        parts.push(`${analyses.grammar.issuesBySeverity.critical} kritieke taalfouten gevonden.`)
      }
    }

    // Structure
    if (analyses.structure.overallScore >= 75) {
      parts.push('Goede content structuur.')
    } else {
      parts.push('Content structuur kan verbeterd worden.')
    }

    return parts.join(' ')
  }
}

// Export singleton instance
export const contentAnalyzer = new ContentAnalyzerService()
