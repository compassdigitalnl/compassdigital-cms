/**
 * RAG Chatbot Service
 *
 * Combines Meilisearch (search) + AI (Groq/OpenAI) for accurate, context-aware responses
 * RAG = Retrieval Augmented Generation
 */

import { GroqClient, type ChatMessage } from './GroqClient'
import OpenAI from 'openai'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'

export interface ChatbotMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface ChatbotContext {
  title: string
  content: string
  url?: string
  collection?: string
}

export interface ChatbotResponse {
  answer: string
  sources: Array<{
    title: string
    url: string
    excerpt?: string
  }>
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
}

export interface ChatbotSettings {
  enabled: boolean
  model: 'groq' | 'gpt-4' | 'gpt-3.5' | 'ollama' | 'hybrid'
  temperature: number
  maxTokens: number
  contextWindow: number
  systemPrompt?: string
  trainingContext?: string
  knowledgeBaseIntegration?: {
    enabled: boolean
    maxResults: number
    includeSourceLinks: boolean
    searchCollections: string[]
  }
}

/**
 * RAG Chatbot Service
 *
 * Usage:
 * ```typescript
 * const chatbot = new RAGChatbotService()
 * const response = await chatbot.chat('Wat zijn jullie openingstijden?')
 * console.log(response.answer)
 * console.log(response.sources) // Bronnen uit kennisbank
 * ```
 */
export class RAGChatbotService {
  private groq: GroqClient | null = null
  private openai: OpenAI | null = null

  constructor() {
    // Initialize Groq if API key is available
    if (process.env.GROQ_API_KEY) {
      this.groq = new GroqClient()
    }

    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }
  }

  /**
   * Chat with RAG (Retrieval Augmented Generation)
   *
   * @param query - User question
   * @param conversationHistory - Previous messages
   * @returns Chatbot response with sources
   */
  async chat(
    query: string,
    conversationHistory: ChatbotMessage[] = [],
  ): Promise<ChatbotResponse> {
    // Check feature flag
    if (!isFeatureEnabled('chatbot')) {
      throw new Error('Chatbot feature is not enabled. Set ENABLE_CHATBOT=true in .env')
    }

    // Get chatbot settings from Payload
    const settings = await this.getSettings()

    if (!settings.enabled) {
      throw new Error('Chatbot is disabled in settings')
    }

    // Step 1: Search knowledge base for relevant context
    const contexts = settings.knowledgeBaseIntegration?.enabled
      ? await this.searchKnowledgeBase(query, settings)
      : []

    // Step 2: Build system prompt with context
    const systemPrompt = this.buildSystemPrompt(settings, contexts)

    // Step 3: Build conversation messages
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...this.buildConversationHistory(conversationHistory, settings.contextWindow),
      { role: 'user', content: query },
    ]

    // Step 4: Determine which model to use
    const model = settings.model === 'hybrid' ? this.determineModel(query) : settings.model

    // Step 5: Get AI response
    let response: ChatbotResponse

    if (model === 'groq' && this.groq) {
      response = await this.chatWithGroq(messages, settings)
    } else if ((model === 'gpt-4' || model === 'gpt-3.5') && this.openai) {
      response = await this.chatWithOpenAI(messages, settings, model)
    } else if (model === 'ollama') {
      response = await this.chatWithOllama(messages, settings)
    } else {
      // Fallback to Groq or OpenAI
      if (this.groq) {
        response = await this.chatWithGroq(messages, settings)
      } else if (this.openai) {
        response = await this.chatWithOpenAI(messages, settings, 'gpt-3.5')
      } else {
        throw new Error('No AI model available. Configure GROQ_API_KEY or OPENAI_API_KEY.')
      }
    }

    // Step 6: Add sources if enabled
    if (settings.knowledgeBaseIntegration?.includeSourceLinks) {
      response.sources = contexts.map((ctx) => ({
        title: ctx.title,
        url: ctx.url || '#',
        excerpt: ctx.content.substring(0, 150) + '...',
      }))
    }

    return response
  }

  /**
   * Search knowledge base via Meilisearch
   */
  private async searchKnowledgeBase(
    query: string,
    settings: ChatbotSettings,
  ): Promise<ChatbotContext[]> {
    const maxResults = settings.knowledgeBaseIntegration?.maxResults || 3
    const collections = settings.knowledgeBaseIntegration?.searchCollections || ['blog-posts']

    const contexts: ChatbotContext[] = []

    try {
      // Search via Meilisearch API endpoint
      const searchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/search?q=${encodeURIComponent(query)}&limit=${maxResults}`

      const response = await fetch(searchUrl)
      const data = await response.json()

      if (data.hits && data.hits.length > 0) {
        const payload = await getPayload({ config })

        // Get full content for top results
        for (const hit of data.hits.slice(0, maxResults)) {
          try {
            // Determine collection from hit
            const collection = hit.collection || 'blog-posts'

            // Skip if not in allowed collections
            if (!collections.includes(collection)) continue

            // Fetch full document
            const doc = await payload.findByID({
              collection: collection as any,
              id: hit.id,
              depth: 0,
            })

            if (doc) {
              contexts.push({
                title: doc.title || hit.title || 'Untitled',
                content: this.extractTextContent(doc),
                url: this.buildDocumentUrl(doc, collection),
                collection,
              })
            }
          } catch (error) {
            console.error('[RAG] Error fetching document:', error)
          }
        }
      }
    } catch (error) {
      console.error('[RAG] Knowledge base search error:', error)
    }

    return contexts
  }

  /**
   * Extract text content from document
   */
  private extractTextContent(doc: any): string {
    let text = ''

    // Add title
    if (doc.title) {
      text += doc.title + '\n\n'
    }

    // Add excerpt/description
    if (doc.excerpt) {
      text += doc.excerpt + '\n\n'
    } else if (doc.description) {
      text += doc.description + '\n\n'
    }

    // Extract from Lexical content
    if (doc.content && typeof doc.content === 'object') {
      text += this.extractFromLexical(doc.content)
    } else if (typeof doc.content === 'string') {
      text += doc.content
    }

    // Limit to ~500 words
    const words = text.split(/\s+/).slice(0, 500).join(' ')
    return words
  }

  /**
   * Extract plain text from Lexical content
   */
  private extractFromLexical(content: any): string {
    if (!content || !content.root || !content.root.children) {
      return ''
    }

    let text = ''

    function traverse(node: any) {
      if (!node) return

      if (node.text) {
        text += node.text + ' '
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
    }

    traverse(content.root)
    return text
  }

  /**
   * Build document URL
   */
  private buildDocumentUrl(doc: any, collection: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

    switch (collection) {
      case 'blog-posts':
        const category = doc.categories?.[0]?.slug || 'algemeen'
        return `${baseUrl}/blog/${category}/${doc.slug}`
      case 'pages':
        return `${baseUrl}/${doc.slug}`
      case 'products':
        return `${baseUrl}/${doc.slug}`
      case 'faqs':
        return `${baseUrl}/faq#${doc.slug}`
      default:
        return baseUrl
    }
  }

  /**
   * Build system prompt with context
   */
  private buildSystemPrompt(settings: ChatbotSettings, contexts: ChatbotContext[]): string {
    let prompt = settings.systemPrompt || this.getDefaultSystemPrompt()

    // Add training context
    if (settings.trainingContext) {
      prompt += '\n\n' + settings.trainingContext
    }

    // Add retrieved context
    if (contexts.length > 0) {
      prompt += '\n\nRelevante informatie uit de kennisbank:\n\n'
      contexts.forEach((ctx, i) => {
        prompt += `--- Bron ${i + 1}: ${ctx.title} ---\n${ctx.content}\n\n`
      })
      prompt += '\nGebruik deze informatie om accurate antwoorden te geven.'
    }

    return prompt
  }

  /**
   * Default system prompt
   */
  private getDefaultSystemPrompt(): string {
    const companyName = process.env.COMPANY_NAME || 'ons bedrijf'

    return `Je bent een behulpzame AI assistent voor ${companyName}.

Beantwoord vragen vriendelijk, professioneel en in het Nederlands.
Gebruik de beschikbare context om accurate informatie te geven.
Als je het antwoord niet zeker weet, zeg dit eerlijk.
Houd antwoorden kort en to-the-point (max 3-4 zinnen).`
  }

  /**
   * Build conversation history
   */
  private buildConversationHistory(
    history: ChatbotMessage[],
    contextWindow: number,
  ): ChatMessage[] {
    return history.slice(-contextWindow).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))
  }

  /**
   * Determine which model to use based on query complexity
   */
  private determineModel(query: string): 'groq' | 'gpt-4' | 'gpt-3.5' {
    const wordCount = query.split(/\s+/).length
    const hasCode = /```|code|function|class/i.test(query)
    const hasMath = /berekening|formule|equation/i.test(query)
    const hasComplex = /waarom|uitleg|verschil tussen|vergelijk/i.test(query)

    // Complex queries → GPT-4
    if (wordCount > 30 || hasCode || hasMath || hasComplex) {
      return this.openai ? 'gpt-4' : 'groq'
    }

    // Medium queries → GPT-3.5
    if (wordCount > 15) {
      return this.openai ? 'gpt-3.5' : 'groq'
    }

    // Simple queries → Groq (fast & free)
    return 'groq'
  }

  /**
   * Chat with Groq
   */
  private async chatWithGroq(
    messages: ChatMessage[],
    settings: ChatbotSettings,
  ): Promise<ChatbotResponse> {
    if (!this.groq) {
      throw new Error('Groq client not initialized')
    }

    const response = await this.groq.chat(messages, {
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    })

    return {
      answer: response.content,
      sources: [],
      model: 'groq-llama3-70b',
      usage: response.usage,
      cost: 0, // Groq is free (or very cheap)
    }
  }

  /**
   * Chat with OpenAI
   */
  private async chatWithOpenAI(
    messages: ChatMessage[],
    settings: ChatbotSettings,
    model: 'gpt-4' | 'gpt-3.5',
  ): Promise<ChatbotResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized')
    }

    const modelName = model === 'gpt-4' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo'

    const response = await this.openai.chat.completions.create({
      model: modelName,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
    })

    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0

    // Calculate cost (approximate)
    const cost =
      model === 'gpt-4'
        ? (inputTokens * 0.01 + outputTokens * 0.03) / 1000 // GPT-4 pricing
        : (inputTokens * 0.0005 + outputTokens * 0.0015) / 1000 // GPT-3.5 pricing

    return {
      answer: response.choices[0].message.content || '',
      sources: [],
      model: modelName,
      usage: {
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        totalTokens: response.usage?.total_tokens || 0,
      },
      cost,
    }
  }

  /**
   * Chat with Ollama (self-hosted)
   */
  private async chatWithOllama(
    messages: ChatMessage[],
    settings: ChatbotSettings,
  ): Promise<ChatbotResponse> {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:8b',
          messages,
          stream: false,
          options: {
            temperature: settings.temperature,
            num_predict: settings.maxTokens,
          },
        }),
      })

      const data = await response.json()

      return {
        answer: data.message.content,
        sources: [],
        model: 'ollama-llama3-8b',
        cost: 0, // Self-hosted is free
      }
    } catch (error) {
      console.error('[RAG] Ollama error:', error)
      throw new Error('Ollama server not available. Check OLLAMA_URL.')
    }
  }

  /**
   * Get chatbot settings from Payload
   */
  private async getSettings(): Promise<ChatbotSettings> {
    try {
      const payload = await getPayload({ config })
      const settings = await payload.findGlobal({
        slug: 'chatbot-settings',
        depth: 0,
      })

      return {
        enabled: settings.enabled ?? true,
        model: settings.model || 'groq',
        temperature: settings.temperature ?? 0.7,
        maxTokens: settings.maxTokens ?? 500,
        contextWindow: settings.contextWindow ?? 5,
        systemPrompt: settings.systemPrompt,
        trainingContext: settings.trainingContext,
        knowledgeBaseIntegration: settings.knowledgeBaseIntegration,
      }
    } catch (error) {
      console.error('[RAG] Error loading settings:', error)

      // Return defaults
      return {
        enabled: true,
        model: 'groq',
        temperature: 0.7,
        maxTokens: 500,
        contextWindow: 5,
        knowledgeBaseIntegration: {
          enabled: true,
          maxResults: 3,
          includeSourceLinks: true,
          searchCollections: ['blog-posts', 'pages'],
        },
      }
    }
  }
}
