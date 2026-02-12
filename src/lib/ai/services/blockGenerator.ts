/**
 * Block Generator Service
 * AI service for generating complete block content
 */

import { openai } from '../client'
import { aiLogger } from '../logger'
import { AIGenerationError, AIConfigurationError } from '../errors'
import type { AIGenerationResult } from '../types'

export interface BlockGenerationOptions {
  blockType: string
  mode?: 'full' | 'structure' | 'smart'
  customPrompt?: string
  businessInfo?: {
    name?: string
    industry?: string
    targetAudience?: string
    tone?: string
  }
  language?: string
}

export interface BlockData {
  [key: string]: any
}

/**
 * Block prompts and templates
 */
const BLOCK_PROMPTS = {
  hero: {
    systemPrompt: `Je bent een expert copywriter gespecialiseerd in het schrijven van krachtige hero secties voor websites.
Je schrijft pakkende headlines die aandacht trekken en duidelijk de waardepropositie communiceren.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een hero sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer een hero sectie met:
1. Een krachtige, aandachttrekkende titel (max 60 tekens)
2. Een subtekst die de waardepropositie uitlegt (max 160 tekens)
3. Primaire CTA knoptekst (max 20 tekens)
4. Optionele secundaire CTA knoptekst (max 20 tekens)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "title": "De hoofdtitel hier",
  "subtitle": "De subtekst hier",
  "primaryCTA": {
    "text": "Primaire knop tekst",
    "link": "/contact"
  },
  "secondaryCTA": {
    "text": "Secundaire knop tekst",
    "link": "/diensten"
  }
}`,
  },

  services: {
    systemPrompt: `Je bent een expert in het schrijven van diensten beschrijvingen.
Je maakt duidelijke, bondige en aantrekkelijke beschrijvingen die de voordelen van diensten benadrukken.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een diensten sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een sectie titel
2. Een intro tekst (2-3 zinnen)
3. 4-6 diensten, elk met:
   - Naam (max 40 tekens)
   - Beschrijving (2-3 zinnen, max 200 tekens)
   - Link slug

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Onze Diensten",
  "intro": "Intro tekst hier",
  "services": [
    {
      "name": "Dienst naam",
      "description": "Beschrijving van de dienst...",
      "link": "/diensten/dienst-slug"
    }
  ],
  "layout": "grid-3"
}`,
  },

  faq: {
    systemPrompt: `Je bent een expert in het schrijven van FAQ content.
Je schrijft duidelijke vragen die klanten echt stellen en geeft heldere, nuttige antwoorden.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een FAQ sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een sectie titel
2. 6-8 veelgestelde vragen met duidelijke antwoorden
   - Vraag moet specifiek en relevant zijn
   - Antwoord moet helder en compleet zijn (2-4 zinnen)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Veelgestelde Vragen",
  "items": [
    {
      "question": "Vraag hier?",
      "answer": "Antwoord hier..."
    }
  ],
  "generateSchema": true
}`,
  },

  testimonials: {
    systemPrompt: `Je bent een expert in het schrijven van authentieke klantreviews en testimonials.
Je schrijft geloofwaardige reviews die specifieke voordelen en resultaten benadrukken.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een testimonials sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een sectie titel
2. 4-5 klantreviews met:
   - Authentieke quote (2-3 zinnen, max 200 tekens)
   - Fictieve maar realistische naam
   - Functie en bedrijf
   - Rating (4-5 sterren)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Wat Klanten Zeggen",
  "items": [
    {
      "quote": "Testimonial tekst hier...",
      "name": "Jan Jansen",
      "role": "CEO bij Bedrijf BV",
      "rating": 5
    }
  ]
}`,
  },

  cta: {
    systemPrompt: `Je bent een expert copywriter gespecialiseerd in call-to-action teksten.
Je schrijft overtuigende teksten die actie uitlokken zonder opdringerig te zijn.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een CTA (Call to Action) sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een krachtige heading (max 60 tekens)
2. Een overtuigende tekst (2-3 zinnen, max 200 tekens)
3. CTA knoptekst (max 20 tekens)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Ready om te Starten?",
  "text": "Overtuigende tekst hier...",
  "button": {
    "text": "Neem Contact Op",
    "link": "/contact"
  },
  "style": "gradient"
}`,
  },

  pricing: {
    systemPrompt: `Je bent een expert in het opstellen van prijstabellen en pakketten.
Je maakt duidelijke, eerlijke pricing structures die waarde communiceren.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een pricing sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een sectie titel
2. 3 prijspakketten (Basic, Pro, Enterprise) met:
   - Naam
   - Prijs (realistisch voor de industrie)
   - Periode (per maand)
   - Korte beschrijving
   - 6-8 features
   - CTA tekst

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Kies Je Pakket",
  "plans": [
    {
      "name": "Basic",
      "price": "€99",
      "period": "per maand",
      "description": "Perfect voor starters",
      "features": [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ],
      "cta": "Kies Basic",
      "highlighted": false
    }
  ]
}`,
  },

  team: {
    systemPrompt: `Je bent een expert in het schrijven van professionele team member bio's.
Je schrijft persoonlijke maar professionele beschrijvingen die expertise en persoonlijkheid tonen.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een team sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een sectie titel
2. 4-6 team members met:
   - Fictieve maar realistische naam
   - Realistische functie voor de industrie
   - Bio (2-3 zinnen, max 200 tekens)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Ons Team",
  "members": [
    {
      "name": "Jan Jansen",
      "role": "CEO & Founder",
      "bio": "Bio tekst hier..."
    }
  ],
  "layout": "grid-3"
}`,
  },

  content: {
    systemPrompt: `Je bent een expert contentwriter die boeiende, informatieve teksten schrijft.
Je schrijft helder, gestructureerd en met een natuurlijke flow.`,

    userPrompt: (options: BlockGenerationOptions) => `
Genereer een content sectie voor een website.

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

${options.customPrompt ? `Extra instructies: ${options.customPrompt}` : ''}

Genereer:
1. Een heading
2. Rijke content (4-6 paragrafen)

Antwoord ALLEEN met valide JSON in dit formaat:
{
  "heading": "Over Ons",
  "content": "<p>Paragraaf 1...</p><p>Paragraaf 2...</p>"
}`,
  },
}

export class BlockGeneratorService {
  /**
   * Generate complete block content
   */
  async generateBlock(options: BlockGenerationOptions): Promise<AIGenerationResult<BlockData>> {
    const startTime = Date.now()

    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      const blockPrompt = BLOCK_PROMPTS[options.blockType as keyof typeof BLOCK_PROMPTS]

      if (!blockPrompt) {
        throw new AIGenerationError(`Unknown block type: ${options.blockType}`)
      }

      aiLogger.log(
        'info',
        `Generating block: ${options.blockType}`,
        'BlockGenerator',
        { options },
      )

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: blockPrompt.systemPrompt,
          },
          {
            role: 'user',
            content: blockPrompt.userPrompt(options),
          },
        ],
        temperature: options.mode === 'structure' ? 0.3 : 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      })

      const generatedContent = completion.choices[0]?.message?.content

      if (!generatedContent) {
        throw new AIGenerationError('No content generated')
      }

      // Parse JSON response
      const blockData = JSON.parse(generatedContent)

      const duration = Date.now() - startTime

      aiLogger.log('info', `Block generated successfully in ${duration}ms`, 'BlockGenerator', {
        blockType: options.blockType,
        tokensUsed: completion.usage?.total_tokens,
      })

      return {
        success: true,
        data: blockData,
        tokensUsed: completion.usage?.total_tokens,
        model: completion.model,
      }
    } catch (error) {
      const duration = Date.now() - startTime

      aiLogger.log('error', 'Block generation failed', 'BlockGenerator', {
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
   * Generate multiple blocks at once
   */
  async generateMultipleBlocks(
    blockTypes: string[],
    businessInfo?: BlockGenerationOptions['businessInfo'],
  ): Promise<AIGenerationResult<Record<string, BlockData>>> {
    try {
      const results: Record<string, BlockData> = {}

      for (const blockType of blockTypes) {
        const result = await this.generateBlock({
          blockType,
          mode: 'smart',
          businessInfo,
        })

        if (result.success && result.data) {
          results[blockType] = result.data
        }
      }

      return {
        success: true,
        data: results,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Suggest blocks based on page purpose
   */
  async suggestBlocks(
    pagePurpose: string,
    businessInfo?: BlockGenerationOptions['businessInfo'],
  ): Promise<AIGenerationResult<string[]>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in website structuur en UX.
Je suggereert de beste blocks voor een pagina gebaseerd op het doel.

Beschikbare blocks:
- hero (grote intro sectie)
- services (diensten overzicht)
- faq (veelgestelde vragen)
- testimonials (klantreviews)
- cta (call to action)
- content (tekst content)
- pricing (prijstabel)
- team (team members)
- logoBar (partner logo's)
- stats (statistieken)
- contactForm (contactformulier)`,
          },
          {
            role: 'user',
            content: `Suggereer de beste blocks voor een pagina met doel: "${pagePurpose}"

${businessInfo ? `Bedrijfscontext: ${businessInfo.industry || 'algemeen'}` : ''}

Antwoord met een JSON array van block slugs in de juiste volgorde, bijvoorbeeld:
["hero", "services", "testimonials", "cta"]`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No suggestions generated')
      }

      const parsed = JSON.parse(content)
      const blocks = parsed.blocks || parsed.suggested_blocks || []

      return {
        success: true,
        data: blocks,
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
export const blockGenerator = new BlockGeneratorService()
