/**
 * OpenAI Client Configuration
 * Centralized client for all AI operations
 */

import OpenAI from 'openai'
import type { AIModel, AIImageModel } from './types'

class AIClient {
  private client: OpenAI | null = null
  private apiKey: string | undefined
  public readonly model: AIModel
  public readonly imageModel: AIImageModel

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
    this.model = (process.env.AI_MODEL as AIModel) || 'gpt-4-turbo-preview'
    this.imageModel = (process.env.AI_IMAGE_MODEL as AIImageModel) || 'dall-e-3'
  }

  /**
   * Get or initialize OpenAI client
   */
  getClient(): OpenAI {
    if (!this.apiKey) {
      throw new Error(
        'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.',
      )
    }

    if (!this.client) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
      })
    }

    return this.client
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      textModel: this.model,
      imageModel: this.imageModel,
      isAvailable: this.isAvailable(),
    }
  }
}

// Export singleton instance
export const aiClient = new AIClient()

// Export client getter for convenience
export const getAIClient = () => aiClient.getClient()

// Export openai instance (lazy-loaded) for backward compatibility
export const openai = aiClient.getClient()
