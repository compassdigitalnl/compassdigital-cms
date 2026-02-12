/**
 * Image Generation Service
 * Handles AI image generation using DALL-E
 */

import { getAIClient, aiClient } from '../client'
import { buildImagePrompt } from '../prompts'
import type { ImageGenerationOptions, AIGenerationResult, AIImageResult } from '../types'

export class ImageGeneratorService {
  /**
   * Generate image from prompt
   */
  async generateImage(
    options: ImageGenerationOptions,
  ): Promise<AIGenerationResult<AIImageResult>> {
    try {
      if (!aiClient.isAvailable()) {
        return {
          success: false,
          error: 'AI service not available. Please configure OPENAI_API_KEY.',
        }
      }

      const client = getAIClient()

      const response = await client.images.generate({
        model: aiClient.imageModel,
        prompt: options.prompt,
        n: 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'natural',
      })

      const imageData = response.data[0]

      if (!imageData?.url) {
        return {
          success: false,
          error: 'No image URL returned',
        }
      }

      return {
        success: true,
        data: {
          url: imageData.url,
          revisedPrompt: imageData.revised_prompt,
        },
        model: aiClient.imageModel,
      }
    } catch (error) {
      console.error('Image generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate hero background image
   */
  async generateHeroImage(
    businessDescription: string,
    brandColors?: string[],
  ): Promise<AIGenerationResult<AIImageResult>> {
    const prompt = buildImagePrompt(
      `Hero background for ${businessDescription}`,
      'modern',
      brandColors,
    )

    return this.generateImage({
      prompt,
      size: '1792x1024',
      quality: 'hd',
      style: 'vivid',
    })
  }

  /**
   * Generate featured image for blog/case study
   */
  async generateFeaturedImage(
    title: string,
    description: string,
  ): Promise<AIGenerationResult<AIImageResult>> {
    const prompt = buildImagePrompt(
      `Featured image for article titled "${title}": ${description}`,
      'professional',
    )

    return this.generateImage({
      prompt,
      size: '1792x1024',
      quality: 'standard',
    })
  }

  /**
   * Generate service icon/illustration
   */
  async generateServiceIcon(
    serviceName: string,
    style: 'modern' | 'minimalist' = 'minimalist',
  ): Promise<AIGenerationResult<AIImageResult>> {
    const prompt = buildImagePrompt(`Icon or illustration for ${serviceName} service`, style)

    return this.generateImage({
      prompt,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural',
    })
  }

  /**
   * Generate team member photo (placeholder)
   */
  async generateTeamPhoto(
    description: string,
  ): Promise<AIGenerationResult<AIImageResult>> {
    const prompt = `Professional business portrait photo: ${description}. Photorealistic, studio lighting, professional attire, neutral background.`

    return this.generateImage({
      prompt,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    })
  }
}

// Export singleton instance
export const imageGenerator = new ImageGeneratorService()
