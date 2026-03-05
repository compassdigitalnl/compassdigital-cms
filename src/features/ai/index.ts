/**
 * AI & Chatbot Feature Module
 *
 * Centralizes all AI-related functionality:
 * - AI components (content generation, translation, SEO, etc.)
 * - Chatbot components (widget, provider, hook)
 * - AI services & lib (GroqClient, RAG, prompts, etc.)
 * - ChatbotSettings global
 */

// AI Components
export {
  AIButton,
  AIGenerationModal,
  AIFieldWrapper,
  AIContentGenerator,
  AITextButton,
  AIImproveButton,
  AITranslateButton,
  AIImageGenerator,
  AIImageButton,
  AIBlockGenerator,
  AIPageGenerator,
  AISEOOptimizer,
  AIContentAnalyzer,
  AITranslator,
  AIQuickTranslate,
  AIMultiLanguage,
} from './components/ai'

// Chatbot Components
export {
  ChatbotWidget,
  ChatbotProvider,
  useChatbot,
} from './components/chatbot'

export type {
  ChatbotMessage,
  ChatbotSource,
  ChatbotUsage,
  ChatbotSettings as ChatbotSettingsType,
  ChatbotAPIRequest,
  ChatbotAPIResponse,
  ChatbotAvailability,
} from './components/chatbot'

// AI Services & Lib
export * from './lib'

// ChatbotSettings Global (Payload collection config)
export { ChatbotSettings } from './globals/ChatbotSettings'
