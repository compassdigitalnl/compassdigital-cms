/**
 * Chatbot Chat API Endpoint
 *
 * POST /api/chatbot/chat
 * Send a message to the AI chatbot and get a response
 */

import { NextRequest, NextResponse } from 'next/server'
import { RAGChatbotService, type ChatbotMessage } from '@/lib/ai/RAGChatbotService'
import { isFeatureEnabled } from '@/lib/features'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ChatRequest {
  message: string
  conversationHistory?: ChatbotMessage[]
  sessionId?: string
}

export async function POST(req: NextRequest) {
  try {
    // Check feature flag
    if (!isFeatureEnabled('chatbot')) {
      return NextResponse.json(
        {
          error: 'Chatbot feature is not enabled',
          hint: 'Set ENABLE_CHATBOT=true in .env',
        },
        { status: 403 },
      )
    }

    // Parse request body
    const body: ChatRequest = await req.json()
    const { message, conversationHistory = [], sessionId } = body

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Message is required',
        },
        { status: 400 },
      )
    }

    // Limit message length
    if (message.length > 1000) {
      return NextResponse.json(
        {
          error: 'Message is too long (max 1000 characters)',
        },
        { status: 400 },
      )
    }

    // Rate limiting (basic - check conversation history length)
    if (conversationHistory.length > 50) {
      return NextResponse.json(
        {
          error: 'Conversation is too long. Please start a new conversation.',
        },
        { status: 429 },
      )
    }

    // Initialize chatbot service
    const chatbot = new RAGChatbotService()

    // Get response
    const response = await chatbot.chat(message, conversationHistory)

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        answer: response.answer,
        sources: response.sources,
        model: response.model,
        usage: response.usage,
        cost: response.cost,
        timestamp: Date.now(),
      },
    })
  } catch (error: any) {
    console.error('[Chatbot API] Error:', error)

    // Check for specific errors
    if (error.message?.includes('not enabled')) {
      return NextResponse.json(
        {
          error: 'Chatbot is disabled',
          message: error.message,
        },
        { status: 403 },
      )
    }

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'Please configure GROQ_API_KEY or OPENAI_API_KEY',
        },
        { status: 500 },
      )
    }

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Please try again in a few moments',
        },
        { status: 429 },
      )
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Failed to get chatbot response',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 },
    )
  }
}

// GET endpoint to check if chatbot is available
export async function GET(req: NextRequest) {
  try {
    // Check feature flag
    if (!isFeatureEnabled('chatbot')) {
      return NextResponse.json({
        available: false,
        reason: 'Chatbot feature is not enabled',
      })
    }

    // Check API keys
    const hasGroq = !!process.env.GROQ_API_KEY
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const hasOllama = !!process.env.OLLAMA_URL

    if (!hasGroq && !hasOpenAI && !hasOllama) {
      return NextResponse.json({
        available: false,
        reason: 'No AI service configured',
      })
    }

    return NextResponse.json({
      available: true,
      models: {
        groq: hasGroq,
        openai: hasOpenAI,
        ollama: hasOllama,
      },
    })
  } catch (error) {
    return NextResponse.json({
      available: false,
      reason: 'Error checking chatbot availability',
    })
  }
}
