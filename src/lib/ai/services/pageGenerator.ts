/**
 * Page Generator Service
 * AI service for generating complete pages with multiple blocks
 */

import { openai } from '../client'
import { aiLogger } from '../logger'
import { AIGenerationError, AIConfigurationError } from '../errors'
import type { AIGenerationResult } from '../types'
import { blockGenerator } from './blockGenerator'

export interface PageGenerationOptions {
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
  language?: string
}

export interface PageStructure {
  title: string
  slug: string
  metaDescription?: string
  blocks: Array<{
    type: string
    data: any
  }>
}

/**
 * Page templates with predefined structures
 */
const PAGE_TEMPLATES = {
  landing: {
    name: 'Landing Page',
    description: 'Complete landing page for products/services',
    defaultBlocks: ['hero', 'services', 'testimonials', 'pricing', 'faq', 'cta'],
    requiredBlocks: ['hero', 'cta'],
  },
  about: {
    name: 'About Page',
    description: 'Company about page with team and history',
    defaultBlocks: ['hero', 'content', 'team', 'stats', 'cta'],
    requiredBlocks: ['content'],
  },
  services: {
    name: 'Services Page',
    description: 'Services or products overview page',
    defaultBlocks: ['hero', 'services', 'content', 'pricing', 'faq', 'cta'],
    requiredBlocks: ['services'],
  },
  contact: {
    name: 'Contact Page',
    description: 'Contact page with form and info',
    defaultBlocks: ['hero', 'contactForm', 'map', 'faq'],
    requiredBlocks: ['contactForm'],
  },
  blog: {
    name: 'Blog Landing',
    description: 'Blog overview/landing page',
    defaultBlocks: ['hero', 'content', 'cta'],
    requiredBlocks: ['content'],
  },
}

export class PageGeneratorService {
  /**
   * Generate a complete page structure
   */
  async generatePage(options: PageGenerationOptions): Promise<AIGenerationResult<PageStructure>> {
    const startTime = Date.now()

    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      aiLogger.log('info', 'Generating page structure', 'PageGenerator', { options })

      // Step 1: Determine page structure (which blocks to include)
      const blockTypes = await this.determinePageStructure(options)

      // Step 2: Generate page metadata (title, slug, meta description)
      const metadata = await this.generatePageMetadata(options)

      // Step 3: Generate all blocks
      const blocks = await this.generateAllBlocks(blockTypes, options.businessInfo)

      const pageStructure: PageStructure = {
        ...metadata,
        blocks,
      }

      const duration = Date.now() - startTime

      aiLogger.log('info', `Page generated successfully in ${duration}ms`, 'PageGenerator', {
        blockCount: blocks.length,
        duration,
      })

      return {
        success: true,
        data: pageStructure,
      }
    } catch (error) {
      const duration = Date.now() - startTime

      aiLogger.log('error', 'Page generation failed', 'PageGenerator', {
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
   * Generate page from template
   */
  async generateFromTemplate(
    templateName: keyof typeof PAGE_TEMPLATES,
    options: Omit<PageGenerationOptions, 'pageType'>,
  ): Promise<AIGenerationResult<PageStructure>> {
    const template = PAGE_TEMPLATES[templateName]

    if (!template) {
      return {
        success: false,
        error: `Unknown template: ${templateName}`,
      }
    }

    return this.generatePage({
      ...options,
      pageType: templateName as any,
    })
  }

  /**
   * Determine which blocks should be included in the page
   */
  private async determinePageStructure(
    options: PageGenerationOptions,
  ): Promise<string[]> {
    // If pageType is specified, use template
    if (options.pageType && PAGE_TEMPLATES[options.pageType]) {
      const template = PAGE_TEMPLATES[options.pageType]
      let blocks = [...template.defaultBlocks]

      // Apply user preferences
      if (options.preferences) {
        if (options.preferences.includeHero === false) {
          blocks = blocks.filter((b) => b !== 'hero')
        }
        if (options.preferences.includePricing === false) {
          blocks = blocks.filter((b) => b !== 'pricing')
        }
        if (options.preferences.includeFAQ === false) {
          blocks = blocks.filter((b) => b !== 'faq')
        }
        if (options.preferences.includeTestimonials === false) {
          blocks = blocks.filter((b) => b !== 'testimonials')
        }
        if (options.preferences.includeContactForm === false) {
          blocks = blocks.filter((b) => b !== 'contactForm')
        }
        if (options.preferences.maxBlocks && blocks.length > options.preferences.maxBlocks) {
          blocks = blocks.slice(0, options.preferences.maxBlocks)
        }
      }

      // Ensure required blocks are included
      for (const required of template.requiredBlocks) {
        if (!blocks.includes(required)) {
          blocks.unshift(required)
        }
      }

      return blocks
    }

    // Otherwise, ask AI to suggest blocks
    const result = await blockGenerator.suggestBlocks(
      options.pagePurpose,
      options.businessInfo,
    )

    if (result.success && result.data) {
      return result.data
    }

    // Fallback to basic structure
    return ['hero', 'content', 'cta']
  }

  /**
   * Generate page metadata (title, slug, description)
   */
  private async generatePageMetadata(
    options: PageGenerationOptions,
  ): Promise<Pick<PageStructure, 'title' | 'slug' | 'metaDescription'>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in SEO en website structuur.
Je genereert pakkende pagina titels, SEO-vriendelijke slugs en meta descriptions.`,
          },
          {
            role: 'user',
            content: `Genereer metadata voor een pagina met het volgende doel:
"${options.pagePurpose}"

${options.businessInfo ? `
Bedrijfsinformatie:
- Naam: ${options.businessInfo.name || 'niet opgegeven'}
- Industrie: ${options.businessInfo.industry || 'niet opgegeven'}
- Doelgroep: ${options.businessInfo.targetAudience || 'niet opgegeven'}
` : ''}

Genereer:
1. Een pakkende pagina titel (max 60 tekens)
2. Een SEO-vriendelijke slug (lowercase, hyphens, geen speciale tekens)
3. Een overtuigende meta description (max 160 tekens)

Antwoord met JSON:
{
  "title": "Pagina Titel Hier",
  "slug": "pagina-slug-hier",
  "metaDescription": "Meta description hier..."
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No metadata generated')
      }

      return JSON.parse(content)
    } catch (error) {
      // Fallback metadata
      const slug = options.pagePurpose
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      return {
        title: options.pagePurpose,
        slug,
        metaDescription: options.pagePurpose.substring(0, 160),
      }
    }
  }

  /**
   * Generate all blocks for the page
   */
  private async generateAllBlocks(
    blockTypes: string[],
    businessInfo?: PageGenerationOptions['businessInfo'],
  ): Promise<Array<{ type: string; data: any }>> {
    const blocks: Array<{ type: string; data: any }> = []

    // Generate blocks sequentially to maintain context
    for (const blockType of blockTypes) {
      try {
        const result = await blockGenerator.generateBlock({
          blockType,
          mode: 'smart',
          businessInfo,
        })

        if (result.success && result.data) {
          blocks.push({
            type: blockType,
            data: result.data,
          })
        } else {
          aiLogger.log('warn', `Failed to generate block: ${blockType}`, 'PageGenerator', {
            error: result.error,
          })
        }
      } catch (error) {
        aiLogger.log('error', `Error generating block: ${blockType}`, 'PageGenerator', {
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return blocks
  }

  /**
   * Generate multiple page variations
   */
  async generateVariations(
    options: PageGenerationOptions,
    count: number = 3,
  ): Promise<AIGenerationResult<PageStructure[]>> {
    try {
      const variations: PageStructure[] = []

      for (let i = 0; i < count; i++) {
        const result = await this.generatePage(options)
        if (result.success && result.data) {
          variations.push(result.data)
        }
      }

      return {
        success: true,
        data: variations,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Optimize existing page structure
   */
  async optimizePage(
    currentStructure: PageStructure,
    optimizationGoal: string,
  ): Promise<AIGenerationResult<PageStructure>> {
    try {
      if (!openai) {
        throw new AIConfigurationError('OpenAI client is not configured')
      }

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Je bent een expert in website optimalisatie en UX.
Je analyseert pagina structuren en suggereert verbeteringen.`,
          },
          {
            role: 'user',
            content: `Analyseer deze pagina structuur en optimaliseer voor: "${optimizationGoal}"

Huidige structuur:
${JSON.stringify(currentStructure, null, 2)}

Suggereer verbeteringen:
1. Moeten blocks worden toegevoegd, verwijderd of verplaatst?
2. Welke volgorde is optimaal voor conversie?
3. Welke blocks missen er mogelijk?

Antwoord met een verbeterde pagina structuur in hetzelfde JSON formaat.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new AIGenerationError('No optimization generated')
      }

      const optimizedStructure = JSON.parse(content)

      return {
        success: true,
        data: optimizedStructure,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get available page templates
   */
  getTemplates(): typeof PAGE_TEMPLATES {
    return PAGE_TEMPLATES
  }
}

// Export singleton instance
export const pageGenerator = new PageGeneratorService()
