/**
 * Groq AI Client
 *
 * Fast inference API for Llama models (100x faster than OpenAI)
 * Free tier: 14,400 requests/day
 * OpenAI-compatible API
 */

import OpenAI from 'openai'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
}

/**
 * Groq Client for fast AI inference
 *
 * Usage:
 * ```typescript
 * const groq = new GroqClient()
 * const response = await groq.chat([
 *   { role: 'user', content: 'Hallo!' }
 * ])
 * console.log(response.content)
 * ```
 */
export class GroqClient {
  private client: OpenAI
  private defaultModel: string = 'llama3-70b-8192'

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY is not configured. Get a free API key at: https://console.groq.com/keys',
      )
    }

    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  }

  /**
   * Chat completion
   *
   * @param messages - Conversation messages
   * @param options - Chat options
   * @returns Chat response
   */
  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 500,
      stream = false,
    } = options

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      })

      return {
        content: response.choices[0].message.content || '',
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        finishReason: response.choices[0].finish_reason,
      }
    } catch (error: any) {
      console.error('[Groq] Chat error:', error)

      // Check for rate limiting
      if (error?.status === 429) {
        throw new Error('Groq rate limit exceeded. Please try again later.')
      }

      // Check for invalid API key
      if (error?.status === 401) {
        throw new Error('Invalid Groq API key. Check your GROQ_API_KEY environment variable.')
      }

      throw new Error(`Groq chat failed: ${error?.message || 'Unknown error'}`)
    }
  }

  /**
   * Generate embeddings for text
   * Note: Groq doesn't support embeddings yet, use Ollama or OpenAI instead
   */
  async embed(text: string): Promise<number[]> {
    throw new Error(
      'Groq does not support embeddings. Use Ollama (nomic-embed-text) or OpenAI (text-embedding-ada-002) instead.',
    )
  }

  /**
   * Check if Groq API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.chat([{ role: 'user', content: 'ping' }], { maxTokens: 5 })
      return true
    } catch (error) {
      console.error('[Groq] Health check failed:', error)
      return false
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'llama3-70b-8192', // Recommended (best quality)
      'llama3-8b-8192', // Fast & efficient
      'mixtral-8x7b-32768', // Good alternative
      'gemma-7b-it', // Smaller model
    ]
  }
}
