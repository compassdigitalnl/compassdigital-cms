/**
 * Content Generation Service
 * Handles all text content generation using OpenAI
 */

import { getAIClient, aiClient } from '../client'
import { buildContentPrompt, SYSTEM_PROMPTS } from '../prompts'
import type { ContentGenerationOptions, AIGenerationResult } from '../types'

export class ContentGeneratorService {
  /**
   * Generate text content based on prompt
   */
  async generateContent(
    options: ContentGenerationOptions,
  ): Promise<AIGenerationResult<string>> {
    try {
      if (!aiClient.isAvailable()) {
        return {
          success: false,
          error: 'AI service not available. Please configure OPENAI_API_KEY.',
        }
      }

      const client = getAIClient()

      const fullPrompt = buildContentPrompt(
        options.prompt,
        options.tone,
        options.language,
        options.context ? JSON.parse(options.context) : undefined,
      )

      const completion = await client.chat.completions.create({
        model: aiClient.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.contentWriter },
          { role: 'user', content: fullPrompt },
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        return {
          success: false,
          error: 'No content generated',
        }
      }

      return {
        success: true,
        data: content.trim(),
        tokensUsed: completion.usage?.total_tokens,
        model: completion.model,
      }
    } catch (error) {
      console.error('Content generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate page title from description
   */
  async generateTitle(
    description: string,
    language: ContentGenerationOptions['language'] = 'nl',
  ): Promise<AIGenerationResult<string>> {
    return this.generateContent({
      prompt: `Generate a compelling page title (max 60 characters) for: ${description}`,
      language,
      tone: 'professional',
      maxTokens: 100,
    })
  }

  /**
   * Generate meta description
   */
  async generateMetaDescription(
    content: string,
    language: ContentGenerationOptions['language'] = 'nl',
  ): Promise<AIGenerationResult<string>> {
    return this.generateContent({
      prompt: `Write a compelling meta description (120-160 characters) for the following content: ${content}`,
      language,
      tone: 'persuasive',
      maxTokens: 150,
    })
  }

  /**
   * Generate hero section content
   */
  async generateHeroContent(
    businessInfo: string,
    language: ContentGenerationOptions['language'] = 'nl',
  ): Promise<AIGenerationResult<{ title: string; subtitle: string; cta: string }>> {
    try {
      const result = await this.generateContent({
        prompt: `Generate hero section content for: ${businessInfo}. Return JSON with: title (max 60 chars), subtitle (max 160 chars), cta (max 20 chars)`,
        language,
        tone: 'enthusiastic',
        maxTokens: 300,
      })

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error,
        }
      }

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(result.data)
        return {
          success: true,
          data: parsed,
          tokensUsed: result.tokensUsed,
        }
      } catch {
        // If not JSON, extract manually
        return {
          success: true,
          data: {
            title: result.data.split('\n')[0] || '',
            subtitle: result.data.split('\n')[1] || '',
            cta: 'Neem contact op',
          },
          tokensUsed: result.tokensUsed,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Generate service descriptions
   */
  async generateServiceDescription(
    serviceName: string,
    businessContext: string,
    language: ContentGenerationOptions['language'] = 'nl',
  ): Promise<AIGenerationResult<string>> {
    return this.generateContent({
      prompt: `Write a concise service description (2-3 sentences) for "${serviceName}" in the context of: ${businessContext}`,
      language,
      tone: 'professional',
      maxTokens: 200,
    })
  }

  /**
   * Improve existing content
   */
  async improveContent(
    existingContent: string,
    improvements: string[] = ['clarity', 'engagement', 'seo'],
    language: ContentGenerationOptions['language'] = 'nl',
  ): Promise<AIGenerationResult<string>> {
    const improvementList = improvements.join(', ')
    return this.generateContent({
      prompt: `Improve the following content for ${improvementList}. Keep the same meaning and length:\n\n${existingContent}`,
      language,
      tone: 'professional',
      maxTokens: existingContent.split(' ').length * 2,
    })
  }
}

// Export singleton instance
export const contentGenerator = new ContentGeneratorService()
