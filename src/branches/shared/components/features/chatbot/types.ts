/**
 * Chatbot TypeScript Types
 *
 * Shared types for chatbot widget and API integration.
 */

export interface ChatbotMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
  sources?: ChatbotSource[]
  model?: string
  usage?: ChatbotUsage
  cost?: number
}

export interface ChatbotSource {
  title: string
  url: string
  excerpt?: string
}

export interface ChatbotUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface ChatbotSettings {
  enabled: boolean
  model: 'groq' | 'gpt-4' | 'gpt-3.5' | 'ollama' | 'hybrid'
  temperature: number
  maxTokens: number
  contextWindow: number
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  buttonColor: string
  buttonIcon: 'chat' | 'robot' | 'lightbulb' | 'question'
  welcomeMessage: string
  placeholder: string
  suggestedQuestions?: Array<{
    question: string
  }>
  systemPrompt?: string
  trainingContext?: string
  knowledgeBaseIntegration?: {
    enabled: boolean
    maxResults: number
    includeSourceLinks: boolean
    searchCollections: string[]
  }
  rateLimiting?: {
    enabled: boolean
    maxMessagesPerHour: number
    maxMessagesPerDay: number
    cooldownSeconds: number
    blockedIPs?: Array<{ ip: string }>
  }
  moderation?: {
    enabled: boolean
    blockedKeywords?: Array<{ keyword: string }>
  }
  fallback?: {
    enableFallback: boolean
    fallbackMessage: string
    contactEmail?: string
  }
  analytics?: {
    enableLogging: boolean
    enableAnalytics: boolean
    retentionDays: number
  }
}

export interface ChatbotAPIRequest {
  message: string
  conversationHistory?: ChatbotMessage[]
  sessionId?: string
}

export interface ChatbotAPIResponse {
  success: boolean
  data?: {
    answer: string
    sources: ChatbotSource[]
    model: string
    usage?: ChatbotUsage
    cost?: number
    timestamp: number
  }
  error?: string
  message?: string
}

export interface ChatbotAvailability {
  available: boolean
  reason?: string
  models?: {
    groq: boolean
    openai: boolean
    ollama: boolean
  }
}
